import { describe, expect, it } from "vitest";
import previewUrl from "../preview-url";

const { buildBlogPreviewUrl, removePreviewUrlFromResponse } = previewUrl;

describe("blog post previewUrl", () => {
  it("builds a website preview URL from origin, slug, and secret", () => {
    expect(
      buildBlogPreviewUrl({
        origin: "https://aelf.com/",
        identifier: "cms draft sample",
        secret: "preview secret",
      })
    ).toBe(
      "https://aelf.com/posts/preview/cms%20draft%20sample?secret=preview+secret"
    );
  });

  it("removes previewUrl fields from public REST responses", () => {
    expect(
      removePreviewUrlFromResponse({
        data: [
          {
            title: "Draft",
            previewUrl: "https://aelf.com/posts/preview/draft?secret=secret",
            categories: [{ name: "Community", previewUrl: "nested" }],
          },
        ],
        meta: {
          pagination: { total: 1 },
        },
      })
    ).toEqual({
      data: [
        {
          title: "Draft",
          categories: [{ name: "Community" }],
        },
      ],
      meta: {
        pagination: { total: 1 },
      },
    });
  });
});
