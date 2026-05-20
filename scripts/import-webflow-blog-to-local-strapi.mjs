import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CMS_DIR = path.join(ROOT_DIR, "cms");
const require = createRequire(import.meta.url);

const POST_UID = "api::blog-post.blog-post";
const CATEGORY_UID = "api::blog-category.blog-category";
const DEFAULT_CONCURRENCY = 3;

process.on("unhandledRejection", (reason) => {
  if (reason?.message === "aborted") return;
  throw reason;
});

process.on("uncaughtException", (error) => {
  if (error?.message === "aborted") {
    process.exit(0);
  }
  throw error;
});

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) return;

    const [, key, rawValue] = match;
    if (process.env[key]) return;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  });
}

function parseArgs() {
  return process.argv.slice(2).reduce(
    (acc, arg) => {
      if (arg === "--replace") acc.replace = true;
      if (arg === "--skip-images") acc.skipImages = true;
      if (arg === "--skip-body-images") acc.skipBodyImages = true;
      if (arg.startsWith("--limit=")) acc.limit = Number(arg.split("=")[1]);
      if (arg.startsWith("--concurrency=")) {
        acc.concurrency = Number(arg.split("=")[1]);
      }
      return acc;
    },
    {
      replace: false,
      skipImages: false,
      skipBodyImages: false,
      limit: undefined,
      concurrency: DEFAULT_CONCURRENCY,
    }
  );
}

function requireEnv(name, fallbackName) {
  const value = process.env[name] || (fallbackName && process.env[fallbackName]);
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function createSlug(input) {
  return String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function ensureText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readBooleanish(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "on", "featured"].includes(normalized)) return true;
    if (["false", "no", "off", "none"].includes(normalized)) return false;
  }
  return defaultValue;
}

function getFieldName(fieldData) {
  return (
    ensureText(fieldData?.name) ||
    ensureText(fieldData?.title) ||
    ensureText(fieldData?.label)
  );
}

function safeFilename(input, fallback = "image") {
  const cleaned = decodeURIComponent(input || fallback)
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned && cleaned !== "." && cleaned !== ".." ? cleaned : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithRetry(url, options = {}, retries = 4) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(500 * attempt);
      }
    }
  }

  throw lastError;
}

function filenameFromUrl(url, contentType = "application/octet-stream") {
  const pathname = new URL(url).pathname;
  const rawName = path.basename(pathname);
  let filename = safeFilename(rawName || "image");

  if (!path.extname(filename)) {
    const extension = contentType.split("/")[1]?.split(";")[0] || "bin";
    filename = `${filename}.${extension === "jpeg" ? "jpg" : extension}`;
  }

  return filename;
}

async function fetchJson(url, options = {}) {
  const response = await fetchWithRetry(url, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed ${response.status} ${url}: ${body}`);
  }

  return response.json();
}

async function fetchWebflowItems({ token, collectionId }) {
  const items = [];
  const limit = 100;

  for (let offset = 0; ; offset += limit) {
    const response = await fetchJson(
      `https://api.webflow.com/v2/collections/${collectionId}/items/live?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "accept-version": "1.0.0",
        },
      }
    );

    items.push(...(response.items || []));

    if (items.length >= (response.pagination?.total || 0)) {
      return items;
    }
  }
}

