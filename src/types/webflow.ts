interface IImage {
  alt?: string;
  fileId: string;
  url: string;
}

export interface IRecentBlogItem {
  articleHeaderImage: IImage;
  postDate: string;
  title: string;
  slug: string;
}

interface IPagination {
  limit: number;
  total: number;
}

interface IFieldData {
  ['article-header-image']: IImage;
  ['post-date']: string;
  title: string;
  slug: string;
}

interface IRecentBlogListResponseItem {
  id: string;
  isDraft: boolean;
  fieldData: IFieldData;
}

export interface IRecentBlogListResponse {
  pagination: IPagination;
  items: IRecentBlogListResponseItem[];
}
