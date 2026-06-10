import type { NextApiRequest, NextApiResponse } from "next";
import {
  getBlogRevalidatePaths,
  isBlogRevalidateAuthorized,
} from "@/lib/blog/revalidate";

function getTraceId(req: NextApiRequest): string {
  const headerTraceId = req.headers["x-request-id"];
  if (typeof headerTraceId === "string" && headerTraceId) {
    return headerTraceId;
  }

  return `blog-revalidate-${Date.now()}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const traceId = getTraceId(req);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed", traceId });
  }

  if (
    !isBlogRevalidateAuthorized(
      process.env.STRAPI_REVALIDATE_SECRET,
      req.query.secret
    )
  ) {
    return res.status(401).json({ message: "Invalid secret", traceId });
  }

  try {
    const paths = getBlogRevalidatePaths({
      slug: req.body?.slug,
      previousSlug: req.body?.previousSlug,
      categories: req.body?.categories,
      previousCategories: req.body?.previousCategories,
    });

    await Promise.all(paths.map((path) => res.revalidate(path)));

    return res.status(200).json({ revalidated: true, paths, traceId });
  } catch (error) {
    console.error(`[${traceId}] Failed to revalidate blog pages`, error);
    return res.status(500).json({ message: "Failed to revalidate", traceId });
  }
}
