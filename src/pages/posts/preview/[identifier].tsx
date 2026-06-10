import Head from "next/head";
import { GetServerSideProps } from "next";
import { BlogPostPage } from "@/pageComponents/blog/BlogPages";
import {
  fetchBlogPreviewPostByIdentifier,
  fetchLatestBlogPosts,
} from "@/lib/blog/api";
import { isBlogPreviewAuthorized } from "@/lib/blog/preview";
import { IBlogPost } from "@/types/blog";

interface IBlogPostPreviewProps {
  post: IBlogPost;
  latestPosts: IBlogPost[];
}

export default function BlogPostPreview({
  post,
  latestPosts,
}: IBlogPostPreviewProps) {
  return (
    <>
      <Head>
        <title>{`Preview: ${post.seoTitle}`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <BlogPostPage post={post} latestPosts={latestPosts} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  IBlogPostPreviewProps
> = async ({ params, query, res }) => {
  const identifier =
    typeof params?.identifier === "string" ? params.identifier : "";

  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (
    !identifier ||
    !isBlogPreviewAuthorized(process.env.STRAPI_PREVIEW_SECRET, query.secret)
  ) {
    return {
      notFound: true,
    };
  }

  const [post, latestPosts] = await Promise.all([
    fetchBlogPreviewPostByIdentifier(identifier),
    fetchLatestBlogPosts(2),
  ]);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      latestPosts,
    },
  };
};
