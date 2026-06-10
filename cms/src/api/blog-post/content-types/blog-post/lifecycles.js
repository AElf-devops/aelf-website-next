"use strict";

const { getBlogPreviewUrlFromEnv } = require("./preview-url");

module.exports = {
  async beforeCreate(event) {
    applyPreviewUrl(event);
  },

  async beforeUpdate(event) {
    const data = event.params.data;

    if (!data) {
      return;
    }

    const slug = data.slug || (await getExistingSlug(event));

    if (!slug) {
      return;
    }

    data.previewUrl = getBlogPreviewUrlFromEnv({
      env: getRuntimeEnv,
      identifier: slug,
    });
  },
};

function applyPreviewUrl(event) {
  const data = event.params.data;

  if (!data?.slug) {
    return;
  }

  data.previewUrl = getBlogPreviewUrlFromEnv({
    env: getRuntimeEnv,
    identifier: data.slug,
  });
}

function getRuntimeEnv(name) {
  return process.env[name];
}

async function getExistingSlug(event) {
  const where = event.params.where || {};
  const id = where.id;
  const documentId = where.documentId;

  if (!id && !documentId) {
    return undefined;
  }

  try {
    const post = await strapi.db.query("api::blog-post.blog-post").findOne({
      where: documentId ? { documentId } : { id },
      select: ["slug"],
    });

    return post?.slug;
  } catch (error) {
    strapi.log.warn(`Failed to resolve blog previewUrl slug: ${error.message}`);
    return undefined;
  }
}
