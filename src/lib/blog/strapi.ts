import { IBlogImage, IBlogPagination, IBlogPost, IBlogTaxonomy } from "@/types/blog";

interface IMapOptions {
  mediaOrigin?: string;
}

const DEFAULT_PAGINATION: IBlogPagination = {
  page: 1,
  pageSize: 0,
  pageCount: 1,
  total: 0,
};

function unwrapEntity<T = any>(entity: any): T {
  if (!entity) return entity;
  if (entity.data) return unwrapEntity(entity.data);
  if (entity.attributes) {
    return {
      id: entity.id,
      documentId: entity.documentId,
      ...entity.attributes,
    };
  }
  return entity;
}

function ensureText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  Object.keys(value).forEach((key) => {
    if (value[key] === undefined) {
      delete value[key];
    }
  });
  return value;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function createExcerpt(data: any): string {
  return (
    ensureText(data.excerpt) ||
    ensureText(data.seoDescription) ||
    ensureText(data.text) ||
    stripHtml(ensureText(data.content)).slice(0, 180)
  );
}

function toAbsoluteUrl(url: string, mediaOrigin?: string): string {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  if (!mediaOrigin) return url;

  return `${mediaOrigin.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}

function mapMedia(media: any, options: IMapOptions): IBlogImage | undefined {
  const data = Array.isArray(media) ? media[0] : unwrapEntity(media);
  const url = ensureText(data?.url);

  if (!url) return undefined;

  return omitUndefined({
    url: toAbsoluteUrl(url, options.mediaOrigin),
    alt: ensureText(data.alternativeText) || ensureText(data.alt),
    width: typeof data.width === "number" ? data.width : undefined,
    height: typeof data.height === "number" ? data.height : undefined,
  });
}

function mapTaxonomyItems(items: any): IBlogTaxonomy[] {
  const list = Array.isArray(items) ? items : unwrapEntity(items) || [];
  if (!Array.isArray(list)) return [];

  return list
    .map((item) => unwrapEntity(item))
    .map((item) => ({
      name: ensureText(item?.name) || ensureText(item?.title),
      slug: ensureText(item?.slug),
    }))
    .filter((item) => item.name && item.slug);
}

export function mapStrapiBlogPost(
  strapiPost: any,
  options: IMapOptions = {}
): IBlogPost {
  const data = unwrapEntity(strapiPost);
  const title = ensureText(data.title) || ensureText(data.name);
  const seoDescription = ensureText(data.seoDescription) || createExcerpt(data);
  const publishedAt =
    ensureText(data.postDate) ||
    ensureText(data.publishedAt) ||
    ensureText(data.createdAt);
  const headerImageAlt = ensureText(data.headerImageAlt);
  const articleThumbnail = mapMedia(
    data.articleThumbnail || data.articleImage || data.ogImage || data.coverImage,
    options
  );
  const articleHeaderImage = mapMedia(
    data.articleHeaderImage || data.coverImage || data.articleThumbnail,
    options
  );
  const normalizedArticleHeaderImage =
    articleHeaderImage && headerImageAlt
      ? { ...articleHeaderImage, alt: headerImageAlt }
      : articleHeaderImage;
  const coverImage =
    articleThumbnail ||
    normalizedArticleHeaderImage ||
    mapMedia(data.coverImage, options);
  const ogImage =
    mapMedia(data.ogImage, options) || articleThumbnail || normalizedArticleHeaderImage;

  return omitUndefined({
    id: ensureText(data.documentId) || String(data.id || data.slug),
    title,
    slug: ensureText(data.slug),
    excerpt: createExcerpt({ ...data, seoDescription }),
    content: data.content || "",
    publishedAt,
    updatedAt: ensureText(data.updatedAt),
    seoTitle: ensureText(data.seoTitle) || title,
    seoDescription,
    articleThumbnail,
    articleHeaderImage: normalizedArticleHeaderImage,
    headerImageAlt: headerImageAlt || undefined,
    coverImage,
    ogImage,
    author:
      ensureText(data.author) ||
      ensureText(unwrapEntity(data.author)?.name) ||
      undefined,
    featured: data.featured === true,
    sitemapIndexed: data.sitemapIndexed !== false,
    categories: mapTaxonomyItems(data.categories),
    tags: mapTaxonomyItems(data.tags),
    legacySourceId: ensureText(data.legacySourceId) || undefined,
  });
}

export function mapStrapiBlogPostsResponse(
  response: any,
  options: IMapOptions = {}
) {
  const posts = (response?.data || []).map((item: any) =>
    mapStrapiBlogPost(item, options)
  );

  return {
    posts,
    pagination: response?.meta?.pagination || {
      ...DEFAULT_PAGINATION,
      pageSize: posts.length,
      total: posts.length,
    },
  };
}
