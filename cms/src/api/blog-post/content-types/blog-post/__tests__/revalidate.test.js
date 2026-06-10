import { describe, expect, it, vi } from "vitest";
import revalidate from "../revalidate";

const {
  buildRevalidatePayload,
  getRevalidateDelayMs,
  scheduleBlogRevalidation,
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

  it("uses a configurable revalidate delay to avoid publishing race conditions", () => {
    expect(getRevalidateDelayMs((key, fallback) => fallback)).toBe(10000);
    expect(getRevalidateDelayMs(() => "0")).toBe(0);
    expect(getRevalidateDelayMs(() => "2500")).toBe(2500);
    expect(getRevalidateDelayMs(() => "invalid")).toBe(10000);
  });

  it("schedules revalidation after the publish lifecycle can commit", async () => {
    vi.useFakeTimers();
    const originalFetch = globalThis.fetch;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;

    try {
      scheduleBlogRevalidation({
        env: (key, fallback) =>
          ({
            BLOG_REVALIDATE_URL: "http://next.test/api/blog/revalidate",
            STRAPI_REVALIDATE_SECRET: "secret",
            BLOG_REVALIDATE_DELAY_MS: "25",
          })[key] ?? fallback,
        strapi: {
          log: {
            warn: vi.fn(),
          },
        },
        entity: {
          slug: "scheduled-post",
          publishedAt: "2026-06-10T00:00:00.000Z",
          categories: [],
        },
      });

      expect(fetchMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(24);
      expect(fetchMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe(
        "http://next.test/api/blog/revalidate?secret=secret"
      );
    } finally {
      globalThis.fetch = originalFetch;
      vi.useRealTimers();
    }
  });
});
