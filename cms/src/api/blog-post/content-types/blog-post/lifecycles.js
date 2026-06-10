"use strict";

const { getBlogPreviewUrlFromEnv } = require("./preview-url");
const {
  BLOG_POST_UID,
  scheduleBlogRevalidation,
  shouldRevalidateBlogPostChange,
} = require("./revalidate");

module.exports = {
  async beforeCreate(event) {
    applyPreviewUrl(event);
  },

  async beforeUpdate(event) {
    event.state = event.state || {};
    event.state.previousPost = await getExistingPost(event);

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

  async afterCreate(event) {
    await revalidateIfPublishedChanged({
      currentPost: event.result,
    });
  },

  async afterUpdate(event) {
    await revalidateIfPublishedChanged({
      currentPost: event.result,
      previousPost: event.state?.previousPost,
    });
  },

  async beforeDelete(event) {
    event.state = event.state || {};
    event.state.previousPost = await getExistingPost(event);
  },

  async afterDelete(event) {
    await revalidateIfPublishedChanged({
      previousPost: event.state?.previousPost,
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

async function revalidateIfPublishedChanged({ currentPost, previousPost }) {
  if (
    !shouldRevalidateBlogPostChange({
      currentPost,
      previousPost,
    })
  ) {
    return;
  }

  scheduleBlogRevalidation({
    env: getRuntimeEnv,
    strapi,
    uid: BLOG_POST_UID,
    entity: currentPost,
    previousEntity: previousPost,
  });
}

async function getExistingSlug(event) {
  return (await getExistingPost(event))?.slug;
}

async function getExistingPost(event) {
  const where = event.params.where || {};
  const id = where.id;
  const documentId = where.documentId;

  if (!id && !documentId) {
    return undefined;
  }

  try {
    return await strapi.db.query(BLOG_POST_UID).findOne({
      where: documentId ? { documentId } : { id },
      populate: {
        categories: true,
      },
    });
  } catch (error) {
    strapi.log.warn(
      `Failed to resolve blog post lifecycle state: ${error.message}`
    );
    return undefined;
  }
}
