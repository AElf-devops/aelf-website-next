# Blog And Website Docker Deployment Runbook

## Goal

Deploy one production-ready aelf website + self-hosted blog stack from scratch with Docker:

- Website: Next.js container serving `aelf.com`, `/posts/:slug`, `/blog`, `/latest-posts`, blog SEO, sitemap, and ISR revalidation.
- CMS: Strapi container serving Admin UI, blog content API, and scheduled publishing through `strapi-plugin-publisher`.
- Database: PostgreSQL container for Strapi content and admin data.
- Backup: PostgreSQL sidecar that creates and prunes scheduled dumps.

The recommended production flow is split by service. Do not use local development commands for production.

## Recommended Topology

For the current MVP release, use two 2C4G machines:

| Machine | Services | Public access | Notes |
| --- | --- | --- | --- |
| Website machine(s) | Existing website Docker container and Nginx | `aelf.com`, later `blog.aelf.com` | Website is stateless. Every website machine needs the same CMS env values. |
| CMS machine | PostgreSQL, `postgres-backup`, Strapi | `cms.aelf.com` or private `:1337` | Keep PostgreSQL private. Expose Strapi only through Nginx or a private IP/firewall rule. |

Keep PostgreSQL and Strapi on the same Docker host for the MVP release. Strapi then reaches PostgreSQL through the private Docker network `aelf-blog_aelf_blog`, and port `5432` is never published on the host.

## Deployment Files

| File | Where to copy | Purpose |
| --- | --- | --- |
| `docker-compose.blog-postgres.yml` | `/opt/aelf/blog-postgres/` | PostgreSQL + backup sidecar. |
| `deploy/blog-postgres.env.example` | `/opt/aelf/blog-postgres/deploy/blog-postgres.env` | PostgreSQL database name, user, password. |
| `docker-compose.blog-strapi.yml` | `/opt/aelf/blog-strapi/` | Strapi only. Joins the PostgreSQL Docker network. |
| `deploy/blog-strapi.env.example` | `/opt/aelf/blog-strapi/deploy/blog-strapi.env` | Strapi image, port bind, Docker network, DB connection. |
| `cms/.env.production.example` | `/opt/aelf/blog-strapi/cms/.env.production` | Strapi app secrets and S3 upload config. |
| Website `envfile` | `/opt/official-web/aelf-website-next/envfile` | Runtime env for the existing website Docker release script. |

`docker-compose.blog.yml` is for local full-stack verification only. `docker-compose.blog.prod.yml` is a single-machine CMS fallback for PostgreSQL + Strapi + backup; do not run it on top of an existing PostgreSQL deployment.

## Prerequisites

- Docker and Docker Compose plugin are installed on every target machine.
- The website image has been built by the existing website release pipeline.
- The Strapi image has been built and pushed to the registry for the target architecture.
- A golden CMS dump is available from the validated local database.
- S3 credentials for bucket `aelf.com`, region `ap-east-1`, root path `blog` are ready.
- DNS/Nginx access is available for `aelf.com`, `blog.aelf.com`, and optionally `cms.aelf.com`.

## 1. Export The Golden CMS Data

Run this on the local machine where the validated 251-post CMS database lives:

```bash
cd /Users/huangzongzhe/workspace/AElf/aelf-website-next

mkdir -p .tmp
docker compose -p aelf-blog -f docker-compose.blog.yml exec -T postgres \
  pg_dump -Fc -U aelf_blog -d aelf_blog \
  > .tmp/aelf_blog_cms_$(date +%Y%m%d_%H%M%S).dump

ls -lh .tmp/aelf_blog_cms_*.dump
```

Copy the dump to the CMS machine:

```bash
scp .tmp/aelf_blog_cms_*.dump <user>@<CMS_MACHINE_IP>:/tmp/
```

## 2. Build And Push Strapi Image

Run this in CI or on a build machine. If the production machine is `linux/amd64`, build an amd64 image even when building from an Apple Silicon laptop.

