"use strict";

const PUBLIC_BLOG_ACTIONS = [
  "api::blog-post.blog-post.find",
  "api::blog-post.blog-post.findOne",
  "api::blog-category.blog-category.find",
  "api::blog-category.blog-category.findOne",
  "api::blog-tag.blog-tag.find",
  "api::blog-tag.blog-tag.findOne",
];

async function ensurePublicBlogReadPermissions(strapi) {
  const publicRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  if (!publicRole) return;

  const permissions = await strapi.db
    .query("plugin::users-permissions.permission")
    .findMany({ where: { role: { id: publicRole.id } } });
  const existingActions = new Set(permissions.map((permission) => permission.action));
  const missingActions = PUBLIC_BLOG_ACTIONS.filter((action) => !existingActions.has(action));

  await Promise.all(
    missingActions.map((action) =>
      strapi.db.query("plugin::users-permissions.permission").create({
        data: {
          action,
          role: publicRole.id,
        },
      })
    )
  );
}

module.exports = {
  async bootstrap({ strapi }) {
    await ensurePublicBlogReadPermissions(strapi);
  },
};
