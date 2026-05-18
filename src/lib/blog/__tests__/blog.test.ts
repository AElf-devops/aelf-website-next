import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getBlogContentFormat, renderBlogContent } from "../content";
import { getBlogRevalidatePaths, isBlogRevalidateAuthorized } from "../revalidate";
import { createBlogSlug } from "../slug";
import { mapStrapiBlogPost, mapStrapiBlogPostsResponse } from "../strapi";

const strapiPost = {
  id: 1,
  documentId: "doc_1",
  title: "aelf Completes 2,000,000 ELF Allocation",
  slug: "aelf-completes-2-000-000-elf-allocation",
  excerpt: "",
  content: "<p>Allocation update.</p>",
  publishedAt: "2026-01-30T00:00:00.000Z",
  updatedAt: "2026-01-31T00:00:00.000Z",
  seoTitle: "",
  seoDescription: "aelf allocation update",
  articleThumbnail: {
    url: "/uploads/thumb.jpg",
    alternativeText: "Thumbnail alt",
  },
  articleHeaderImage: {
    url: "/uploads/header.jpg",
    alternativeText: "Header alt",
  },
  headerImageAlt: "Explicit header alt",
  coverImage: {
    url: "/uploads/cover.jpg",
    alternativeText: "Cover alt",
  },
  ogImage: null,
  author: "aelf Team",
  featured: true,
  sitemapIndexed: false,
  categories: [
    {
      name: "Product Updates",
      slug: "product-updates",
    },
  ],
  tags: [
    {
      name: "eBridge",
      slug: "ebridge",
    },
  ],
  legacySourceId: "webflow-1",
};

describe("createBlogSlug", () => {
  it("generates lowercase hyphenated slugs while preserving number separators", () => {
    expect(
      createBlogSlug("aelf Completes 2,000,000 ELF Allocation to eBridge")
    ).toBe("aelf-completes-2-000-000-elf-allocation-to-ebridge");
  });

  it("removes punctuation and collapses repeated separators", () => {
    expect(createBlogSlug(" Hello [AI]: What's Next? ")).toBe(
      "hello-ai-whats-next"
    );
  });
});

describe("mapStrapiBlogPost", () => {
  it("maps Strapi 5 flattened blog posts into the frontend contract", () => {
    const post = mapStrapiBlogPost(strapiPost, {
      mediaOrigin: "https://cms.aelf.com",
    });

    expect(post).toMatchObject({
      id: "doc_1",
      legacySourceId: "webflow-1",
      title: "aelf Completes 2,000,000 ELF Allocation",
      slug: "aelf-completes-2-000-000-elf-allocation",
      excerpt: "aelf allocation update",
      content: "<p>Allocation update.</p>",
      publishedAt: "2026-01-30T00:00:00.000Z",
      updatedAt: "2026-01-31T00:00:00.000Z",
      seoTitle: "aelf Completes 2,000,000 ELF Allocation",
      seoDescription: "aelf allocation update",
      articleThumbnail: {
        url: "https://cms.aelf.com/uploads/thumb.jpg",
        alt: "Thumbnail alt",
      },
      articleHeaderImage: {
        url: "https://cms.aelf.com/uploads/header.jpg",
        alt: "Explicit header alt",
      },
      coverImage: {
        url: "https://cms.aelf.com/uploads/thumb.jpg",
        alt: "Thumbnail alt",
      },
      featured: true,
      sitemapIndexed: false,
      categories: [{ name: "Product Updates", slug: "product-updates" }],
      tags: [{ name: "eBridge", slug: "ebridge" }],
    });
  });

  it("maps Strapi list envelopes and preserves pagination metadata", () => {
    const response = {
      data: [strapiPost],
      meta: {
        pagination: {
          page: 1,
          pageSize: 6,
          pageCount: 1,
          total: 1,
        },
      },
    };

    expect(
      mapStrapiBlogPostsResponse(response, {
        mediaOrigin: "https://cms.aelf.com",
      })
    ).toMatchObject({
      posts: [
        {
          id: "doc_1",
          slug: "aelf-completes-2-000-000-elf-allocation",
        },
      ],
      pagination: {
        page: 1,
        pageSize: 6,
        pageCount: 1,
        total: 1,
      },
    });
  });

  it("omits undefined optional fields so Next.js can serialize page props", () => {
    const post = mapStrapiBlogPost({
      ...strapiPost,
      author: undefined,
      legacySourceId: undefined,
      coverImage: null,
      articleThumbnail: null,
      articleHeaderImage: null,
      ogImage: null,
    });

    expect(Object.prototype.hasOwnProperty.call(post, "author")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(post, "legacySourceId")).toBe(
      false
    );
    expect(Object.prototype.hasOwnProperty.call(post, "coverImage")).toBe(false);
  });
});

describe("renderBlogContent", () => {
  it("keeps migrated Webflow HTML on the legacy HTML path", () => {
    expect(getBlogContentFormat("<p>Legacy <strong>HTML</strong></p>")).toBe(
      "html"
    );
  });

  it("renders common Strapi markdown preview formats", () => {
    const markup = renderToStaticMarkup(
      renderBlogContent(`# Heading

Text with **bold**, *italic*, <u>underline</u>, ~~deleted~~, and \`code\`.

- Bullet item

1. Ordered item

> Quote item

\`\`\`js
const message = "hello";
\`\`\`

![Alt text](https://aelf.com/image.png)

[aelf](https://aelf.com/)`)
    );

    expect(markup).toContain("<h1>Heading</h1>");
    expect(markup).toContain("<strong>bold</strong>");
    expect(markup).toContain("<em>italic</em>");
    expect(markup).toContain("<u>underline</u>");
    expect(markup).toContain("<del>deleted</del>");
    expect(markup).toContain("<code>code</code>");
    expect(markup).toContain("<ul>");
    expect(markup).toContain("<ol>");
    expect(markup).toContain("<blockquote>Quote item</blockquote>");
    expect(markup).toContain('<code class="language-js">');
    expect(markup).toContain('<img src="https://aelf.com/image.png"');
    expect(markup).toContain('<a href="https://aelf.com/">aelf</a>');
  });
});

describe("blog revalidation", () => {
  it("builds all paths affected by a published post", () => {
    expect(
      getBlogRevalidatePaths({
        slug: "aelf-completes-2-000-000-elf-allocation",
        categories: ["product-updates"],
      })
    ).toEqual([
      "/",
      "/blog",
      "/latest-posts",
      "/posts/aelf-completes-2-000-000-elf-allocation",
      "/category/product-updates",
    ]);
  });

  it("requires an exact secret match before revalidating", () => {
    expect(isBlogRevalidateAuthorized("secret", "secret")).toBe(true);
    expect(isBlogRevalidateAuthorized("secret", "wrong")).toBe(false);
    expect(isBlogRevalidateAuthorized(undefined, "secret")).toBe(false);
  });
});
