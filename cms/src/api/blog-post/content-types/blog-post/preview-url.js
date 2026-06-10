"use strict";

const PREVIEW_PATH_PREFIX = "/posts/preview/";

function buildBlogPreviewUrl({ origin, identifier, secret }) {
  if (!origin || !identifier || !secret) {
    return "";
  }

  const url = new URL(
    `${PREVIEW_PATH_PREFIX}${encodeURIComponent(identifier)}`,
    stripTrailingSlash(origin)
  );
  url.searchParams.set("secret", secret);

  return url.toString();
}

function getBlogPreviewUrlFromEnv({ env, identifier }) {
  return buildBlogPreviewUrl({
    origin: env("BLOG_PREVIEW_ORIGIN"),
    identifier,
    secret: env("STRAPI_PREVIEW_SECRET"),
  });
}

function removePreviewUrlFromResponse(value) {
  if (Array.isArray(value)) {
    return value.map(removePreviewUrlFromResponse);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((result, [key, childValue]) => {
    if (key === "previewUrl") {
      return result;
    }

    result[key] = removePreviewUrlFromResponse(childValue);
    return result;
  }, {});
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

module.exports = {
  buildBlogPreviewUrl,
  getBlogPreviewUrlFromEnv,
  removePreviewUrlFromResponse,
};
