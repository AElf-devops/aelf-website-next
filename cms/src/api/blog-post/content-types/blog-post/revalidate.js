"use strict";

const BLOG_POST_UID = "api::blog-post.blog-post";
const DEFAULT_REVALIDATE_DELAY_MS = 10000;

async function revalidateBlogPages({
  env,
  strapi,
  uid = BLOG_POST_UID,
  entity,
  previousEntity,
}) {
  if (uid !== BLOG_POST_UID) {
    return;
  }

  const revalidateUrl = env("BLOG_REVALIDATE_URL");
  const secret = env("STRAPI_REVALIDATE_SECRET");

  if (!revalidateUrl || !secret) {
    return;
  }

  try {
    const delayMs = getRevalidateDelayMs(env);
    if (delayMs > 0) {
      await wait(delayMs);
    }

    const url = new URL(revalidateUrl);
    url.searchParams.set("secret", secret);

    const payload = await getRevalidatePayload({
      strapi,
      uid,
      entity,
      previousEntity,
    });

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      strapi.log.warn(
        `Blog revalidation failed with ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    strapi.log.warn(`Blog revalidation failed: ${error.message}`);
  }
}

function getRevalidateDelayMs(env) {
  const value = env("BLOG_REVALIDATE_DELAY_MS", DEFAULT_REVALIDATE_DELAY_MS);
  const delayMs = Number(value);

  return Number.isFinite(delayMs) && delayMs >= 0
    ? delayMs
    : DEFAULT_REVALIDATE_DELAY_MS;
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

async function getRevalidatePayload({ strapi, uid, entity, previousEntity }) {
  const initialPost = getPostFromEntity(entity);
  const initialPreviousPost = getPostFromEntity(previousEntity);
  const documentId =
    initialPost?.documentId ||
    entity?.documentId ||
    initialPreviousPost?.documentId ||
    previousEntity?.documentId;

  let post = initialPost;
  let previousPost = initialPreviousPost;

  if (documentId) {
    if (!post?.slug || !Array.isArray(post?.categories)) {
      post =
        (await findBlogPostForRevalidation({
          strapi,
          uid,
          documentId,
          status: "published",
        })) ||
        (await findBlogPostForRevalidation({
          strapi,
          uid,
          documentId,
          status: "draft",
        })) ||
        post;
    }

    if (!previousPost?.slug || !Array.isArray(previousPost?.categories)) {
      previousPost = initialPreviousPost;
    }
  }

  return buildRevalidatePayload({ currentPost: post, previousPost });
}

function buildRevalidatePayload({ currentPost, previousPost }) {
  const slug = currentPost?.slug;
  const previousSlug =
    previousPost?.slug && previousPost.slug !== slug ? previousPost.slug : undefined;
  const categories = unique([
    ...getCategorySlugs(currentPost),
    ...getCategorySlugs(previousPost),
  ]);

  return removeUndefined({
    slug,
    previousSlug,
    categories,
  });
}

function shouldRevalidateBlogPostChange({ previousPost, currentPost }) {
  return isPublished(previousPost) || isPublished(currentPost);
}

function isPublished(post) {
  return Boolean(post?.publishedAt);
}

async function findBlogPostForRevalidation({ strapi, uid, documentId, status }) {
  try {
    return await strapi.documents(uid).findOne({
      documentId,
      status,
      populate: {
        categories: {
          fields: ["slug"],
        },
      },
    });
  } catch (error) {
    strapi.log.warn(
      `Failed to fetch ${status} blog post for revalidation: ${error.message}`
    );
    return undefined;
  }
}

function getPostFromEntity(entity) {
  if (!entity) {
    return undefined;
  }

  if (Array.isArray(entity.entries)) {
    return entity.entries[0];
  }

  return entity;
}

function getCategorySlugs(post) {
  if (!Array.isArray(post?.categories)) {
    return [];
  }

  return post.categories.map((category) => category.slug).filter(Boolean);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function removeUndefined(value) {
  return Object.entries(value).reduce((result, [key, childValue]) => {
    if (childValue !== undefined) {
      result[key] = childValue;
    }

    return result;
  }, {});
}

module.exports = {
  BLOG_POST_UID,
  buildRevalidatePayload,
  getRevalidateDelayMs,
  getCategorySlugs,
  getRevalidatePayload,
  revalidateBlogPages,
  shouldRevalidateBlogPostChange,
};
