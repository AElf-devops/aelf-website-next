import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CMS_DIR = path.join(ROOT_DIR, "cms");
const POST_UID = "api::blog-post.blog-post";
const require = createRequire(import.meta.url);

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

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!match) return;

      const [, key, rawValue] = match;
      if (process.env[key]) return;
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    });
}

function unwrapMedia(media) {
  if (!media) return undefined;
  if (Array.isArray(media)) return unwrapMedia(media[0]);
  if (media.data) return unwrapMedia(media.data);
  if (media.attributes) return { id: media.id, ...media.attributes };
  return media;
}

function getMediaId(media) {
  return unwrapMedia(media)?.id;
}

function getMediaAlt(media) {
  const data = unwrapMedia(media);
  return data?.alternativeText || data?.alt || "";
}

async function main() {
  loadEnvFile(path.join(ROOT_DIR, ".env"));
  loadEnvFile(path.join(CMS_DIR, ".env"));

  process.chdir(CMS_DIR);
  const { compileStrapi, createStrapi } = require(
    path.join(CMS_DIR, "node_modules/@strapi/core")
  );
  const appContext = await compileStrapi({ appDir: CMS_DIR });
  const strapi = await createStrapi(appContext).load();

  try {
    const posts = await strapi.documents(POST_UID).findMany({
      status: "published",
      fields: [
        "documentId",
        "slug",
        "featured",
        "headerImageAlt",
        "sitemapIndexed",
      ],
      populate: {
        articleThumbnail: true,
        articleHeaderImage: true,
        coverImage: true,
        ogImage: true,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });

    let updated = 0;
    for (const post of posts) {
      const articleThumbnailId = getMediaId(post.articleThumbnail);
      const articleHeaderImageId = getMediaId(post.articleHeaderImage);
      const coverImageId = getMediaId(post.coverImage);
      const ogImageId = getMediaId(post.ogImage);
      const fallbackThumbnailId = ogImageId || coverImageId;
      const fallbackHeaderImageId = coverImageId || ogImageId;
      const data = {};

      if (!articleThumbnailId && fallbackThumbnailId) {
        data.articleThumbnail = fallbackThumbnailId;
      }

      if (!articleHeaderImageId && fallbackHeaderImageId) {
        data.articleHeaderImage = fallbackHeaderImageId;
      }

      if (!ogImageId && fallbackThumbnailId) {
        data.ogImage = fallbackThumbnailId;
      }

      if (!post.headerImageAlt) {
        const headerAlt =
          getMediaAlt(post.articleHeaderImage) || getMediaAlt(post.coverImage);
        if (headerAlt) {
          data.headerImageAlt = headerAlt;
        }
      }

      if (post.sitemapIndexed !== false && post.sitemapIndexed !== true) {
        data.sitemapIndexed = true;
      }

      if (post.featured !== false && post.featured !== true) {
        data.featured = false;
      }

      if (Object.keys(data).length === 0) continue;

      await strapi.documents(POST_UID).update({
        documentId: post.documentId,
        status: "published",
        data,
      });
      updated += 1;
      console.log(`Backfilled ${post.slug}`);
    }

    console.log(`Done. scanned=${posts.length} updated=${updated}`);
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