```bash
TAG=$(git rev-parse --short HEAD)
IMAGE=richardaelf/aelf-website-next-strapi:${TAG}-amd64

docker buildx build \
  --platform linux/amd64 \
  -f cms/Dockerfile \
  -t "$IMAGE" \
  --push \
  cms
```

If the CI runner already runs on amd64, this simpler form is also fine:

```bash
TAG=$(git rev-parse --short HEAD)
IMAGE=<registry>/aelf/aelf-blog-strapi:${TAG}

docker build -f cms/Dockerfile -t "$IMAGE" cms
docker push "$IMAGE"
```

## 3. Start PostgreSQL

Run on the CMS machine:

```bash
sudo mkdir -p /opt/aelf/blog-postgres/{deploy,import,backups/postgres}
sudo chown -R "$USER:$USER" /opt/aelf/blog-postgres
cd /opt/aelf/blog-postgres
```

Copy repo files into this directory:

```text
docker-compose.blog-postgres.yml
deploy/blog-postgres.env
```

Move the dump into place:

```bash
mv /tmp/aelf_blog_cms_*.dump /opt/aelf/blog-postgres/import/
```

Create `/opt/aelf/blog-postgres/deploy/blog-postgres.env`:

```bash
cat > deploy/blog-postgres.env <<'EOF'
BLOG_DATABASE_NAME=aelf_blog
BLOG_DATABASE_USERNAME=aelf_blog
BLOG_DATABASE_PASSWORD=replace_with_strong_password
EOF
chmod 600 deploy/blog-postgres.env
```

Start PostgreSQL:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres
```

On first start, the `postgres:16-alpine` image initializes the database, user, password, and Docker volume from `deploy/blog-postgres.env`. After that, the volume is the source of truth; changing the env file later does not rewrite an existing database volume.

Verify health:

```bash
docker inspect -f '{{.State.Health.Status}}' aelf-blog-postgres-1
```

Import data:

```bash
set -a
source deploy/blog-postgres.env
set +a

docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  exec -T postgres \
  pg_restore --clean --if-exists --no-owner \
  -U "$BLOG_DATABASE_USERNAME" \
  -d "$BLOG_DATABASE_NAME" \
  < import/aelf_blog_cms_*.dump
```

Verify the published post count:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  exec -T postgres \
  psql -U "$BLOG_DATABASE_USERNAME" -d "$BLOG_DATABASE_NAME" \
  -c "select count(*) as published_posts from blog_posts where published_at is not null;"
```

Expected:

```text
published_posts
-----------------
251
```

Start the backup sidecar:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres-backup
```

Verify at least one dump is created:

```bash
sleep 10
find backups/postgres -maxdepth 3 -type f -name '*.dump' -print -exec ls -lh {} \;
```

Backup retention is automatic:

- daily dumps: 7 days
- weekly dumps: 4 weeks
- monthly dumps: 6 months

## 4. Start Strapi CMS

Run on the same CMS machine:

```bash
sudo mkdir -p /opt/aelf/blog-strapi/{cms,deploy}
sudo chown -R "$USER:$USER" /opt/aelf/blog-strapi
cd /opt/aelf/blog-strapi
```

Copy repo files into this directory:

```text
docker-compose.blog-strapi.yml
deploy/blog-strapi.env
cms/.env.production
```

Create `/opt/aelf/blog-strapi/deploy/blog-strapi.env`:

```bash
cat > deploy/blog-strapi.env <<'EOF'
STRAPI_IMAGE=richardaelf/aelf-website-next-strapi:<tag>-amd64
STRAPI_ENV_FILE=./cms/.env.production

# Use 127.0.0.1 when Nginx is on the same machine.
# Use 0.0.0.0 or the private machine IP only when website machines must call Strapi directly.
STRAPI_HOST_BIND=127.0.0.1
STRAPI_HOST_PORT=1337

BLOG_DOCKER_NETWORK=aelf-blog_aelf_blog

DATABASE_HOST=postgres
DATABASE_PORT=5432
BLOG_DATABASE_NAME=aelf_blog
BLOG_DATABASE_USERNAME=aelf_blog
BLOG_DATABASE_PASSWORD=<same_password_as_blog-postgres.env>
DATABASE_SSL=false

