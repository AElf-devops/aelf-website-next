import type { NextApiRequest, NextApiResponse } from "next";
import { webflowAPI } from "@/api/axios";
import { formatDate } from "@/utils";
import { IRecentBlogListResponse } from "@/types/webflow";

const COLLECTION_ID = process.env.NEXT_PUBLIC_WEBFLOW_COLLECTION_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const response = await webflowAPI.get<IRecentBlogListResponse>(
      `/collections/${COLLECTION_ID}/items`
    );

    const filteredItems = response.items.filter(
      (item) => !item.isDraft && item.fieldData["post-date"]
    );

    const sortedItems = filteredItems.sort(
      (a, b) =>
        new Date(b.fieldData["post-date"]).getTime() -
        new Date(a.fieldData["post-date"]).getTime()
    );

    const blogs = sortedItems.slice(0, 6).map((item) => ({
      articleHeaderImage: item.fieldData["article-header-image"],
      title: item.fieldData.title,
      postDate: formatDate(item.fieldData["post-date"]),
    }));

    res.status(200).json(blogs);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: error.message || `Error fetching recent blogs: ${error}`,
    });
  }
}
