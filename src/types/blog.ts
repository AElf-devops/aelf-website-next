export interface IBlogImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface IBlogTaxonomy {
  name: string;
  slug: string;
}

export type TBlogContent =
  | string
  | Array<{
      type?: string;
      level?: number;
      children?: Array<{ text?: string; bold?: boolean; italic?: boolean }>;
      [key: string]: any;
    }>;

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: TBlogContent;
  publishedAt: string;
  updatedAt?: string;
  seoTitle: string;
  seoDescription: string;
  articleThumbnail?: IBlogImage;
  articleHeaderImage?: IBlogImage;
  headerImageAlt?: string;
  coverImage?: IBlogImage;
  ogImage?: IBlogImage;
  author?: string;
  featured: boolean;
  sitemapIndexed: boolean;
  categories: IBlogTaxonomy[];
  tags: IBlogTaxonomy[];
  legacySourceId?: string;
}

export interface IBlogPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface IBlogPostListResult {
  posts: IBlogPost[];
  pagination: IBlogPagination;
}
