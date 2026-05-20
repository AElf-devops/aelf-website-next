import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile() {
  const envPath = path.join(ROOT_DIR, ".env");
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
      if (arg === "--write") acc.write = true;
      if (arg === "--skip-images") acc.skipImages = true;
      if (arg.startsWith("--limit=")) acc.limit = Number(arg.split("=")[1]);
      if (arg.startsWith("--category-map=")) {
        acc.categoryMapPath = path.resolve(ROOT_DIR, arg.split("=")[1]);
      }
      return acc;
    },
    { write: false, skipImages: false, limit: undefined, categoryMapPath: "" }
  );
}

function requireEnv(name, fallbackName) {
  const value = process.env[name] || (fallbackName && process.env[fallbackName]);
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function createSlug(input) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
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

function readCategoryMap(categoryMapPath) {
  if (!categoryMapPath) return {};
  if (!fs.existsSync(categoryMapPath)) {
    throw new Error(`Category map not found: ${categoryMapPath}`);
  }

  return JSON.parse(fs.readFileSync(categoryMapPath, "utf8"));
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
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

async function uploadImageToStrapi({ strapiUrl, token, image }) {
  if (!image?.url) return undefined;

  const imageResponse = await fetch(image.url);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download image: ${image.url}`);
  }

  const contentType =
    imageResponse.headers.get("content-type") || "application/octet-stream";
  const pathname = new URL(image.url).pathname;
  const filename = decodeURIComponent(path.basename(pathname)) || "image";
  const blob = new Blob([await imageResponse.arrayBuffer()], {
    type: contentType,
  });
  const formData = new FormData();
  formData.append("files", blob, filename);

  const uploadedFiles = await fetchJson(`${strapiUrl}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return uploadedFiles?.[0];
}

function mapWebflowItemToStrapiData(
  item,
  categoryMap,
  articleThumbnail,
  articleHeaderImage
) {
  const fieldData = item.fieldData || {};
  const title = fieldData.title || fieldData.name || "Untitled";
  const categoryDocumentIds = (fieldData.categories || [])
    .map((categoryId) => categoryMap[categoryId]?.strapiDocumentId)
    .filter(Boolean);

  return {
    title,
    slug: fieldData.slug || createSlug(title),
    excerpt: fieldData.text || fieldData["meta-description"] || "",
    content: fieldData["post-content"] || "",
    seoTitle: fieldData["meta-title"] || title,
    seoDescription: fieldData["meta-description"] || fieldData.text || "",
    author: categoryMap[fieldData["author-4"]]?.name || "aelf Team",
    featured: readBooleanish(fieldData.featured),
    sitemapIndexed: readBooleanish(fieldData["sitemap-indexing"], true),
    headerImageAlt: fieldData["alt-text-for-header-image"] || "",
    legacySourceId: item.id,
    ...(fieldData["post-date"] ? { postDate: fieldData["post-date"] } : {}),
    ...(articleThumbnail?.id ? { articleThumbnail: articleThumbnail.id } : {}),
    ...(articleHeaderImage?.id
      ? {
          articleHeaderImage: articleHeaderImage.id,
          coverImage: articleHeaderImage.id,
        }
      : {}),
    ...(articleThumbnail?.id || articleHeaderImage?.id
      ? { ogImage: articleThumbnail?.id || articleHeaderImage?.id }
      : {}),
    ...(categoryDocumentIds.length
      ? { categories: { connect: categoryDocumentIds } }
      : {}),
  };
}

async function createStrapiPost({ strapiUrl, token, data }) {
  return fetchJson(`${strapiUrl}/api/blog-posts?status=published`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
}

async function main() {
  loadEnvFile();
  const args = parseArgs();
  const webflowToken = requireEnv(
    "WEBFLOW_API_TOKEN",
    "NEXT_PUBLIC_WEBFLOW_API_TOKEN"
  );
  const webflowCollectionId = requireEnv(
    "WEBFLOW_COLLECTION_ID",
    "NEXT_PUBLIC_WEBFLOW_COLLECTION_ID"
  );
  const categoryMap = readCategoryMap(args.categoryMapPath);
  const items = await fetchWebflowItems({
    token: webflowToken,
    collectionId: webflowCollectionId,
  });
  const selectedItems = Number.isFinite(args.limit)
    ? items.slice(0, args.limit)
    : items;
  const duplicateSlugs = selectedItems
    .map((item) => item.fieldData?.slug)
    .filter((slug, index, slugs) => slug && slugs.indexOf(slug) !== index);

  console.log(`Fetched ${items.length} Webflow posts.`);
  console.log(`Selected ${selectedItems.length} posts.`);
  console.log(`Duplicate slugs: ${new Set(duplicateSlugs).size}`);

  if (!args.write) {
    console.log("Dry run complete. Re-run with --write to create Strapi posts.");
    return;
  }

  const strapiUrl = requireEnv("STRAPI_API_URL").replace(/\/$/, "");
  const strapiToken = requireEnv("STRAPI_API_TOKEN");

  for (const item of selectedItems) {
    const fieldData = item.fieldData || {};
    const headerSource = fieldData["article-header-image"] || fieldData["article-image"];
    const thumbnailSource = fieldData["article-image"] || headerSource;
    const articleHeaderImage = args.skipImages
      ? undefined
      : await uploadImageToStrapi({
          strapiUrl,
          token: strapiToken,
          image: headerSource,
        });
    const articleThumbnail =
      args.skipImages || thumbnailSource?.url === headerSource?.url
        ? articleHeaderImage
        : await uploadImageToStrapi({
            strapiUrl,
            token: strapiToken,
            image: thumbnailSource,
          });
    const data = mapWebflowItemToStrapiData(
      item,
      categoryMap,
      articleThumbnail,
      articleHeaderImage
    );
    await createStrapiPost({ strapiUrl, token: strapiToken, data });
    console.log(`Migrated ${data.slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
