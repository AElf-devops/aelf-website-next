module.exports = ({ env }) => {
  const bucket = env("AWS_BUCKET");
  const plugins = {
    publisher: {
      enabled: true,
      config: {
        contentTypes: ["api::blog-post.blog-post"],
        hooks: {
          afterPublish: async ({ strapi, uid, entity }) => {
            await revalidateBlogPages({ env, strapi, uid, entity });
          },
          afterUnpublish: async ({ strapi, uid, entity }) => {
            await revalidateBlogPages({ env, strapi, uid, entity });
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

async function revalidateBlogPages({ env, strapi, uid, entity }) {
  if (uid !== "api::blog-post.blog-post") {
    return;
  }

  const revalidateUrl = env("BLOG_REVALIDATE_URL");
  const secret = env("STRAPI_REVALIDATE_SECRET");

  if (!revalidateUrl || !secret) {
    return;
  }

  try {
    const url = new URL(revalidateUrl);
    url.searchParams.set("secret", secret);

    const payload = await getRevalidatePayload({ strapi, uid, entity });

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

async function getRevalidatePayload({ strapi, uid, entity }) {
  const initialPost = getPostFromEntity(entity);
  const documentId = initialPost?.documentId || entity?.documentId;

  if (!documentId) {
    return {};
  }

  let post = initialPost;

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

  return {
    slug: post?.slug,
    categories: getCategorySlugs(post),
  };
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
