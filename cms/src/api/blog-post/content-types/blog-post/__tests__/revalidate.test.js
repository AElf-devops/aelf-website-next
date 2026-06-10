import { describe, expect, it } from "vitest";
import revalidate from "../revalidate";

const {
  buildRevalidatePayload,
  shouldRevalidateBlogPostChange,
} = revalidate;

describe("blog post revalidation", () => {
  it("does not revalidate draft-only saves", () => {
    expect(
      shouldRevalidateBlogPostChange({
        previousPost: { slug: "draft", publishedAt: null },
        currentPost: { slug: "draft", publishedAt: null },
      })
    ).toBe(false);
  });

  it("revalidates publish, published update, and unpublish changes", () => {
    expect(
      shouldRevalidateBlogPostChange({
        previousPost: { slug: "post", publishedAt: null },
        currentPost: { slug: "post", publishedAt: "2026-06-10T00:00:00.000Z" },
      })
    ).toBe(true);

    expect(
      shouldRevalidateBlogPostChange({
        previousPost: { slug: "post", publishedAt: "2026-06-10T00:00:00.000Z" },
        currentPost: { slug: "post", publishedAt: "2026-06-10T00:00:00.000Z" },
      })
    ).toBe(true);

    expect(
      shouldRevalidateBlogPostChange({
        previousPost: { slug: "post", publishedAt: "2026-06-10T00:00:00.000Z" },
        currentPost: { slug: "post", publishedAt: null },
      })
    ).toBe(true);
  });

  it("includes current and previous paths when slug or categories change", () => {
    expect(
      buildRevalidatePayload({
        currentPost: {
          slug: "new-slug",
          categories: [{ slug: "technology" }],
        },
        previousPost: {
          slug: "old-slug",
          categories: [{ slug: "community" }, { slug: "technology" }],
        },
      })
    ).toEqual({
      slug: "new-slug",
      previousSlug: "old-slug",
      categories: ["technology", "community"],
    });
  });
});
