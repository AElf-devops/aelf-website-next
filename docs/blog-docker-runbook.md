# Blog Docker Deployment Runbook

## Goal

Use the current local Strapi/PostgreSQL database as the golden blog dataset, then run the full stack with Docker:

- Website: Next.js container on `http://localhost:3000`
- CMS: Strapi container on `http://localhost:1337`
- Database: PostgreSQL container on the internal Docker network

## Local Full-Stack Verification

Export the current local CMS database:

```bash
mkdir -p .tmp
export PGPASSWORD="$(awk -F= '/^DATABASE_PASSWORD=/{print $2}' cms/.env)"
pg_dump -h 127.0.0.1 -U aelf_blog -d aelf_blog -Fc -f .tmp/aelf_blog_cms.dump
unset PGPASSWORD
```

Start Docker PostgreSQL:

```bash
docker compose -p aelf-blog -f docker-compose.blog.yml up -d postgres
```

Restore the local CMS dump into Docker PostgreSQL:

```bash
docker compose -p aelf-blog -f docker-compose.blog.yml exec -T postgres \
  pg_restore --clean --if-exists --no-owner -U aelf_blog -d aelf_blog \
  < .tmp/aelf_blog_cms.dump
```

Start Strapi:

```bash
docker compose -p aelf-blog -f docker-compose.blog.yml up -d --build strapi
```

Build the website locally against Docker Strapi, then start the website container. This keeps the local verification fast and still runs the public website process in Docker on port `3000`.

```bash
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
curl -s http://localhost:3000/api/blog/latest-posts | head
```

Useful status commands:

```bash
docker compose -p aelf-blog -f docker-compose.blog.yml ps
docker compose -p aelf-blog -f docker-compose.blog.yml logs -f strapi
docker compose -p aelf-blog -f docker-compose.blog.yml logs -f website
```

## Production Topology

Recommended MVP topology for two 2C4G machines:

- Machine A: existing website Docker deployment and Nginx for `aelf.com` / `blog.aelf.com`
- Machine B: `docker-compose.blog-postgres.yml` for PostgreSQL and backup, then `docker-compose.blog-strapi.yml` for Strapi

Only Strapi should be reachable by Nginx on Machine B. PostgreSQL must stay on the internal Docker network and must not be exposed publicly.

Keep PostgreSQL and Strapi on the same Docker host for the MVP release. This lets Strapi reach PostgreSQL through the internal Docker network without publishing port `5432`. If PostgreSQL and Strapi must be split across two machines later, expose PostgreSQL only on a private network address, restrict it with firewall rules, and set `DATABASE_HOST` in `deploy/blog-strapi.env` to that private address.

For the staged release flow, use:

1. `docs/blog-postgres-runbook.md`
2. `docs/blog-strapi-runbook.md`

`docker-compose.blog.prod.yml` is kept as an all-in-one fallback for a single-machine deployment. Do not run it on top of an existing PostgreSQL deployment.

## Production Environment Files

For the staged release flow, create these files from the examples:

```bash
cp deploy/blog-postgres.env.example deploy/blog-postgres.env
cp deploy/blog-strapi.env.example deploy/blog-strapi.env
cp cms/.env.production.example /opt/aelf/blog-strapi/cms/.env.production
```

Fill `deploy/blog-postgres.env` with database values:

- `BLOG_DATABASE_NAME`
- `BLOG_DATABASE_USERNAME`
- `BLOG_DATABASE_PASSWORD`

Fill `deploy/blog-strapi.env` with the Strapi image, network, port, and the same database values:

- `STRAPI_IMAGE`
- `STRAPI_ENV_FILE`
- `STRAPI_HOST_BIND`
- `STRAPI_HOST_PORT`
- `BLOG_DOCKER_NETWORK`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `BLOG_DATABASE_NAME`
- `BLOG_DATABASE_USERNAME`
- `BLOG_DATABASE_PASSWORD`
- `DATABASE_SSL`

Fill `/opt/aelf/blog-strapi/cms/.env.production` with Strapi and S3 values:

- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_ACCESS_SECRET`
- `AWS_REGION`
- `AWS_BUCKET`
- `AWS_ROOT_PATH`
- `AWS_CDN_URL`

Rotate the temporary S3 key before production if it was shared in chat or local testing.

## Production Data Import

Use `docs/blog-postgres-runbook.md` as the source of truth for exporting the local golden CMS data, starting PostgreSQL, restoring the dump, verifying `251` published posts, and enabling backups.

After PostgreSQL is verified, use `docs/blog-strapi-runbook.md` to start Strapi from the published image and connect it to the existing PostgreSQL container.

After restore:

- Log in to Strapi Admin and reset the production admin password.
- Create a new read-only Strapi API Token for the website.
- Confirm the local test/sample post is draft or `sitemapIndexed=false`.

## Website Production Build

Build the website image after production Strapi is reachable:

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_ENV=production \
  --build-arg STRAPI_API_URL=https://cms.aelf.com \
  --build-arg STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com \
  --build-arg BLOG_CANONICAL_ORIGIN=https://blog.aelf.com \
  -t aelf-website-next:blog .
```

At runtime, set:

- `STRAPI_API_URL=https://cms.aelf.com`
- `STRAPI_API_TOKEN=<production_read_only_token>`
- `STRAPI_REVALIDATE_SECRET=<production_secret>`
- `BLOG_CANONICAL_ORIGIN=https://blog.aelf.com`
- `STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com`

## Revalidate

Configure Strapi webhook to call:

```text
https://blog.aelf.com/api/blog/revalidate
```

Use the same `STRAPI_REVALIDATE_SECRET` value as the website runtime environment.

If the website runs on multiple containers or machines, either call every instance internally or accept the current ISR fallback window of up to 300 seconds.

## Launch Checks

- `https://blog.aelf.com/blog` returns 200.
- `https://blog.aelf.com/latest-posts` returns 200 and lists 100 posts.
- Old Webflow slugs under `/posts/:slug` return 200.
- Canonical URLs point to `https://blog.aelf.com`.
- `meta title`, `meta description`, OG image, and Article JSON-LD are present.
- `https://blog.aelf.com/blog-sitemap.xml` contains published indexed posts.
- Strapi image uploads write to S3/CDN.
- PostgreSQL backup files appear under `backups/postgres`.
- Webflow rollback window is kept for 24-72 hours after DNS cutover.
