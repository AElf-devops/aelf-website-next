const BASE_REVALIDATE_PATHS = ["/", "/blog", "/latest-posts"];

interface IRevalidatePostInput {
  slug?: string;
  previousSlug?: string;
  categories?: string[];
  previousCategories?: string[];
}

export function isBlogRevalidateAuthorized(
  expectedSecret?: string,
  receivedSecret?: string | string[]
): boolean {
  const secret = Array.isArray(receivedSecret)
    ? receivedSecret[0]
    : receivedSecret;

  return Boolean(expectedSecret && secret && expectedSecret === secret);
}

export function getBlogRevalidatePaths({
  slug,
  previousSlug,
  categories = [],
  previousCategories = [],
}: IRevalidatePostInput): string[] {
  const paths = [...BASE_REVALIDATE_PATHS];

  [slug, previousSlug].forEach((postSlug) => {
    if (postSlug) {
      paths.push(`/posts/${postSlug}`);
    }
  });

  [...categories, ...previousCategories].forEach((category) => {
    if (category) {
      paths.push(`/category/${category}`);
    }
  });

  return Array.from(new Set(paths));
}
