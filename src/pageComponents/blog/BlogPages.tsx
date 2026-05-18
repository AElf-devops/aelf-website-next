/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import clsx from "clsx";
import CommonLink from "@/components/CommonLink";
import { formatDate } from "@/utils";
import { getBlogContentFormat, renderBlogContent } from "@/lib/blog/content";
import { IBlogPost, IBlogTaxonomy } from "@/types/blog";
import styles from "./styles.module.scss";

const HOME_LATEST_POST_COUNT = 12;
const CATEGORY_ORDER = [
  "Insights",
  "Technology",
  "Community",
  "Ecosystem",
  "Brand",
];
const BLOG_DATE_MONTH_FORMAT = "long";

interface IBlogListPageProps {
  title: string;
  description?: string;
  posts: IBlogPost[];
  compactHeader?: boolean;
}

interface IBlogHomePageProps {
  posts: IBlogPost[];
}

interface IBlogLatestPostsPageProps {
  posts: IBlogPost[];
}

interface IBlogPostPageProps {
  post: IBlogPost;
  latestPosts: IBlogPost[];
}

function BlogImage({
  className,
  src,
  alt,
  eager = false,
}: {
  className?: string;
  src?: string;
  alt?: string;
  eager?: boolean;
}) {
  if (!src) {
    return <div className={clsx(styles.imageFallback, className)} />;
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt || ""}
      loading={eager ? "eager" : "lazy"}
    />
  );
}

function getPostThumbnail(post: IBlogPost) {
  return post.articleThumbnail || post.coverImage || post.articleHeaderImage;
}

function getPostHeaderImage(post: IBlogPost) {
  return post.articleHeaderImage || post.coverImage || post.articleThumbnail;
}

