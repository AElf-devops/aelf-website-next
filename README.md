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
| `docker-compose.blog.prod.yml` | All-in-one fallback for a single-machine deployment. Do not run this on top of an existing PostgreSQL deployment. |
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

## Production Release Flow

Recommended MVP topology:

- Machine A: existing website Docker deployment and Nginx for `aelf.com` / `blog.aelf.com`.
- Machine B: PostgreSQL, backup sidecar, and Strapi. PostgreSQL stays private on Docker network `aelf-blog_aelf_blog`.

### 1. Start PostgreSQL

Follow `docs/blog-postgres-runbook.md`.

High-level flow:

```bash
sudo mkdir -p /opt/aelf/blog-postgres/{deploy,import,backups/postgres}
sudo chown -R "$USER:$USER" /opt/aelf/blog-postgres

cd /opt/aelf/blog-postgres

docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres
```

Import the local CMS dump with `pg_restore`, then verify that published blog posts count is `251`.

Start the backup sidecar:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres-backup
```

### 2. Start Strapi

Follow `docs/blog-strapi-runbook.md`.

Build and push the Strapi image:

```bash
TAG=$(git rev-parse --short HEAD)

docker build \
  -f cms/Dockerfile \
  -t <registry>/aelf/aelf-blog-strapi:${TAG} \
  cms

docker push <registry>/aelf/aelf-blog-strapi:${TAG}
```

Start Strapi:

```bash
sudo mkdir -p /opt/aelf/blog-strapi/{cms,deploy}
sudo chown -R "$USER:$USER" /opt/aelf/blog-strapi

cd /opt/aelf/blog-strapi

docker compose \
  --env-file deploy/blog-strapi.env \
  -p aelf-blog-strapi \
  -f docker-compose.blog-strapi.yml \
  up -d
```

Create a production read-only Strapi API token for the website after the CMS is up.

### 3. Release the Website

Build the website image with production blog values:

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_ENV=production \
  --build-arg STRAPI_API_URL=https://cms.aelf.com \
  --build-arg STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com \
  --build-arg BLOG_CANONICAL_ORIGIN=https://blog.aelf.com \
  -t aelf-website-next:<tag> .
```

Runtime env must include:

```text
STRAPI_API_URL=https://cms.aelf.com
STRAPI_API_TOKEN=<production_read_only_token>
STRAPI_REVALIDATE_SECRET=<production_secret>
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com
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
- Strapi `/admin` returns `200`.
- A production read-only Strapi API token exists.
- Website `/blog`, `/latest-posts`, and old `/posts/:slug` URLs return `200`.
- Canonical URLs point to `https://blog.aelf.com`.
- Blog sitemap includes published indexed posts.
- Strapi webhook calls `/api/blog/revalidate` with `STRAPI_REVALIDATE_SECRET`.
- DNS cutover keeps the Webflow rollback window for 24-72 hours.
