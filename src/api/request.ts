import { apiServer } from "./axios";
import getUrlConfig from "@/constants/network/cms";

const urlConfig = getUrlConfig();

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
        },
        fields: "*",
        "fields[]": "tags.tagList_id.id",
        search: params.search,
        sort: params.sort,
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

export const updateViewCount = async (params: {
  id: number;
  viewCount: number;
}): Promise<void> => {
  const result = await fetch(`${urlConfig.cms}/items/blogList/${params.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      viewCount: params.viewCount,
    }),
    headers: {
      Authorization: process.env.NEXT_PUBLIC_TOKEN || "",
      "Content-Type": "application/json",
    },
  });
  const text = await result.text();
  const res = JSON.parse(text);
  return res;
};

export const getMostViewCountBlogList = async (): Promise<IDetailBlog[]> => {
  try {
    const res: {
      data: IResponseBlog[];
    } = await apiServer.get("/items/blogList", {
      params: {
        page: 1,
        limit: 10,
        fields: "*",
        "fields[]": "tags.tagList_id.*",
        sort: "-viewCount",
        filter: {
          viewCount: {
            _nnull: true,
          },
        },
      },
    });

    return res.data.map((item: IResponseBlog) => {
      return {
        ...item,
        tags: item.tags.map((item: any) => ({
          id: item.tagList_id.id,
          tag: item.tagList_id.tag,
        })),
      };
    });
  } catch (error) {
    return [];
  }
};

export const getTrendBlogList = async (): Promise<IDetailBlog[]> => {
  try {
    const res: {
      data: IResponseBlog[];
    } = await apiServer.get("/items/blogList", {
      params: {
        page: 1,
        limit: 10,
        fields: "*",
        "fields[]": "tags.tagList_id.*",
        sort: "-trendSort",
        filter: {
          trendSort: {
            _nnull: true,
          },
        },
      },
    });
    const newData = res.data.map((item: IResponseBlog) => {
      return {
        ...item,
        tags: item.tags.map((item: any) => ({
          id: item.tagList_id.id,
          tag: item.tagList_id.tag,
        })),
      };
    });
    return newData;
  } catch (error) {
    return [];
  }
};

export const getBlogDetail = async (
  id: string | number
): Promise<{
  data: IDetailBlog;
}> => {
  const res: {
    data: IResponseBlog;
  } = await apiServer.get(`/items/blogList/${id}`, {
    params: {
      fields: "*",
      "fields[]": "tags.tagList_id.*",
    },
  });

  return {
    data: {
      ...res.data,
      tags: res.data.tags.map((item: any) => {
        return {
          id: item.tagList_id.id,
          tag: item.tagList_id.tag,
        };
      }),
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



export const getAllDynamicPaths = async (): Promise<{
  data: IDetailBlog[];
}> => {
  try {
    const res: {
      data: IDetailBlog[];
    } = await apiServer.get("/items/blogList");
    return res;
  } catch (error) {
    return {
      data: [],
    };
  }
};

