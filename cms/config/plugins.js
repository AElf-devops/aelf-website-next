module.exports = ({ env }) => {
  const bucket = env("AWS_BUCKET");

  if (!bucket) {
    return {};
  }

  return {
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
