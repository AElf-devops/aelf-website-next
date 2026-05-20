import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { BlogListPage } from "@/pageComponents/blog/BlogPages";
import {
  BLOG_REVALIDATE_PERIOD,
  fetchBlogPosts,
  getBlogCanonicalOrigin,
} from "@/lib/blog/api";
import { IBlogPost } from "@/types/blog";

interface IBlogCategoryProps {
  posts: IBlogPost[];
  categoryName: string;
  canonicalUrl: string;
}

export default function BlogCategory({
  posts,
  categoryName,
  canonicalUrl,
}: IBlogCategoryProps) {
  const title = `${categoryName} | aelf Blog`;
  const description = `Read ${categoryName} articles from the aelf Blog.`;

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
      <BlogListPage title={categoryName} posts={posts} compactHeader />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<IBlogCategoryProps> = async ({
  params,
}) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { posts } = await fetchBlogPosts({ categorySlug: slug, pageSize: 500 });

  if (!slug || posts.length === 0) {
    return {
      notFound: true,
      revalidate: BLOG_REVALIDATE_PERIOD,
    };
  }

  const categoryName =
    posts[0].categories.find((category) => category.slug === slug)?.name ||
    slug;

  return {
    props: {
      posts,
      categoryName,
      canonicalUrl: `${getBlogCanonicalOrigin()}/category/${slug}`,
    },
    revalidate: BLOG_REVALIDATE_PERIOD,
  };
};
