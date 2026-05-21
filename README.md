# aelf Website Next

English | [中文](./README.zh.md)

This repository contains the aelf public website and the self-hosted blog system that replaces the previous Webflow blog.

## Services

The blog deployment is split into three main services.

| Service | What it does | Runtime state | Main files |
| --- | --- | --- | --- |
| Website | Next.js public site. Serves `/blog`, `/latest-posts`, `/category/:slug`, `/posts/:slug`, SEO metadata, sitemap, and ISR revalidation endpoint. | Stateless. Reads content from Strapi. | `Dockerfile`, `src/`, `docker-compose.blog.yml` |
| Strapi CMS | Blog admin, content API, draft/publish workflow, media library, S3 upload provider, and editorial permissions. | No durable app data in the image. Uses PostgreSQL and S3. | `cms/`, `cms/Dockerfile`, `docker-compose.blog-strapi.yml` |
| PostgreSQL | Stores Strapi content, users, permissions, API tokens, and blog relations. | Durable Docker volume. | `docker-compose.blog-postgres.yml` |

`postgres-backup` is a maintenance sidecar for PostgreSQL. It runs `pg_dump` every day and writes backup files to the host under `backups/postgres`.

## Key Deployment Files

| File | Purpose |
| --- | --- |
| `docker-compose.blog.yml` | Local full-stack verification: PostgreSQL, Strapi, and Website. |
| `docker-compose.blog-postgres.yml` | Production PostgreSQL and backup sidecar only. Does not publish port `5432`. |
| `docker-compose.blog-strapi.yml` | Production Strapi only. Joins the existing PostgreSQL Docker network. |
| `docker-compose.blog.prod.yml` | Single-machine CMS fallback for PostgreSQL, Strapi, and backups. Do not run this on top of an existing PostgreSQL deployment. |
| `deploy/blog-postgres.env.example` | PostgreSQL deployment env template. |
| `deploy/blog-strapi.env.example` | Strapi deployment env template. |
| `cms/.env.production.example` | Strapi runtime secrets and S3 env template. |
| `docs/blog-postgres-runbook.md` | PostgreSQL install, import, verification, and backup steps. |
| `docs/blog-strapi-runbook.md` | Strapi image release, env setup, startup, and verification steps. |
| `docs/blog-docker-runbook.md` | End-to-end Docker deployment notes. |

## Local Development

Install website dependencies:

```bash
yarn install
yarn dev
```

Open `http://localhost:3000`.

For Strapi development:

```bash
cd cms
npm install
npm run develop
```

For local Docker verification of the blog stack:

```bash
docker compose -p aelf-blog -f docker-compose.blog.yml up -d postgres
docker compose -p aelf-blog -f docker-compose.blog.yml up -d --build strapi

BLOG_NEXT_PUBLIC_APP_ENV=production \
STRAPI_API_URL=http://localhost:1337 \
STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com \
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com \
yarn build

BLOG_NEXT_PUBLIC_APP_ENV=production \
docker compose -p aelf-blog -f docker-compose.blog.yml up -d website
```

Verify:

```bash
curl -I http://localhost:1337/admin
curl -I http://localhost:3000/blog
curl -I http://localhost:3000/latest-posts
curl -I http://localhost:3000/posts/etransfer-service-sunset-announcement
```

## Production Docker Deployment

Use `docs/blog-docker-runbook.md` as the source of truth for a from-scratch Docker deployment. It covers the website, PostgreSQL, Strapi, data import, Nginx/DNS, validation, maintenance, and rollback.

Recommended MVP topology:

- Website machine(s): existing website Docker container and Nginx for `aelf.com` / `blog.aelf.com`.
- CMS machine: PostgreSQL, `postgres-backup`, and Strapi. PostgreSQL stays private on Docker network `aelf-blog_aelf_blog`.

High-level order:

1. Export the golden local CMS dump.
2. Build and push the Strapi image for the production CPU architecture.
3. Start PostgreSQL with `docker-compose.blog-postgres.yml`.
4. Restore the CMS dump and verify `251` published posts.
5. Start `postgres-backup`.
6. Start Strapi with `docker-compose.blog-strapi.yml`.
7. Create the production read-only Strapi API token.
8. Add CMS env values to every website machine's `envfile`.
9. Deploy the website image with the existing website `start.sh` flow.
10. Configure `cms.aelf.com`, then cut `blog.aelf.com` from Webflow to the website entry when ready.

Website runtime env must include:

```text
STRAPI_API_URL=<cms_api_origin>
STRAPI_API_TOKEN=<production_read_only_token>
STRAPI_REVALIDATE_SECRET=<production_secret>
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com
```

Use `STRAPI_API_URL=https://cms.aelf.com` when Strapi is behind the CMS reverse proxy. Use `STRAPI_API_URL=http://<CMS_PRIVATE_IP>:1337` only when Strapi binds to a private interface or `0.0.0.0` and firewall rules restrict access to website machines. `NEXT_PUBLIC_PAAL_CHAT_ENABLED` defaults to `false`, so the legacy PAAL iframe is not rendered or downloaded unless it is explicitly set to `true` and the website image is rebuilt.

Existing website deployment pattern:

```bash
sudo bash /opt/official-web/aelf-website-next/start.sh \
  init \
  official-web \
  aelf-website-next \
  aelf/aelf-website-next:<tag>
```

## Maintenance

### Status

```bash
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml ps
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml ps
```

### Logs

```bash
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml logs -f postgres
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml logs -f postgres-backup
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml logs -f strapi
```

### Restart

```bash
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml restart postgres
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml restart strapi
```

### Backups

Backup files are written to:

```text
/opt/aelf/blog-postgres/backups/postgres
```

Retention:

```text
daily: 7 days
weekly: 4 weeks
monthly: 6 months
```

Check backup files:

```bash
find /opt/aelf/blog-postgres/backups/postgres -type f -name '*.dump' -maxdepth 3 -print -exec ls -lh {} \;
```

### Restore

Restore from a backup dump:

```bash
cd /opt/aelf/blog-postgres
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
  < backups/postgres/daily/<backup_file>.dump
```

## Release Checklist

- PostgreSQL container is healthy.
- CMS data import is verified with `251` published posts.
- `postgres-backup` created at least one dump file.
- Strapi image architecture matches the production host.
- Strapi `/admin` returns `200`.
- A production read-only Strapi API token exists.
- Every website machine has the CMS env values in its `envfile`.
- Website containers can request `STRAPI_API_URL` from inside Docker.
- Website `/blog`, `/latest-posts`, and old `/posts/:slug` URLs return `200`.
- `cms.aelf.com` or the private Strapi endpoint is reachable by the website runtime.
- Canonical URLs point to `https://blog.aelf.com`.
- Blog sitemap includes published indexed posts.
- Strapi webhook calls `/api/blog/revalidate` with `STRAPI_REVALIDATE_SECRET`.
- DNS cutover keeps the Webflow rollback window for 24-72 hours.
