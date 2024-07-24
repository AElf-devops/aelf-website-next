import type { NextApiRequest, NextApiResponse } from "next";
import { webflowAPI } from "@/api/axios";
import { formatDate } from "@/utils";
import { concurrentRequests } from "@/utils/request";
import { IRecentBlogListResponse } from "@/types/webflow";

const COLLECTION_ID = process.env.NEXT_PUBLIC_WEBFLOW_COLLECTION_ID;
const LIMIT = 50;
const MAX_CONCURRENT_REQUESTS = 5;
const URL = `/collections/${COLLECTION_ID}/items/live`;

async function fetchAllItems(): Promise<IRecentBlogListResponse["items"]> {
  const getTotalResponse = await webflowAPI.get<IRecentBlogListResponse>(URL, {
    params: {
      limit: 1,
      offset: 0,
    },
  });

  const itemsTotal = getTotalResponse.pagination.total;
  const requestsTotal = Math.ceil(itemsTotal / LIMIT);

  const requests = [];
  for (let i = 0; i < requestsTotal; i++) {
    requests.push(
      webflowAPI.get<IRecentBlogListResponse>(URL, {
        params: {
          limit: LIMIT,
          offset: i * LIMIT,
        },
      })
    );
  }

  const responses = await concurrentRequests(requests, MAX_CONCURRENT_REQUESTS);

  let allItems: IRecentBlogListResponse["items"] = [];
  responses.forEach((response) => {
    allItems = allItems.concat(response.items);
  });

  return allItems;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const allItems = await fetchAllItems();
    const filteredItems = allItems.filter(
      (item) => item.fieldData["post-date"]
    );

    const sortedItems = filteredItems.sort(
      (a, b) =>
        new Date(b.fieldData["post-date"]).getTime() -
        new Date(a.fieldData["post-date"]).getTime()
    );

    const blogs = sortedItems.slice(0, 6).map((item) => ({
      articleHeaderImage: {
        ...item.fieldData["article-header-image"],
        alt: item.fieldData["alt-text-for-header-image"],
      },
      postDate: formatDate(item.fieldData["post-date"]),
      title: item.fieldData.title,
      slug: item.fieldData.slug,
    }));

    res.status(200).json(blogs);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: error.message || `Error fetching recent blogs: ${error}`,
    });
  }
}
