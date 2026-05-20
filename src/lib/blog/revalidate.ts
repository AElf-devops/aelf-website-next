const BASE_REVALIDATE_PATHS = ["/", "/blog", "/latest-posts"];

interface IRevalidatePostInput {
  slug?: string;
  categories?: string[];
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
  categories = [],
}: IRevalidatePostInput): string[] {
  const paths = [...BASE_REVALIDATE_PATHS];

  if (slug) {
    paths.push(`/posts/${slug}`);
  }

  categories.forEach((category) => {
    if (category) {
      paths.push(`/category/${category}`);
    }
  });

  return Array.from(new Set(paths));
}
