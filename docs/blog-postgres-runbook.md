# Blog PostgreSQL Docker Runbook

## Scope

This runbook only installs and verifies PostgreSQL for the self-hosted blog CMS. Strapi and the website are handled separately.

PostgreSQL is not installed on the host OS. The host only needs Docker and Docker Compose. PostgreSQL runs from the `postgres:16-alpine` Docker image, with data persisted in a Docker volume.

This compose file does not publish port `5432`, so it will not take over the host PostgreSQL port or affect the existing website container. Strapi should run on the same Docker host and join the `aelf-blog_aelf_blog` network for the MVP release.

## Files

- `docker-compose.blog-postgres.yml`
- `deploy/blog-postgres.env`
- `aelf_blog_cms_<timestamp>.dump`

## 1. Export Local CMS Data

Run this on the local machine after confirming the local CMS data is final:

```bash
cd /Users/huangzongzhe/workspace/AElf/aelf-website-next

mkdir -p .tmp
docker compose -p aelf-blog -f docker-compose.blog.yml exec -T postgres \
  pg_dump -Fc -U aelf_blog -d aelf_blog \
  > .tmp/aelf_blog_cms_$(date +%Y%m%d_%H%M%S).dump

ls -lh .tmp/aelf_blog_cms_*.dump
```

Copy the dump to the PostgreSQL machine:

```bash
scp .tmp/aelf_blog_cms_*.dump <user>@<POSTGRES_MACHINE_IP>:/tmp/
```

## 2. Prepare PostgreSQL Machine

Run this on the PostgreSQL machine:

```bash
sudo mkdir -p /opt/aelf/blog-postgres/{deploy,import,backups/postgres}
sudo chown -R "$USER:$USER" /opt/aelf/blog-postgres
cd /opt/aelf/blog-postgres
```

Copy these repo files into `/opt/aelf/blog-postgres`:

```text
docker-compose.blog-postgres.yml
deploy/blog-postgres.env
```

Move the dump into place:

```bash
mv /tmp/aelf_blog_cms_*.dump /opt/aelf/blog-postgres/import/
```

## 3. Create Env File

Generate a strong password:

```bash
openssl rand -base64 32
```

Create `deploy/blog-postgres.env`:

```bash
cat > deploy/blog-postgres.env <<'EOF'
BLOG_DATABASE_NAME=aelf_blog
BLOG_DATABASE_USERNAME=aelf_blog
BLOG_DATABASE_PASSWORD=replace_with_strong_password
EOF
```

## 4. Start PostgreSQL

```bash
cd /opt/aelf/blog-postgres

docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres
```

Wait for healthy:

```bash
docker inspect -f '{{.State.Health.Status}}' aelf-blog-postgres-1
```

Expected:

```text
healthy
```

## 5. Import Data

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
  < import/aelf_blog_cms_*.dump
```

## 6. Verify Data

Published post count should be `251`:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  exec -T postgres \
  psql -U "$BLOG_DATABASE_USERNAME" -d "$BLOG_DATABASE_NAME" \
  -c "select count(*) as published_posts from blog_posts where published_at is not null;"
```

Total rows are higher because Strapi stores draft/published versions:

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  exec -T postgres \
  psql -U "$BLOG_DATABASE_USERNAME" -d "$BLOG_DATABASE_NAME" \
  -c "select count(*) as total_rows from blog_posts;"
```

## 7. Start Backup Container

```bash
docker compose \
  --env-file deploy/blog-postgres.env \
  -p aelf-blog \
  -f docker-compose.blog-postgres.yml \
  up -d postgres-backup
```

Verify backup output:

```bash
sleep 10
find backups/postgres -type f -name '*.dump' -maxdepth 3 -print -exec ls -lh {} \;
```

## 8. Connection Info For Strapi

When Strapi is deployed later, use `docker-compose.blog-strapi.yml` and connect it to the same Docker network:

```bash
BLOG_DOCKER_NETWORK=aelf-blog_aelf_blog
```

Use these database values:

```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=aelf_blog
DATABASE_USERNAME=aelf_blog
DATABASE_PASSWORD=<BLOG_DATABASE_PASSWORD>
DATABASE_SSL=false
```

If Strapi is started by `docker run`, add it to the compose network:

```bash
--network aelf-blog_aelf_blog
```

PostgreSQL does not need a public port.