function TaxonomyLinks({ items }: { items: IBlogTaxonomy[] }) {
  if (items.length === 0) return null;

  return (
    <div className={styles.taxonomyList}>
      {items.map((item) => (
        <CommonLink
          className={styles.taxonomyItem}
          key={item.slug}
          href={`/category/${item.slug}`}
        >
          {item.name}
        </CommonLink>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <div className={styles.sectionTitle}>{children}</div>;
}

function BlogPostCard({
  post,
  headingLevel = 3,
  showTaxonomy = true,
}: {
  post: IBlogPost;
  headingLevel?: 2 | 3;
  showTaxonomy?: boolean;
}) {
  const Heading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const thumbnail = getPostThumbnail(post);

  return (
    <article className={styles.postCard}>
      <CommonLink className={styles.postImageLink} href={`/posts/${post.slug}`}>
        <BlogImage
          className={styles.cardImage}
          src={thumbnail?.url}
          alt={thumbnail?.alt || post.title}
        />
      </CommonLink>
      <div className={styles.cardBody}>
        <div className={styles.postDate}>
          {formatDate(post.publishedAt, "MDY", BLOG_DATE_MONTH_FORMAT)}
        </div>
        <CommonLink className={styles.postTitleLink} href={`/posts/${post.slug}`}>
          <Heading className={styles.cardTitle}>{post.title}</Heading>
        </CommonLink>
        {showTaxonomy && <TaxonomyLinks items={post.categories} />}
      </div>
    </article>
  );
}

function PostGrid({
  posts,
  columns = "three",
  showTaxonomy = true,
}: {
  posts: IBlogPost[];
  columns?: "two" | "three";
  showTaxonomy?: boolean;
}) {
  if (posts.length === 0) {
    return <div className={styles.emptyState}>Blog content is being prepared.</div>;
  }

  return (
    <div
      className={clsx(styles.postGrid, {
        [styles.postGridTwo]: columns === "two",
      })}
    >
      {posts.map((post) => (
        <BlogPostCard post={post} key={post.id} showTaxonomy={showTaxonomy} />
      ))}
    </div>
  );
}

export function BlogHomePage({ posts }: IBlogHomePageProps) {
  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const topPosts = posts
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 3);
  const latestPosts = posts.slice(0, HOME_LATEST_POST_COUNT);
  const featuredImage = featuredPost ? getPostThumbnail(featuredPost) : undefined;

  return (
    <main className={styles.blogPage}>
      {featuredPost ? (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <SectionTitle>featured POSTS</SectionTitle>
            <article className={styles.featuredPost}>
              <CommonLink
                className={styles.featuredImageLink}
                href={`/posts/${featuredPost.slug}`}
              >
                <BlogImage
                  className={styles.featuredImage}
                  src={featuredImage?.url}
                  alt={featuredImage?.alt || featuredPost.title}
                  eager
                />
              </CommonLink>
              <div className={styles.featuredText}>
                <div className={styles.postDate}>
                  {formatDate(
                    featuredPost.publishedAt,
                    "MDY",
                    BLOG_DATE_MONTH_FORMAT
                  )}
                </div>
                <CommonLink
                  className={styles.postTitleLink}
                  href={`/posts/${featuredPost.slug}`}
                >
                  <h1>{featuredPost.title}</h1>
                </CommonLink>
                {featuredPost.excerpt && (
                  <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                )}
                <TaxonomyLinks items={featuredPost.categories} />
              </div>
            </article>
          </div>
        </section>
      ) : (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.emptyState}>Blog content is being prepared.</div>
          </div>
        </section>
      )}

      {topPosts.length > 0 && (
        <section className={styles.threePostsSection}>
          <div className={styles.container}>
            <PostGrid posts={topPosts} showTaxonomy={false} />
          </div>
        </section>
      )}

      <section className={styles.latestSection}>
        <div className={styles.container}>
          <SectionTitle>LATEST POSTS</SectionTitle>
          <PostGrid posts={latestPosts} showTaxonomy={false} />
          <CommonLink className={styles.viewAllButton} href="/latest-posts">
            view all latest posts
          </CommonLink>
        </div>
      </section>
    </main>
  );
}

function getCategoryOptions(posts: IBlogPost[]): string[] {
  const names = new Set<string>();
  posts.forEach((post) => {
    post.categories.forEach((category) => names.add(category.name));
  });

  const knownCategories = CATEGORY_ORDER.filter((category) =>
    names.has(category)
  );
  const extraCategories = Array.from(names)
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort((a, b) => a.localeCompare(b));

  return [...knownCategories, ...extraCategories];
}

function getSortedPosts(posts: IBlogPost[], order: "desc" | "asc") {
  return [...posts].sort((left, right) => {
    const leftTime = new Date(left.publishedAt).getTime();
    const rightTime = new Date(right.publishedAt).getTime();
    const dateDiff = rightTime - leftTime;

    if (dateDiff !== 0) {
      return order === "desc" ? dateDiff : -dateDiff;
    }

    const legacyDiff = (right.legacySourceId || "").localeCompare(
      left.legacySourceId || ""
    );

    if (legacyDiff !== 0) {
      return order === "desc" ? legacyDiff : -legacyDiff;
    }

    const updatedDiff =
      new Date(right.updatedAt || "").getTime() -
      new Date(left.updatedAt || "").getTime();

    if (Number.isFinite(updatedDiff) && updatedDiff !== 0) {
      return order === "desc" ? updatedDiff : -updatedDiff;
    }

    return order === "desc"
      ? right.slug.localeCompare(left.slug)
      : left.slug.localeCompare(right.slug);
  });
}

export function BlogLatestPostsPage({ posts }: IBlogLatestPostsPageProps) {
  const [allPosts, setAllPosts] = useState(posts);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [category, setCategory] = useState("");
  const categoryOptions = useMemo(() => getCategoryOptions(allPosts), [allPosts]);
  const filteredPosts = useMemo(() => {
    const byCategory = category
      ? allPosts.filter((post) =>
          post.categories.some((item) => item.name === category)
        )
      : allPosts;

    return getSortedPosts(byCategory, sortOrder);
  }, [allPosts, category, sortOrder]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/blog/latest-posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Latest posts request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (isMounted && Array.isArray(payload.posts)) {
          setAllPosts(payload.posts);
        }
      })
      .catch((error) => {
        console.error("Failed to load all blog posts", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value === "asc" ? "asc" : "desc");
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  return (
    <main className={styles.blogPage}>
      <section className={clsx(styles.titleSection, styles.latestTitleSection)}>
        <div className={styles.container}>
          <h1>Latest Posts</h1>
          <div className={styles.postViewActions}>
            <label className={styles.selectLabel}>
              <span>Sort by:</span>
              <select
                className={styles.select}
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="desc">Published: newest first</option>
                <option value="asc">Published: oldest first</option>
              </select>
            </label>
            <label className={styles.selectLabel}>
              <span>Category:</span>
              <select
                className={styles.select}
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category...</option>
                {categoryOptions.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>
      <section className={styles.latestPostsArchive}>
        <div className={styles.container}>
          <PostGrid posts={filteredPosts} />
        </div>
      </section>
    </main>
  );
}

export function BlogListPage({
  title,
  description,
  posts,
  compactHeader = false,
}: IBlogListPageProps) {
  return (
    <main className={styles.blogPage}>
      <section
        className={clsx(styles.titleSection, {
          [styles.compactTitleSection]: compactHeader,
        })}
      >
        <div className={styles.container}>
          <h1>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </section>
      <section className={styles.latestPostsArchive}>
        <div className={styles.container}>
          <PostGrid posts={posts} />
        </div>
      </section>
    </main>
  );
}

export function BlogPostPage({ post, latestPosts }: IBlogPostPageProps) {
  const headerImage = getPostHeaderImage(post);
  const contentFormat = getBlogContentFormat(post.content);

  return (
    <main className={styles.postPage}>
      <article>
        <header className={styles.articleHeader}>
          <div className={styles.container}>
            <div className={styles.articleTitleWrap}>
              <div className={styles.postDate}>
                {formatDate(post.publishedAt, "MDY", BLOG_DATE_MONTH_FORMAT)}
              </div>
              <h1>{post.title}</h1>
              <TaxonomyLinks items={post.categories} />
            </div>
          </div>
        </header>

        <section className={styles.articleImageSection}>
          <div className={styles.postImageContainer}>
            <BlogImage
              className={styles.heroImage}
              src={headerImage?.url}
              alt={post.headerImageAlt || headerImage?.alt || post.title}
              eager
            />
          </div>
        </section>

        <section className={styles.articleContentSection}>
          <div
            className={clsx(styles.articleContent, {
              [styles.markdownArticleContent]: contentFormat !== "html",
            })}
          >
            {renderBlogContent(post.content)}
          </div>
          <CommonLink className={styles.backButton} href="/blog">
            <LeftOutlined className={styles.backButtonIcon} />
            Back to Blog
          </CommonLink>
        </section>
      </article>

      <div className={styles.separator} />

      <section className={styles.latestSection}>
        <div className={styles.container}>
          <SectionTitle>Latest POSTS</SectionTitle>
          <PostGrid posts={latestPosts} columns="two" />
        </div>
      </section>
    </main>
  );
}
