import { apiServer } from "./axios";

export const getBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
  count: number;
}> => {
  const res: {
    data: IResponseBlog[];
  } = await apiServer.get("/blogList", {
    params: {
      page: params.page,
      limit: params.limit,
      filter: {
        tags: {
          tagList_id: {
            id: {
              _eq: params.tagId,
            },
          },
        },
        // is_popular_article: {
        //   _eq: params.isPopularArticle,
        // },
      },
      fields: "*",
      "fields[]": "tags.tagList_id.id",
      search: params.search,
      sort: params.sort,
    },
  });

  const countRes: any = await await apiServer.get("/blogList", {
    params: {
      filter: {
        tags: {
          tagList_id: {
            id: {
              _eq: params.tagId,
            },
          },
        },
        is_popular_article: {
          _eq: params.isPopularArticle,
        },
      },
      search: params.search,
      aggregate: {
        countDistinct: "id",
      },
    },
  });

  const count = countRes.data[0]?.countDistinct?.id;

  const newData = res.data.map((item: IResponseBlog) => {
    return {
      ...item,
      tags: item.tags.map((item: any) => item?.tagList_id?.id),
    };
  });

  return {
    data: newData,
    count,
  };
};

export const getPopularBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
}> => {
  return apiServer.get("/blogList", {
    params: {
      page: params.page,
      limit: params.limit,
      filter: {
        is_popular_article: {
          _eq: params.isPopularArticle,
        },
      },
    },
  });
};

export const searchBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
}> => {
  return apiServer.get("/blogList", {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search,
    },
  });
};

export const getBlogDetail = async (
  id: string | number
): Promise<{
  data: IBlog;
}> => {
  const res: {
    data: IResponseBlog;
  } = await apiServer.get(`/blogList/${id}`, {
    params: {
      fields: "*",
      "fields[]": "tags.tagList_id.id",
    },
  });

  return {
    data: {
      ...res.data,
      tags: res.data.tags.map((item: any) => item.tagList_id.id) as number[],
    },
  };
};

export const getBlogListCount = async (): Promise<{
  data: any;
}> => {
  return apiServer.get("/blogList?aggregate[count]=*");
};

export const getTagList = async (): Promise<{
  data: ITag[];
}> => {
  return apiServer.get("/tagList");
};