BLOG_PREVIEW_ORIGIN=https://aelf.com
STRAPI_PREVIEW_SECRET=<same_preview_secret_as_website_env>
EOF
chmod 600 deploy/blog-strapi.env
```

Create `/opt/aelf/blog-strapi/cms/.env.production`:

```bash
cat > cms/.env.production <<'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=<key1>,<key2>
API_TOKEN_SALT=<secret>
ADMIN_JWT_SECRET=<secret>
TRANSFER_TOKEN_SALT=<secret>
JWT_SECRET=<secret>
ENCRYPTION_KEY=<secret>

DATABASE_CLIENT=postgres
DATABASE_SSL=false

CRON_ENABLED=true
PLUGIN_PUBLISHER_ENABLED=true
BLOG_REVALIDATE_URL=https://blog.aelf.com/api/blog/revalidate
STRAPI_REVALIDATE_SECRET=<same_secret_as_website_env>
BLOG_PREVIEW_ORIGIN=https://aelf.com
STRAPI_PREVIEW_SECRET=<same_preview_secret_as_website_env>

AWS_ACCESS_KEY_ID=<production_s3_key>
AWS_ACCESS_SECRET=<production_s3_secret>
AWS_REGION=ap-east-1
AWS_BUCKET=aelf.com
AWS_ACL=public-read
AWS_ROOT_PATH=blog
AWS_SIGNED_URL_EXPIRES=900
AWS_CDN_URL=https://s3.ap-east-1.amazonaws.com/aelf.com
EOF
chmod 600 cms/.env.production
```

Generate Strapi secrets with:

```bash
openssl rand -base64 32
```

`CRON_ENABLED` and `PLUGIN_PUBLISHER_ENABLED` enable scheduled publishing. Keep both values enabled on exactly one Strapi instance. If Strapi is later scaled to multiple containers, disable cron on the extra containers to avoid duplicate scheduled actions.

Start Strapi:

```bash
docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  up -d
```

Verify:

```bash
docker inspect -f '{{.State.Health.Status}}' aelf-blog-strapi-strapi-1
curl -I http://127.0.0.1:1337/admin
curl -s 'http://127.0.0.1:1337/api/blog-posts?pagination%5BpageSize%5D=1' | head -c 300
curl -s 'http://127.0.0.1:1337/api/blog-posts?filters%5BpublishedAt%5D%5B%24notNull%5D=true&pagination%5BpageSize%5D=1' | grep -o '"total":[0-9]*'
```

Expected total:

```text
"total":251
```

## 5. Initialize Strapi Admin And API Access

Strapi is restored from the golden database, so production usually starts with `hasAdmin:true`. Verify the Admin bootstrap state:

```bash
curl -s http://127.0.0.1:1337/admin/init
```

Expected after restoring the golden dump:

```json
{"data":{"uuid":false,"hasAdmin":true,"menuLogo":null,"authLogo":null}}
```

If the restored admin account is known, reset its password before handing CMS access to editors:

```bash
cd /opt/aelf/blog-strapi

docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  exec strapi \
  npm run strapi -- admin:reset-user-password \
  --email <admin_email> \
  --password '<new_strong_password>'
```

If this is a fresh database and `hasAdmin:false`, create the first Super Admin instead:

```bash
cd /opt/aelf/blog-strapi

docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  exec strapi \
  npm run strapi -- admin:create-user \
  --email <admin_email> \
  --password '<new_strong_password>' \
  --firstname aelf \
  --lastname Admin
```

Then initialize editorial access:

1. Open Strapi Admin through `cms.aelf.com` or an SSH tunnel.
2. Confirm `Blog Post`, `Blog Category`, and `Blog Tag` appear in Content Manager.
3. Create production editor accounts instead of sharing the Super Admin account.
4. Create a new production API token for the website. Use read-only access and enable reads for `blog-post`, `blog-category`, `blog-tag`, and media assets if the UI exposes granular permissions.
5. Save this token only in the website `envfile`; do not reuse local API tokens restored from the dump.

Verify the API token from the CMS machine:

```bash
STRAPI_API_TOKEN='<production_read_only_token>'

