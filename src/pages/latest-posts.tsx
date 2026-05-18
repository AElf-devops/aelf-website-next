import Head from "next/head";
import { GetStaticProps } from "next";
import { BlogLatestPostsPage } from "@/pageComponents/blog/BlogPages";
import { BLOG_REVALIDATE_PERIOD, fetchLatestBlogPosts } from "@/lib/blog/api";
import { getBlogLatestPostsUrl } from "@/lib/blog/seo";
import { IBlogPost } from "@/types/blog";

interface ILatestPostsProps {
  posts: IBlogPost[];
  canonicalUrl: string;
}

export default function LatestPosts({ posts, canonicalUrl }: ILatestPostsProps) {
  const title = "Latest Posts | aelf Blog";
  const description =
    "Browse the latest aelf Blog posts by publish date and category.";

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
      <BlogLatestPostsPage posts={posts} />
    </>
  );
}

export const getStaticProps: GetStaticProps<ILatestPostsProps> = async () => {
  const posts = await fetchLatestBlogPosts(12);

  return {
    props: {
      posts,
      canonicalUrl: getBlogLatestPostsUrl(),
    },
    revalidate: BLOG_REVALIDATE_PERIOD,
  };
};
