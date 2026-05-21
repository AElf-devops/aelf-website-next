# Blog CMS Operations

## Architecture

- `blog.aelf.com` points to the Next.js website runtime. The middleware rewrites the blog subdomain root to `/blog` while preserving `/posts/:slug` and `/category/:slug`.
- Strapi owns editorial data in PostgreSQL. Images are uploaded through Strapi's S3 upload provider and exposed through the configured media origin/CDN.
- Next.js reads Strapi through `STRAPI_API_URL` and `STRAPI_API_TOKEN`, statically renders blog pages with ISR, and accepts Strapi publish webhooks at `/api/blog/revalidate?secret=...`.

For the production Docker deployment sequence, including Website, PostgreSQL, Strapi, data import, DNS, and validation, use `docs/blog-docker-runbook.md`.

## Required Website Env

```bash
STRAPI_API_URL=https://cms.example.com
STRAPI_API_TOKEN=replace_me
STRAPI_REVALIDATE_SECRET=replace_me
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://cdn.example.com
BLOG_MEDIA_HOSTNAME=cdn.example.com
BLOG_MEDIA_PROTOCOL=https
BLOG_MEDIA_PORT=
```

## Local CMS

1. Copy `cms/.env.example` to `cms/.env` and fill secrets.
2. Start Postgres and Strapi:

```bash
docker compose -f docker-compose.blog.yml up --build
```

3. Open `http://localhost:1337/admin`, create the first admin user, and generate a read-only API token for the website.

## Webflow Migration

Dry run:

```bash
node scripts/migrate-webflow-blog-to-strapi.mjs
```

Create posts:

```bash
node scripts/migrate-webflow-blog-to-strapi.mjs --write
```

Optional flags:

- `--limit=5` migrates only the first five posts for smoke testing.
- `--skip-images` creates posts without uploading Webflow images.
- `--category-map=path/to/map.json` connects Webflow reference IDs to existing Strapi category document IDs.

The script accepts `WEBFLOW_API_TOKEN` / `WEBFLOW_COLLECTION_ID`, with fallback support for the legacy `NEXT_PUBLIC_WEBFLOW_*` names during migration only.
