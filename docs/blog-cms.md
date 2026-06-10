# Blog CMS Operations

## Architecture

- `blog.aelf.com` points to the Next.js website runtime. The middleware rewrites the blog subdomain root to `/blog` while preserving `/posts/:slug` and `/category/:slug`.
- Strapi owns editorial data in PostgreSQL. Images are uploaded through Strapi's S3 upload provider and exposed through the configured media origin/CDN.
- Scheduled publishing is handled by `strapi-plugin-publisher`. It adds a Publisher section to Blog Post edit pages and uses Strapi cron to publish or unpublish content at the selected time.
- Next.js reads Strapi through `STRAPI_API_URL` and `STRAPI_API_TOKEN`, statically renders blog pages with ISR, and accepts Strapi publish revalidation calls at `/api/blog/revalidate?secret=...`.

For the production Docker deployment sequence, including Website, PostgreSQL, Strapi, data import, DNS, and validation, use `docs/blog-docker-runbook.md`.

## Required Website Env

```bash
STRAPI_API_URL=https://cms.example.com
STRAPI_API_TOKEN=replace_me
STRAPI_REVALIDATE_SECRET=replace_me
STRAPI_PREVIEW_SECRET=replace_me
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://cdn.example.com
BLOG_MEDIA_HOSTNAME=cdn.example.com
BLOG_MEDIA_PROTOCOL=https
BLOG_MEDIA_PORT=
```

## Required Strapi Scheduling Env

```bash
CRON_ENABLED=true
PLUGIN_PUBLISHER_ENABLED=true
BLOG_REVALIDATE_URL=https://blog.aelf.com/api/blog/revalidate
STRAPI_REVALIDATE_SECRET=replace_me
```

Only one Strapi instance should set both `CRON_ENABLED=true` and `PLUGIN_PUBLISHER_ENABLED=true`. If Strapi is ever deployed with multiple instances, keep the extra instances with cron disabled so the same scheduled action cannot run twice.

## Required Strapi Preview Env

```bash
BLOG_PREVIEW_ORIGIN=https://aelf.com
STRAPI_PREVIEW_SECRET=replace_me
```

Strapi automatically fills the Blog Post `previewUrl` field from `BLOG_PREVIEW_ORIGIN`, the post `slug`, and `STRAPI_PREVIEW_SECRET` when an editor creates or saves a post. Use the same `STRAPI_PREVIEW_SECRET` value in both Strapi and the website runtime. The public Blog Post REST controller strips `previewUrl` from `/api/blog-posts` responses so the preview secret is not exposed through the public API.

## Local CMS

1. Copy `cms/.env.example` to `cms/.env` and fill secrets.
2. Start Postgres and Strapi:

```bash
docker compose -f docker-compose.blog.yml up --build
```

3. Open `http://localhost:1337/admin`, create the first admin user, and generate a read-only API token for the website.

For scheduled posts, keep the Blog Post as a draft and use the Publisher section on the edit page to add a publish date. Direct Publish still publishes immediately.

## Article Content Rendering

- New CMS articles should be written in the Strapi rich text editor using Markdown-style formatting.
- The website renders Markdown with `markdown-it` plus the same extension family Strapi uses for preview, including tables, footnotes, definition lists, inserted/marked/subscript/superscript text, and emoji.
- Markdown output is sanitized before being injected into the page. Legacy Webflow HTML content is still detected and rendered through the existing HTML compatibility path so migrated posts keep their original structure.
- If the Strapi preview and website output differ, treat it as a renderer bug and add a case to `src/lib/blog/__tests__/blog.test.ts` before changing the renderer.

## Website Preview

Strapi's built-in Preview mode uses Strapi Admin styles, so it is useful for Markdown syntax checks but not for final website visual QA.

Use the website preview route for final editorial review:

```text
https://aelf.com/posts/preview/<slug-or-documentId>?secret=<STRAPI_PREVIEW_SECRET>
```

Editors can copy the same link from the Blog Post `previewUrl` field after saving the entry.

Local example:

```text
http://localhost:3001/posts/preview/etransfer-service-sunset-announcement?secret=local-preview-secret
```

The preview page:

- uses the same `BlogPostPage` component and Blog CSS as the public post page;
- reads Strapi draft content with `status=draft`;
- is protected by `STRAPI_PREVIEW_SECRET`;
- sends `noindex,nofollow` and `Cache-Control: no-store`;
- accepts either the post `slug` or Strapi `documentId` as the URL identifier.

The website's `STRAPI_API_TOKEN` must be able to read Blog Post draft records. Public article pages still use the published-only route and are not affected by this preview route.

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
