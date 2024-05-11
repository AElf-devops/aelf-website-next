import { apiServer } from "./axios";

export const getBlogList = async (
  params: IBlogListSearchParams
): Promise<{
  data: IBlog[];
  count: number;
}> => {
  let newData: any = [];
  let count = 0;

  try {
    const res: {
      data: IResponseBlog[];
    } = await apiServer.get("/items/blogList", {
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
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (res.data) {
      newData = res.data.map((item: IResponseBlog) => {
        return {
          ...item,
          tags: item.tags.map((item: any) => item?.tagList_id?.id),
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const countRes: any = await apiServer.get("/items/blogList", {
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
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (
      countRes?.data &&
      countRes?.data[0] &&
      countRes?.data[0]?.countDistinct
    ) {
      count = countRes?.data[0]?.countDistinct?.id;
    }
  } catch (error) {
    console.log(error);
  }
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
