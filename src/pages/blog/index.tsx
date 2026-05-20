import Head from "next/head";
import { GetStaticProps } from "next";
import { BlogHomePage } from "@/pageComponents/blog/BlogPages";
import {
  BLOG_REVALIDATE_PERIOD,
  fetchLatestBlogPosts,
} from "@/lib/blog/api";
import { getBlogIndexUrl } from "@/lib/blog/seo";
import { IBlogPost } from "@/types/blog";

interface IBlogIndexProps {
  posts: IBlogPost[];
  canonicalUrl: string;
}

export default function BlogIndex({
  posts,
  canonicalUrl,
}: IBlogIndexProps) {
  const title = "aelf Blog";
  const description =
    "Read aelf updates, product announcements, ecosystem news, and blockchain research.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <BlogHomePage posts={posts} />
    </>
  );
}

export const getStaticProps: GetStaticProps<IBlogIndexProps> = async () => {
  const posts = await fetchLatestBlogPosts(12);

  return {
    props: {
      posts,
      canonicalUrl: getBlogIndexUrl(),
    },
    revalidate: BLOG_REVALIDATE_PERIOD,
  };
};