curl -s \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  'http://127.0.0.1:1337/api/blog-posts?pagination%5BpageSize%5D=1&fields%5B0%5D=title' \
  | head -c 300
```

Verify media/S3 setup:

1. In Strapi Admin, upload one small test image to Media Library.
2. Confirm it loads through the returned S3/CDN URL under `https://s3.ap-east-1.amazonaws.com/aelf.com/blog/`.
3. Delete the test asset after verification if it should not stay in production.

Create the website revalidation secret now and keep the same value for Website env and Strapi scheduled-publish hooks:

```bash
openssl rand -base64 32
```

## 6. Publish The Website Container

The website uses the existing Docker release flow. The important part is that every website container receives the CMS runtime env.

Edit `/opt/official-web/aelf-website-next/envfile` on each website machine. Replace existing keys if they already exist:

```bash
cat >> /opt/official-web/aelf-website-next/envfile <<'EOF'
STRAPI_API_URL=<cms_api_origin>
STRAPI_API_TOKEN=<production_read_only_token>
STRAPI_REVALIDATE_SECRET=<production_revalidate_secret>
STRAPI_PREVIEW_SECRET=<production_preview_secret>
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com
# Optional. Missing or false keeps PAAL disabled.
NEXT_PUBLIC_PAAL_CHAT_ENABLED=false
EOF
```

Use `STRAPI_API_URL=https://cms.aelf.com` when Strapi is behind the CMS reverse proxy. Use `STRAPI_API_URL=http://<CMS_PRIVATE_IP>:1337` only when Strapi binds to a private interface or `0.0.0.0` and firewall rules restrict access to website machines.
Use `STRAPI_PREVIEW_SECRET` for real website previews at `/posts/preview/<slug-or-documentId>?secret=...`. The website API token must be allowed to read draft Blog Post records for this preview route. Strapi also needs `BLOG_PREVIEW_ORIGIN=https://aelf.com` and the same `STRAPI_PREVIEW_SECRET` so it can auto-fill the Blog Post `previewUrl` field.

Deploy or restart with the existing website `start.sh` pattern:

```bash
sudo bash /opt/official-web/aelf-website-next/start.sh \
  init \
  official-web \
  aelf-website-next \
  aelf/aelf-website-next:<tag>
```

Verify env and CMS connectivity from inside the website container:

```bash
docker exec aelf-website-next sh -lc 'printenv STRAPI_API_URL BLOG_CANONICAL_ORIGIN STRAPI_MEDIA_ORIGIN NEXT_PUBLIC_PAAL_CHAT_ENABLED'

docker exec aelf-website-next sh -lc \
  'wget -qO- "$STRAPI_API_URL/api/blog-posts?pagination%5BpageSize%5D=1" | head -c 300'
```

Verify website routes locally on each website machine:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/blog
curl -I http://127.0.0.1:3000/latest-posts
curl -I http://127.0.0.1:3000/posts/etransfer-service-sunset-announcement
curl -s http://127.0.0.1:3000/ | grep -E 'paal-chat|app\.paal\.ai' || echo 'PAAL disabled'
```

Repeat this step on every website machine. The site is stateless, so all machines should use the same `STRAPI_API_URL`, `STRAPI_API_TOKEN`, canonical origin, and media origin.

## 7. Configure Domains And Reverse Proxy

### `aelf.com`

Keep the existing `aelf.com` Nginx/Cloudflare path pointing to the website container on port `3000`.

### `blog.aelf.com`

When ready to cut Webflow over, point `blog.aelf.com` to the website entry machine. Next.js middleware handles the blog host:

- `https://blog.aelf.com/` rewrites internally to `/blog`.
- `https://blog.aelf.com/blog` redirects back to `/` on the blog host.
- `https://blog.aelf.com/posts/:slug` stays on the same path and returns the CMS-backed article.
- `https://blog.aelf.com/category/:slug` stays on the same path.

Keep Webflow available for a 24-72 hour rollback window after DNS cutover.

### `cms.aelf.com`

Point `cms.aelf.com` to the CMS machine and proxy to Strapi `1337`.

