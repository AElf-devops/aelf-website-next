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
- Machine B: `docker-compose.blog.prod.yml` for Strapi, PostgreSQL, and PostgreSQL backup

Only Strapi should be reachable by Nginx on Machine B. PostgreSQL must stay on the internal Docker network and must not be exposed publicly.

## Production Environment Files

Create these files on Machine B from the examples:

```bash
cp deploy/blog.env.example deploy/blog.env
cp cms/.env.production.example cms/.env.production
```

Fill `deploy/blog.env` with database and Next.js-facing values:

- `BLOG_DATABASE_NAME`
- `BLOG_DATABASE_USERNAME`
- `BLOG_DATABASE_PASSWORD`
- `BLOG_CANONICAL_ORIGIN`
- `STRAPI_MEDIA_ORIGIN`
- `STRAPI_API_TOKEN`
- `STRAPI_REVALIDATE_SECRET`

Fill `cms/.env.production` with Strapi and S3 values:

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

On the local machine, export the final CMS database:

```bash
mkdir -p .tmp
export PGPASSWORD="$(awk -F= '/^DATABASE_PASSWORD=/{print $2}' cms/.env)"
pg_dump -h 127.0.0.1 -U aelf_blog -d aelf_blog -Fc -f .tmp/aelf_blog_cms.dump
unset PGPASSWORD
```

Copy `.tmp/aelf_blog_cms.dump` to Machine B, then run:

```bash
docker compose --env-file deploy/blog.env -f docker-compose.blog.prod.yml up -d postgres

docker compose --env-file deploy/blog.env -f docker-compose.blog.prod.yml exec -T postgres \
  pg_restore --clean --if-exists --no-owner \
  -U "$BLOG_DATABASE_USERNAME" -d "$BLOG_DATABASE_NAME" \
  < aelf_blog_cms.dump

docker compose --env-file deploy/blog.env -f docker-compose.blog.prod.yml up -d --build strapi postgres-backup
```

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
