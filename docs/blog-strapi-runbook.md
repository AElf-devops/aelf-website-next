# Blog Strapi Docker Runbook

## Scope

This runbook starts Strapi after PostgreSQL is already running from `docker-compose.blog-postgres.yml`.

Do not start a second PostgreSQL instance for Strapi. Strapi should join the existing Docker network created by the PostgreSQL compose project.

For the MVP release, run Strapi on the same Docker host as PostgreSQL. This keeps PostgreSQL private with no published `5432` port. If Strapi is moved to another host later, `DATABASE_HOST` must be changed to the PostgreSQL private IP or DNS name, and PostgreSQL must be exposed only to that private network with firewall protection.

For the full from-scratch Docker deployment order, including Website, PostgreSQL, DNS, and launch checks, use `docs/blog-docker-runbook.md` as the main runbook.

## Prerequisites

PostgreSQL has already been started with:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres
```

The expected network is:

```text
aelf-blog_aelf_blog
```

Verify it exists:

```bash
docker network inspect aelf-blog_aelf_blog >/dev/null
```

## 1. Build And Push Strapi Image

Run this in CI or on a build machine. If production runs on `linux/amd64` and the image is built from Apple Silicon, use `buildx` so the pushed image matches the server architecture:

```bash
TAG=$(git rev-parse --short HEAD)

docker buildx build \
  --platform linux/amd64 \
  -f cms/Dockerfile \
  -t <harbor>/aelf/aelf-blog-strapi:${TAG}-amd64 \
  --push \
  cms
```

If the build machine is already amd64, this simpler command is fine:

```bash
TAG=$(git rev-parse --short HEAD)

docker build \
  -f cms/Dockerfile \
  -t <harbor>/aelf/aelf-blog-strapi:${TAG} \
  cms

docker push <harbor>/aelf/aelf-blog-strapi:${TAG}
```

## 2. Prepare Files On Strapi Machine

Recommended directory:

```bash
sudo mkdir -p /opt/aelf/blog-strapi/{cms,deploy}
sudo chown -R "$USER:$USER" /opt/aelf/blog-strapi
cd /opt/aelf/blog-strapi
```

Copy these files into `/opt/aelf/blog-strapi`:

```text
docker-compose.blog-strapi.yml
deploy/blog-strapi.env
cms/.env.production
```

Use `deploy/blog-strapi.env.example` as the template for `deploy/blog-strapi.env`, and `cms/.env.production.example` as the template for `cms/.env.production`.

## 3. Create Deploy Env

Create `deploy/blog-strapi.env`:

```bash
cat > deploy/blog-strapi.env <<'EOF'
STRAPI_IMAGE=<harbor>/aelf/aelf-blog-strapi:<tag>
STRAPI_ENV_FILE=./cms/.env.production
STRAPI_HOST_BIND=127.0.0.1
STRAPI_HOST_PORT=1337

BLOG_DOCKER_NETWORK=aelf-blog_aelf_blog

DATABASE_HOST=postgres
DATABASE_PORT=5432
BLOG_DATABASE_NAME=aelf_blog
BLOG_DATABASE_USERNAME=aelf_blog
BLOG_DATABASE_PASSWORD=<same_password_as_blog-postgres.env>
DATABASE_SSL=false
EOF
chmod 600 deploy/blog-strapi.env
```

`BLOG_DATABASE_PASSWORD` must match the password in `deploy/blog-postgres.env` on the PostgreSQL machine.

Keep `STRAPI_HOST_BIND=127.0.0.1` when Nginx proxies `cms.aelf.com` on the same machine. If website containers on another machine must call Strapi directly by private IP, bind Strapi to a private interface or `0.0.0.0` and restrict access with firewall rules.

## 4. Create Strapi Env

Create `cms/.env.production` from `cms/.env.production.example` and fill:

```bash
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

AWS_ACCESS_KEY_ID=<production_s3_key>
AWS_ACCESS_SECRET=<production_s3_secret>
AWS_REGION=ap-east-1
AWS_BUCKET=aelf.com
AWS_ACL=public-read
AWS_ROOT_PATH=blog
AWS_SIGNED_URL_EXPIRES=900
AWS_CDN_URL=https://s3.ap-east-1.amazonaws.com/aelf.com
```

Protect the production env file:

```bash
chmod 600 cms/.env.production
```

Generate secrets with:

```bash
openssl rand -base64 32
```

## 5. Start Strapi

```bash
cd /opt/aelf/blog-strapi

docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  up -d
```

Verify:

```bash
docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  ps

curl -I http://127.0.0.1:1337/admin
```

Expected Strapi container status:

```text
healthy
```

## 6. Initialize Admin Access

Check whether the restored database already has an admin account:

```bash
curl -s http://127.0.0.1:1337/admin/init
```

Expected after restoring the golden CMS dump:

```json
{"data":{"uuid":false,"hasAdmin":true,"menuLogo":null,"authLogo":null}}
```

If the restored admin account is known, reset its password before production use:

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

If this is a fresh database and `hasAdmin:false`, create the first Super Admin:

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

After login, create named editor accounts for the team instead of sharing the Super Admin account.

## 7. Create Website API Token

Open Strapi Admin through the internal domain or SSH tunnel, then create a read-only API token for the website.

Recommended token setup:

- Create a new production token after restore; do not reuse local tokens restored from the dump.
- Use read-only access.
- Enable reads for `blog-post`, `blog-category`, `blog-tag`, and media assets if the UI exposes granular permissions.
- Store the token only in the website runtime env.

The website runtime env should use:

```bash
STRAPI_API_URL=https://cms.aelf.com
STRAPI_API_TOKEN=<production_read_only_token>
STRAPI_REVALIDATE_SECRET=<production_secret>
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com
```

Verify the token locally from the Strapi machine:

```bash
STRAPI_API_TOKEN='<production_read_only_token>'

curl -s \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  'http://127.0.0.1:1337/api/blog-posts?pagination%5BpageSize%5D=1&fields%5B0%5D=title' \
  | head -c 300
```

## 8. Verify Media Upload And Webhook Setup

Media upload:

1. Upload one small test image in Strapi Media Library.
2. Confirm the generated URL loads from `https://s3.ap-east-1.amazonaws.com/aelf.com/blog/`.
3. Delete the test asset if it should not stay in production.

Webhook:

1. Generate a revalidation secret with `openssl rand -base64 32`.
2. Add it to every website container as `STRAPI_REVALIDATE_SECRET`.
3. In Strapi Admin, create a publish/update/delete webhook:

```text
https://blog.aelf.com/api/blog/revalidate?secret=<STRAPI_REVALIDATE_SECRET>
```

## 9. Useful Commands

Logs:

```bash
docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  logs -f strapi
```

Restart:

```bash
docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  restart strapi
```

Stop:

```bash
docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  down
```