If Nginx runs on the same CMS machine, keep:

```text
STRAPI_HOST_BIND=127.0.0.1
```

If the website machines call Strapi directly by private IP, bind Strapi to a private interface or `0.0.0.0` and restrict access with firewall rules. Do not expose PostgreSQL.

## 8. Configure Scheduled Publishing And Revalidation

Scheduled publishing is enabled by `strapi-plugin-publisher` when Strapi starts with `CRON_ENABLED=true`.

Use it from Strapi Admin:

1. Open a Blog Post draft.
2. In the Publisher section on the edit page, add a publish date.
3. Save the scheduled action.
4. Keep the entry unpublished until the selected time.

The Blog Post lifecycle calls the website revalidation endpoint for direct publish, unpublish, and published-post updates. The Publisher `afterPublish` and `afterUnpublish` hooks call the same endpoint for scheduled publishing. Draft saves do not revalidate public pages; they only affect the protected website preview route.

Both paths use these Strapi env values:

```bash
BLOG_REVALIDATE_URL=https://blog.aelf.com/api/blog/revalidate
STRAPI_REVALIDATE_SECRET=<STRAPI_REVALIDATE_SECRET>
```

Use the same `STRAPI_REVALIDATE_SECRET` value from the website runtime env.

Smoke test the endpoint after the website is deployed:

```bash
curl -X POST \
  "https://blog.aelf.com/api/blog/revalidate?secret=<STRAPI_REVALIDATE_SECRET>" \
  -H 'Content-Type: application/json' \
  -d '{"slug":"etransfer-service-sunset-announcement","categories":[]}'
```

If multiple website machines serve ISR independently, either call each instance through an internal endpoint or accept the current ISR fallback of up to 300 seconds.

## 9. Final Launch Checks

Run these from an external machine after DNS/proxy changes:

```bash
curl -I https://aelf.com/
curl -I https://aelf.com/posts/etransfer-service-sunset-announcement
curl -I https://blog.aelf.com/
curl -I https://blog.aelf.com/latest-posts
curl -I https://blog.aelf.com/posts/etransfer-service-sunset-announcement
curl -I https://blog.aelf.com/blog-sitemap.xml
curl -I https://cms.aelf.com/admin
```

Content checks:

```bash
curl -s https://blog.aelf.com/posts/etransfer-service-sunset-announcement | grep -E '<title>|canonical|ETransfer Service Sunset Announcement' | head
curl -s https://blog.aelf.com/ | grep -E 'paal-chat|app\.paal\.ai' || echo 'PAAL disabled'
```

CMS checks on the CMS machine:

```bash
cd /opt/aelf/blog-strapi
curl -s 'http://127.0.0.1:1337/api/blog-posts?filters%5BpublishedAt%5D%5B%24notNull%5D=true&pagination%5BpageSize%5D=1' | grep -o '"total":[0-9]*'
```

PostgreSQL backup checks:

```bash
cd /opt/aelf/blog-postgres
find backups/postgres -maxdepth 3 -type f -name '*.dump' -print -exec ls -lh {} \;
```

## 10. Maintenance Commands

PostgreSQL:

```bash
cd /opt/aelf/blog-postgres

docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml ps
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml logs -f postgres
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml logs -f postgres-backup
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml restart postgres
```

Strapi:

```bash
cd /opt/aelf/blog-strapi

docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml ps
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml logs -f strapi
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml restart strapi
```

Website:

```bash
docker ps | grep aelf-website-next
docker logs --tail=100 aelf-website-next
sudo bash /opt/official-web/aelf-website-next/start.sh check official-web aelf-website-next aelf/aelf-website-next:<tag>
```

## Rollback

- Website code rollback: redeploy the previous website image tag with the same `start.sh` command.
- Blog domain rollback: point `blog.aelf.com` back to Webflow while the rollback window is still open.
- CMS rollback: stop Strapi or redeploy the previous Strapi image tag.
- Database rollback: restore a known-good dump through `pg_restore --clean --if-exists --no-owner`.

Do not run `docker compose down -v` in production unless the goal is to delete PostgreSQL data.
