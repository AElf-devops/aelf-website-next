import { GetServerSideProps } from "next";
import {
  fetchAllBlogPosts,
  getBlogCanonicalOrigin,
} from "@/lib/blog/api";
import { getBlogSeoImage } from "@/lib/blog/seo";
import { IBlogImage } from "@/types/blog";

function BlogSitemap() {
  return null;
}

interface ISitemapUrl {
  loc: string;
  lastmod?: string;
  image?: IBlogImage;
  imageTitle?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(value?: string): string | undefined {
  if (!value) return undefined;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return undefined;

  return new Date(timestamp).toISOString();
}

function buildImageXml(image?: IBlogImage, title?: string): string {
  if (!image?.url) return "";

  return `
    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>${
        title ? `
      <image:title>${escapeXml(title)}</image:title>` : ""
      }${
        image.alt ? `
      <image:caption>${escapeXml(image.alt)}</image:caption>` : ""
      }
    </image:image>`;
}

function buildSitemapXml(urls: ISitemapUrl[]): string {
  const items = urls
    .map(
      ({ loc, lastmod, image, imageTitle }) => `
  <url>
    <loc>${escapeXml(loc)}</loc>${
        lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""
      }${buildImageXml(image, imageTitle)}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${items}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const origin = getBlogCanonicalOrigin();
  const posts = (await fetchAllBlogPosts()).filter(
    (post) => post.sitemapIndexed !== false
  );
  const newestPostDate = posts
    .map((post) => toLastmod(post.updatedAt || post.publishedAt))
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
  const categoryUrls = Array.from(
    new Map(
      posts.flatMap((post) =>
        post.categories.map((category) => [
          category.slug,
          `${origin}/category/${category.slug}`,
        ])
      )
    ).values()
  ).sort();
  const urls: ISitemapUrl[] = [
    { loc: origin, lastmod: newestPostDate },
    { loc: `${origin}/latest-posts`, lastmod: newestPostDate },
    ...categoryUrls.map((loc) => ({ loc, lastmod: newestPostDate })),
    ...posts.map((post) => ({
      loc: `${origin}/posts/${post.slug}`,
      lastmod: toLastmod(post.updatedAt || post.publishedAt),
      image: getBlogSeoImage(post),
      imageTitle: post.title,
    })),
  ];

  res.setHeader("Content-Type", "text/xml");
  res.write(buildSitemapXml(urls));
  res.end();

  return {
    props: {},
  };
};

export default BlogSitemap;
