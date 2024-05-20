// -------------------------------------tag-list-----------------------------
interface ITag {
  id: number;
  tag: string;
}

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
}

interface IDetailBlog {
  id: number;
  title: string;
  tags: ITag[];
  isPopularArticle: boolean;
  content: OutputData;
  date_updated: string;
  date_created: string;
  viewCount: number;
  imgUrl?: string;
  subHeader: string
  publishDate: string;
}


interface IResponseBlog {
  id: number;
  title: string;
  tags: {
    tagList_id: {
      id: number;
      tag: string;
    };
  }[];
  isPopularArticle: boolean;
  content: OutputData;
  date_updated: string;
  date_created: string;
  viewCount: number;
  subHeader: string;
  publishDate: string;
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
