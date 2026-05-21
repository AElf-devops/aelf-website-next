# aelf Website Next

[English](./README.md) | 中文

这个仓库包含 aelf 官网，以及用于替换原 Webflow Blog 的自托管 Blog 系统。

## 服务说明

Blog 部署拆成三个主要服务。

| 服务 | 职责 | 运行状态 | 主要文件 |
| --- | --- | --- | --- |
| Website | Next.js 官网。提供 `/blog`、`/latest-posts`、`/category/:slug`、`/posts/:slug`、SEO metadata、sitemap、ISR revalidation endpoint。 | 无状态。内容从 Strapi 读取。 | `Dockerfile`、`src/`、`docker-compose.blog.yml` |
| Strapi CMS | Blog 后台、内容 API、草稿/发布流程、媒体库、S3 上传、编辑权限。 | 镜像内不保存持久数据。持久数据在 PostgreSQL 和 S3。 | `cms/`、`cms/Dockerfile`、`docker-compose.blog-strapi.yml` |
| PostgreSQL | 保存 Strapi 内容、用户、权限、API token、文章分类/标签关系等。 | 数据保存在 Docker volume。 | `docker-compose.blog-postgres.yml` |

`postgres-backup` 是 PostgreSQL 的维护 sidecar。它每天执行一次 `pg_dump`，把备份文件写到宿主机的 `backups/postgres` 目录。

## 关键部署文件

| 文件 | 用途 |
| --- | --- |
| `docker-compose.blog.yml` | 本地完整验收：PostgreSQL、Strapi、Website。 |
| `docker-compose.blog-postgres.yml` | 生产 PostgreSQL 和备份 sidecar。不会暴露 `5432`。 |
| `docker-compose.blog-strapi.yml` | 生产 Strapi。接入已有 PostgreSQL Docker network。 |
| `docker-compose.blog.prod.yml` | 单机 CMS 备用方案，包含 PostgreSQL、Strapi、备份 sidecar。不要叠加跑在已有 PostgreSQL 上。 |
| `deploy/blog-postgres.env.example` | PostgreSQL 部署 env 模板。 |
| `deploy/blog-strapi.env.example` | Strapi 部署 env 模板。 |
| `cms/.env.production.example` | Strapi runtime secrets 和 S3 env 模板。 |
| `docs/blog-postgres-runbook.md` | PostgreSQL 安装、导入、验收、备份步骤。 |
| `docs/blog-strapi-runbook.md` | Strapi 镜像发布、env 配置、启动、验收步骤。 |
| `docs/blog-docker-runbook.md` | Docker 端到端部署说明。 |

## 本地开发

安装官网依赖：

```bash
yarn install
yarn dev
```

打开 `http://localhost:3000`。

Strapi 本地开发：

```bash
cd cms
npm install
npm run develop
```

本地 Docker 验收 Blog 整套服务：

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

验收：

```bash
curl -I http://localhost:1337/admin
curl -I http://localhost:3000/blog
curl -I http://localhost:3000/latest-posts
curl -I http://localhost:3000/posts/etransfer-service-sunset-announcement
```

## 生产 Docker 部署

从零部署一套官网 + PostgreSQL + Strapi CMS 时，以 `docs/blog-docker-runbook.md` 为主文档。它覆盖官网、PostgreSQL、Strapi、数据导入、Nginx/DNS、验收、维护和回滚。

MVP 推荐拓扑：

- 官网机器：现有官网 Docker container 和 Nginx，承载 `aelf.com` / `blog.aelf.com`。
- CMS 机器：PostgreSQL、`postgres-backup`、Strapi。PostgreSQL 只在 Docker network `aelf-blog_aelf_blog` 内部访问。

整体顺序：

1. 从本地 golden CMS 数据库导出 dump。
2. 按生产 CPU 架构构建并推送 Strapi 镜像。
3. 用 `docker-compose.blog-postgres.yml` 启动 PostgreSQL。
4. 恢复 CMS dump，并确认 published posts 是 `251`。
5. 启动 `postgres-backup`。
6. 用 `docker-compose.blog-strapi.yml` 启动 Strapi。
7. 在 Strapi 后台创建生产只读 API token。
8. 在每台官网机器的 `envfile` 加 CMS 运行时配置。
9. 用现有官网 `start.sh` 流程发布官网镜像。
10. 配好 `cms.aelf.com`，准备好后再把 `blog.aelf.com` 从 Webflow 切到官网入口。

官网运行时 env 需要包含：

```text
STRAPI_API_URL=<cms_api_origin>
STRAPI_API_TOKEN=<production_read_only_token>
STRAPI_REVALIDATE_SECRET=<production_secret>
BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
STRAPI_MEDIA_ORIGIN=https://s3.ap-east-1.amazonaws.com/aelf.com
```

Strapi 走 CMS 反向代理时，`STRAPI_API_URL` 用 `https://cms.aelf.com`。只有在 Strapi 绑定内网网卡或 `0.0.0.0`，并且防火墙只允许官网机器访问时，才用 `http://<CMS_PRIVATE_IP>:1337`。`NEXT_PUBLIC_PAAL_CHAT_ENABLED` 默认是 `false`，因此旧 PAAL iframe 不会渲染，也不会下载第三方脚本；只有明确恢复 PAAL 时才设置成 `true` 并重新构建官网镜像。

现有官网发布命令形态：

```bash
sudo bash /opt/official-web/aelf-website-next/start.sh \
  init \
  official-web \
  aelf-website-next \
  aelf/aelf-website-next:<tag>
```

## 维护方式

### 查看状态

```bash
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml ps
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml ps
```

### 查看日志

```bash
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml logs -f postgres
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml logs -f postgres-backup
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml logs -f strapi
```

### 重启服务

```bash
docker compose --env-file deploy/blog-postgres.env -p aelf-blog -f docker-compose.blog-postgres.yml restart postgres
docker compose --env-file deploy/blog-strapi.env -p aelf-blog-strapi -f docker-compose.blog-strapi.yml restart strapi
```

### 备份

备份文件写在：

```text
/opt/aelf/blog-postgres/backups/postgres
```

保留策略：

```text
daily: 7 天
weekly: 4 周
monthly: 6 个月
```

查看备份文件：

```bash
find /opt/aelf/blog-postgres/backups/postgres -type f -name '*.dump' -maxdepth 3 -print -exec ls -lh {} \;
```

### 恢复数据

从备份恢复：

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

## 发布验收清单

- PostgreSQL container 是 healthy。
- CMS 数据导入后，published posts 数量是 `251`。
- `postgres-backup` 至少生成了一个 dump 文件。
- Strapi 镜像架构和生产机器 CPU 架构一致。
- Strapi `/admin` 返回 `200`。
- 生产 Strapi admin 已创建，或已重置从 dump 恢复出来的 admin 密码。
- 已创建生产只读 Strapi API token。
- Strapi Media Library 上传能写入配置的 S3/CDN 路径。
- 每台官网机器的 `envfile` 都有 CMS 运行时 env。
- 官网 container 内部可以访问 `STRAPI_API_URL`。
- Website `/blog`、`/latest-posts`、旧 `/posts/:slug` 都返回 `200`。
- `cms.aelf.com` 或内网 Strapi endpoint 对官网运行时可达。
- Canonical URL 指向 `https://blog.aelf.com`。
- Blog sitemap 包含已发布且允许索引的文章。
- Strapi webhook 使用 `STRAPI_REVALIDATE_SECRET` 调用 `/api/blog/revalidate`。
- DNS 切流后保留 Webflow 24-72 小时回滚窗口。
