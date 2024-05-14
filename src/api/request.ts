import { apiServer } from "./axios";

export const getBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
  count: number;
}> => {
  try {
    const { data: blogData, meta } = await apiServer.get<{
      data: IResponseBlog[];
      meta: {
        filter_count: number;
      };
    }>("/items/blogList", {
      params: {
        page: params.page,
        limit: params.limit,
        meta: "filter_count",
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
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    const newData = blogData.map((item: IResponseBlog) => {
      return {
        ...item,
        tags: item.tags.map((item: any) => item?.tagList_id?.id),
      };
    });

    return {
      data: newData,
      count: meta.filter_count,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      count: 0,
    };
  }
};

export const getPopularBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
}> => {
  try {
    const res: {
      data: IBlog[];
    } = await apiServer.get("/items/blogList", {
      params: {
        page: params.page,
        limit: params.limit,
        filter: {
          is_popular_article: {
            _eq: params.isPopularArticle,
          },
        },
      },
      headers: {
        "Content-Type": "application/json;",
      },
    });
    return res;
  } catch (error) {
    throw new Error();
  }
};

export const searchBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
}> => {
  return apiServer.get("/items/blogList", {
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
  } = await apiServer.get(`/items/blogList/${id}`, {
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

export const getTagList = async (): Promise<{
  data: ITag[];
}> => {
  try {
    const res: {
      data: ITag[];
    } = await apiServer.get("/items/tagList");
    return res;
  } catch (error) {
    return {
      data: [],
    };
  }
};
