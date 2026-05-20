import type { NextApiRequest, NextApiResponse } from "next";
import { fetchLatestPostsArchive } from "@/lib/blog/api";

function getTraceId(req: NextApiRequest): string {
  const headerTraceId = req.headers["x-request-id"];
  if (typeof headerTraceId === "string" && headerTraceId) {
    return headerTraceId;
  }

  return `blog-latest-posts-${Date.now()}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const traceId = getTraceId(req);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed", traceId });
  }

  try {
    const posts = await fetchLatestPostsArchive();

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    return res.status(200).json({ posts, traceId });
  } catch (error) {
    console.error(`[${traceId}] Failed to fetch latest blog posts`, error);
    return res
      .status(500)
      .json({ message: "Failed to fetch latest blog posts", traceId });
  }
}
