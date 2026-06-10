const {
  scheduleBlogRevalidation,
} = require("../src/api/blog-post/content-types/blog-post/revalidate");

module.exports = ({ env }) => {
  const bucket = env("AWS_BUCKET");
  const plugins = {
    publisher: {
      enabled: true,
      config: {
        contentTypes: ["api::blog-post.blog-post"],
        hooks: {
          afterPublish: async ({ strapi, uid, entity }) => {
            scheduleBlogRevalidation({ env, strapi, uid, entity });
          },
          afterUnpublish: async ({ strapi, uid, entity }) => {
            scheduleBlogRevalidation({ env, strapi, uid, entity });
          },
        },
      },
    },
  };

  if (!bucket) {
    return plugins;
  }

  return {
    ...plugins,
    upload: {
      config: {
        provider: "aws-s3",
        providerOptions: {
          baseUrl: env("AWS_CDN_URL") || undefined,
          rootPath: env("AWS_ROOT_PATH", "blog"),
          s3Options: {
            credentials: {
              accessKeyId: env("AWS_ACCESS_KEY_ID"),
              secretAccessKey: env("AWS_ACCESS_SECRET"),
            },
            region: env("AWS_REGION"),
            params: {
              Bucket: bucket,
              ACL: env("AWS_ACL", "private"),
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};