async function fetchWebflowCollection({ token, collectionId }) {
  return fetchJson(`https://api.webflow.com/v2/collections/${collectionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "accept-version": "1.0.0",
    },
  });
}

function getReferenceCollectionId(collection, fieldSlug) {
  return collection.fields?.find((field) => field.slug === fieldSlug)?.validations
    ?.collectionId;
}

async function fetchReferenceMap({ token, collectionId }) {
  if (!collectionId) return new Map();

  const items = await fetchWebflowItems({ token, collectionId });
  return new Map(
    items
      .map((item) => {
        const name = getFieldName(item.fieldData);
        if (!name) return undefined;

        return [
          item.id,
          {
            id: item.id,
            name,
            slug: ensureText(item.fieldData?.slug) || createSlug(name),
          },
        ];
      })
      .filter(Boolean)
  );
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });

  await Promise.all(workers);
  return results;
}

async function downloadToTempFile(url) {
  const response = await fetchWithRetry(url);
  if (!response.ok) {
    throw new Error(`Image download failed ${response.status}: ${url}`);
  }

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";
  const buffer = Buffer.from(await response.arrayBuffer());
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "aelf-blog-import-"));
  const filename = filenameFromUrl(url, contentType);
  const filepath = path.join(tmpDir, filename);
  await fsp.writeFile(filepath, buffer);

  return {
    tmpDir,
    file: {
      filepath,
      originalFilename: filename,
      mimetype: contentType,
      size: buffer.length,
    },
  };
}

async function uploadRemoteImage({ strapi, imageCache, url, alt }) {
  if (!url) return undefined;
  if (imageCache.has(url)) return imageCache.get(url);

  const uploadService = strapi.plugin("upload").service("upload");
  const downloaded = await downloadToTempFile(url);

  try {
    const uploadedFiles = await uploadService.upload({
      data: {
        fileInfo: {
          alternativeText: alt || undefined,
        },
      },
      files: downloaded.file,
    });
    const uploadedFile = uploadedFiles?.[0];
    imageCache.set(url, uploadedFile);
    return uploadedFile;
  } finally {
    await fsp.rm(downloaded.tmpDir, { recursive: true, force: true });
  }
}

function readAttr(tag, attr) {
  const match = tag.match(new RegExp(`\\s${attr}=(["'])(.*?)\\1`, "i"));
  return match?.[2] || "";
}

async function replaceBodyImages({ strapi, imageCache, html, concurrency }) {
  const tags = Array.from(new Set(html.match(/<img\b[^>]*>/gi) || []));
  const replacements = new Map();

  await mapWithConcurrency(tags, concurrency, async (tag) => {
    const src = readAttr(tag, "src");
    if (!/^https?:\/\//i.test(src)) return;

    const alt = readAttr(tag, "alt");
    let uploaded;

    try {
      uploaded = await uploadRemoteImage({
        strapi,
        imageCache,
        url: src,
        alt,
      });
    } catch (error) {
      console.warn(`Body image kept as remote after upload failure: ${src}`);
      console.warn(error?.message || error);
      return;
    }

    if (!uploaded?.url) return;

    const nextTag = tag
      .replace(/\ssrc=(["']).*?\1/i, ` src="${uploaded.url}"`)
      .replace(/\ssrcset=(["']).*?\1/i, "")
      .replace(/\ssizes=(["']).*?\1/i, "");
    replacements.set(tag, nextTag);
  });

  let nextHtml = html;
  replacements.forEach((nextTag, tag) => {
    nextHtml = nextHtml.split(tag).join(nextTag);
  });

  return nextHtml;
}

async function ensureCategory({ strapi, category }) {
  const documents = strapi.documents(CATEGORY_UID);
  const existing = await documents.findFirst({
    filters: {
      slug: {
        $eq: category.slug,
      },
    },
  });

  if (existing) return existing;

  return documents.create({
    data: {
      name: category.name,
      slug: category.slug,
    },
  });
}

async function findExistingPost(strapi, slug) {
  return strapi.db.query(POST_UID).findOne({
    where: {
      slug,
    },
    select: ["id", "documentId", "slug"],
  });
}

function mapPostData({
  item,
  content,
  articleThumbnail,
  articleHeaderImage,
  ogImage,
  authorMap,
  categoryDocumentIds,
}) {
  const fieldData = item.fieldData || {};
  const title = ensureText(fieldData.title) || ensureText(fieldData.name) || "Untitled";
  const author = authorMap.get(fieldData["author-4"]);

  return {
    title,
    slug: ensureText(fieldData.slug) || createSlug(title),
    excerpt: ensureText(fieldData.text) || ensureText(fieldData["meta-description"]),
    content: content || "",
    postDate: fieldData["post-date"] || undefined,
    seoTitle: ensureText(fieldData["meta-title"]) || title,
    seoDescription:
      ensureText(fieldData["meta-description"]) || ensureText(fieldData.text),
    author: author?.name || "aelf Team",
    featured: readBooleanish(fieldData.featured),
    sitemapIndexed: readBooleanish(fieldData["sitemap-indexing"], true),
    headerImageAlt: ensureText(fieldData["alt-text-for-header-image"]),
    legacySourceId: item.id,
    articleThumbnail: articleThumbnail?.id,
    articleHeaderImage: articleHeaderImage?.id,
    coverImage: articleHeaderImage?.id,
    ogImage: ogImage?.id || articleThumbnail?.id || articleHeaderImage?.id,
    ...(categoryDocumentIds.length
      ? { categories: { connect: categoryDocumentIds } }
      : {}),
  };
}

async function importPost({
  strapi,
  item,
  authorMap,
  categoryMap,
  categoryDocumentIdByWebflowId,
  imageCache,
  args,
  index,
  total,
}) {
  const fieldData = item.fieldData || {};
  const title = ensureText(fieldData.title) || ensureText(fieldData.name) || "Untitled";
  const slug = ensureText(fieldData.slug) || createSlug(title);
  const existing = await findExistingPost(strapi, slug);

  if (existing && !args.replace) {
    console.log(`[${index + 1}/${total}] skipped existing ${slug}`);
    return { status: "skipped", slug };
  }

  if (existing && args.replace) {
    await strapi.documents(POST_UID).delete({ documentId: existing.documentId });
  }

  const headerSource = fieldData["article-header-image"] || fieldData["article-image"];
  const thumbnailSource = fieldData["article-image"] || headerSource;
  const articleHeaderImage = args.skipImages
    ? undefined
    : await uploadRemoteImage({
        strapi,
        imageCache,
        url: headerSource?.url,
        alt: fieldData["alt-text-for-header-image"] || headerSource?.alt || title,
      });
  const articleThumbnail =
    args.skipImages || thumbnailSource?.url === headerSource?.url
      ? articleHeaderImage
      : await uploadRemoteImage({
          strapi,
          imageCache,
          url: thumbnailSource?.url,
          alt: thumbnailSource?.alt || title,
        });
  const ogImage =
    args.skipImages || fieldData["article-image"]?.url === thumbnailSource?.url
      ? articleThumbnail
      : await uploadRemoteImage({
          strapi,
          imageCache,
          url: fieldData["article-image"]?.url,
          alt: fieldData["article-image"]?.alt || title,
        });
  const content =
    args.skipImages || args.skipBodyImages
      ? fieldData["post-content"] || ""
      : await replaceBodyImages({
          strapi,
          imageCache,
          html: fieldData["post-content"] || "",
          concurrency: args.concurrency,
        });
  const categoryDocumentIds = (fieldData.categories || [])
    .map((categoryId) => {
      const category = categoryMap.get(categoryId);
      return category ? categoryDocumentIdByWebflowId.get(category.id) : undefined;
    })
    .filter(Boolean);

  const data = mapPostData({
    item,
    content,
    articleThumbnail,
    articleHeaderImage,
    ogImage,
    authorMap,
    categoryDocumentIds,
  });

  await strapi.documents(POST_UID).create({
    status: "published",
    data,
  });

  console.log(`[${index + 1}/${total}] imported ${slug}`);
  return { status: "imported", slug };
}

async function main() {
  loadEnvFile(path.join(ROOT_DIR, ".env"));
  loadEnvFile(path.join(CMS_DIR, ".env"));

  const args = parseArgs();
  const webflowToken = requireEnv(
    "WEBFLOW_API_TOKEN",
    "NEXT_PUBLIC_WEBFLOW_API_TOKEN"
  );
  const webflowCollectionId = requireEnv(
    "WEBFLOW_COLLECTION_ID",
    "NEXT_PUBLIC_WEBFLOW_COLLECTION_ID"
  );

  const collection = await fetchWebflowCollection({
    token: webflowToken,
    collectionId: webflowCollectionId,
  });
  const [items, authorMap, categoryMap] = await Promise.all([
    fetchWebflowItems({ token: webflowToken, collectionId: webflowCollectionId }),
    fetchReferenceMap({
      token: webflowToken,
      collectionId: getReferenceCollectionId(collection, "author-4"),
    }),
    fetchReferenceMap({
      token: webflowToken,
      collectionId: getReferenceCollectionId(collection, "categories"),
    }),
  ]);
  const selectedItems = Number.isFinite(args.limit) ? items.slice(0, args.limit) : items;

  process.chdir(CMS_DIR);
  const { compileStrapi, createStrapi } = require(
    path.join(CMS_DIR, "node_modules/@strapi/core")
  );
  const appContext = await compileStrapi({ appDir: CMS_DIR });
  const strapi = await createStrapi(appContext).load();
  const imageCache = new Map();

  try {
    const categoryDocumentIdByWebflowId = new Map();
    for (const category of categoryMap.values()) {
      const strapiCategory = await ensureCategory({ strapi, category });
      categoryDocumentIdByWebflowId.set(category.id, strapiCategory.documentId);
    }

    const results = [];
    for (let index = 0; index < selectedItems.length; index += 1) {
      results.push(
        await importPost({
          strapi,
          item: selectedItems[index],
          authorMap,
          categoryMap,
          categoryDocumentIdByWebflowId,
          imageCache,
          args,
          index,
          total: selectedItems.length,
        })
      );
    }

    const summary = results.reduce(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      { imported: 0, skipped: 0 }
    );
    console.log(
      `Done. fetched=${items.length} selected=${selectedItems.length} imported=${summary.imported} skipped=${summary.skipped} uploadedImages=${imageCache.size}`
    );
  } finally {
    try {
      await strapi.destroy();
    } catch (error) {
      if (error?.message !== "aborted") {
        throw error;
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
