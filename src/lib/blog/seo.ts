import { IBlogPost } from "@/types/blog";
import { getBlogCanonicalOrigin } from "./api";

export function getBlogPostUrl(slug: string): string {
  return `${getBlogCanonicalOrigin()}/posts/${slug}`;
}

export function getBlogIndexUrl(): string {
  return getBlogCanonicalOrigin();
}

export function getBlogLatestPostsUrl(): string {
  return `${getBlogCanonicalOrigin()}/latest-posts`;
}

export function getBlogSeoImage(post: IBlogPost) {
  return (
    post.ogImage ||
    post.articleThumbnail ||
    post.articleHeaderImage ||
    post.coverImage
  );
}

export function getBlogArticleStructuredData(post: IBlogPost) {
  const image = getBlogSeoImage(post)?.url;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author || "aelf",
    },
    publisher: {
      "@type": "Organization",
      name: "aelf",
    },
    mainEntityOfPage: getBlogPostUrl(post.slug),
    ...(image ? { image } : {}),
  };
}
