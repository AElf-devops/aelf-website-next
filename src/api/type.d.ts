// -------------------------------------tag-list-----------------------------
interface ITag {
  id: number;
  tag: string;
}
type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface IBlog {
  id: number;
  title: string;
  tags: number[];
  isPopularArticle: boolean;
  content: OutputData;
  date_updated: string;
  date_created: string;
  viewCount: number;
  subHeader: string;
  publishDate: string;
  metaDescription: string;
  canonicalUrl: string;
  noFollow: boolean;
  noIndex: boolean;
  ogImage: string;
  sitemapChangeFrequency: Changefreq;
  sitemapPriority: number;
}


interface IDetailBlog extends IBlog {
  tags: ITag[];
  imgUrl?: string;
}

interface IResponseBlog extends IBlog {
  tags: {
    tagList_id: {
      id: number;
      tag: string;
    };
  }[];
}

interface IBlogListSearchParams {
  page: number;
  pageSize?: number;
  limit?: number;
  tag?: string;
  isPopularArticle?: boolean | null;
  search?: string;
  tagId?: number | null | undefined;
  sort?: string | null;
  sortValue?: string;
}
