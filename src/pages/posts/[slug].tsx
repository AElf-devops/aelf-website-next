import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { BlogPostPage } from "@/pageComponents/blog/BlogPages";
import {
  BLOG_REVALIDATE_PERIOD,
  fetchLatestBlogPosts,
  fetchBlogPostBySlug,
  fetchBlogPostSlugs,
} from "@/lib/blog/api";
import {
  getBlogArticleStructuredData,
  getBlogPostUrl,
  getBlogSeoImage,
} from "@/lib/blog/seo";
import { IBlogPost } from "@/types/blog";

interface IBlogPostProps {
  post: IBlogPost;
  latestPosts: IBlogPost[];
  canonicalUrl: string;
}

export default function BlogPost({
  post,
  latestPosts,
  canonicalUrl,
}: IBlogPostProps) {
  const seoImage = getBlogSeoImage(post);

  return (
    <>
      <Head>
        <title>{post.seoTitle}</title>
        <meta name="description" content={post.seoDescription} />
        {!post.sitemapIndexed && (
          <meta name="robots" content="noindex,follow" />
        )}
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta
          property="article:modified_time"
          content={post.updatedAt || post.publishedAt}
        />
        {post.author && <meta property="article:author" content={post.author} />}
        {post.categories[0]?.name && (
          <meta property="article:section" content={post.categories[0].name} />
        )}
        {post.tags.map((tag) => (
          <meta property="article:tag" content={tag.name} key={tag.slug} />
        ))}
        {seoImage && <meta property="og:image" content={seoImage.url} />}
        {seoImage?.alt && <meta property="og:image:alt" content={seoImage.alt} />}
        <meta
          name="twitter:card"
          content={seoImage ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={post.seoTitle} />
        <meta name="twitter:description" content={post.seoDescription} />
        {seoImage && <meta name="twitter:image" content={seoImage.url} />}
      </Head>
      <script
        id="blog-article-structured-data-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBlogArticleStructuredData(post)),
        }}
      />
      <BlogPostPage post={post} latestPosts={latestPosts} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchBlogPostSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<IBlogPostProps> = async ({
  params,
}) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const [post, latestPosts] = await Promise.all([
    slug ? fetchBlogPostBySlug(slug) : undefined,
    fetchLatestBlogPosts(2),
  ]);

  if (!post) {
    return {
      notFound: true,
      revalidate: BLOG_REVALIDATE_PERIOD,
    };
  }

  return {
    props: {
      post,
      latestPosts,
      canonicalUrl: getBlogPostUrl(post.slug),
    },
    revalidate: BLOG_REVALIDATE_PERIOD,
  };
};
