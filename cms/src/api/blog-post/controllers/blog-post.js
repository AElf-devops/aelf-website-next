"use strict";

const { factories } = require("@strapi/strapi");
const {
  removePreviewUrlFromResponse,
} = require("../content-types/blog-post/preview-url");

module.exports = factories.createCoreController("api::blog-post.blog-post", () => ({
  async find(ctx) {
    const response = await super.find(ctx);
    return removePreviewUrlFromResponse(response);
  },

  async findOne(ctx) {
    const response = await super.findOne(ctx);
    return removePreviewUrlFromResponse(response);
  },
}));
