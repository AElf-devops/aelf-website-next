import { IBlogPost, IBlogPostListResult } from "@/types/blog";
import { mapStrapiBlogPost, mapStrapiBlogPostsResponse } from "./strapi";

export const BLOG_REVALIDATE_PERIOD = 300;
export const BLOG_PAGE_SIZE = 12;
export const RECENT_BLOG_LIMIT = 6;
export const BLOG_LATEST_POSTS_ARCHIVE_LIMIT = 100;
export const BLOG_ALL_POSTS_LIMIT = 500;

interface IFetchBlogPostsParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
}

interface IFetchBlogPostSlugsOptions {
  indexedOnly?: boolean;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export function getBlogCanonicalOrigin(): string {
  return trimTrailingSlash(
    process.env.BLOG_CANONICAL_ORIGIN || "https://blog.aelf.com"
  );
}

function getStrapiApiUrl(): string | undefined {
  const apiUrl = process.env.STRAPI_API_URL;
  return apiUrl ? trimTrailingSlash(apiUrl) : undefined;
}

function getStrapiMediaOrigin(): string | undefined {
  return process.env.STRAPI_MEDIA_ORIGIN || getStrapiApiUrl();
}

function appendSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: unknown
) {
  if (value === undefined || value === null || value === "") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      appendSearchParam(searchParams, `${key}[${index}]`, item)
    );
    return;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) =>
      appendSearchParam(searchParams, `${key}[${childKey}]`, childValue)
    );
    return;
  }

  searchParams.set(key, String(value));
}

async function fetchStrapi<T = any>(
  path: string,
  params: Record<string, unknown> = {}
): Promise<T | undefined> {
  const apiUrl = getStrapiApiUrl();
  if (!apiUrl) {
    return undefined;
  }

  const url = new URL(`/api/${path.replace(/^\//, "")}`, apiUrl);
  Object.entries(params).forEach(([key, value]) =>
    appendSearchParam(url.searchParams, key, value)
  );

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(
      `Strapi request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

const BLOG_POST_POPULATE = {
  articleThumbnail: true,
  articleHeaderImage: true,
  coverImage: true,
  ogImage: true,
  categories: true,
  tags: true,
};

const BLOG_POST_LIST_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "postDate",
  "publishedAt",
  "updatedAt",
  "seoTitle",
  "seoDescription",
  "headerImageAlt",
  "author",
  "featured",
  "sitemapIndexed",
  "legacySourceId",
];

export async function fetchBlogPosts({
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
  categorySlug,
}: IFetchBlogPostsParams = {}): Promise<IBlogPostListResult> {
  const response = await fetchStrapi("blog-posts", {
    fields: BLOG_POST_LIST_FIELDS,
    populate: BLOG_POST_POPULATE,
    sort: [
      "postDate:desc",
      "legacySourceId:desc",
      "publishedAt:desc",
      "updatedAt:desc",
    ],
    pagination: { page, pageSize },
    filters: categorySlug
      ? {
          categories: {
            slug: {
              $eq: categorySlug,
            },
          },
        }
      : undefined,
  });

  if (!response) {
    return {
      posts: [],
      pagination: {
        page,
        pageSize,
        pageCount: 1,
        total: 0,
      },
    };
  }

  return mapStrapiBlogPostsResponse(response, {
    mediaOrigin: getStrapiMediaOrigin(),
  });
}

export async function fetchRecentBlogPosts(): Promise<IBlogPost[]> {
  const { posts } = await fetchBlogPosts({
    page: 1,
    pageSize: RECENT_BLOG_LIMIT,
  });

  return posts;
}

export async function fetchLatestBlogPosts(
  limit = BLOG_PAGE_SIZE
): Promise<IBlogPost[]> {
  const { posts } = await fetchBlogPosts({
    page: 1,
    pageSize: limit,
  });

  return posts;
}

export async function fetchAllBlogPosts(): Promise<IBlogPost[]> {
  const { posts } = await fetchBlogPosts({
    page: 1,
    pageSize: BLOG_ALL_POSTS_LIMIT,
  });

  return posts;
}

export async function fetchLatestPostsArchive(): Promise<IBlogPost[]> {
  const { posts } = await fetchBlogPosts({
    page: 1,
    pageSize: BLOG_LATEST_POSTS_ARCHIVE_LIMIT,
  });

  return posts;
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<IBlogPost | undefined> {
  const response = await fetchStrapi("blog-posts", {
    populate: BLOG_POST_POPULATE,
    filters: {
      slug: {
        $eq: slug,
      },
    },
    pagination: {
      page: 1,
      pageSize: 1,
    },
  });

  const post = response?.data?.[0];
  return post
    ? mapStrapiBlogPost(post, { mediaOrigin: getStrapiMediaOrigin() })
    : undefined;
}

export async function fetchBlogPostSlugs({
  indexedOnly = false,
}: IFetchBlogPostSlugsOptions = {}): Promise<string[]> {
  const response = await fetchStrapi("blog-posts", {
    fields: ["slug", "sitemapIndexed"],
    pagination: {
      page: 1,
      pageSize: BLOG_ALL_POSTS_LIMIT,
    },
  });

  if (!response?.data) return [];

  return response.data
    .filter((item: any) => !indexedOnly || item.sitemapIndexed !== false)
    .map((item: any) => item.slug)
    .filter((slug: unknown): slug is string => typeof slug === "string");
}
