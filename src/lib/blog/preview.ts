export function isBlogPreviewAuthorized(
  expectedSecret?: string,
  receivedSecret?: string | string[]
): boolean {
  const secret = Array.isArray(receivedSecret)
    ? receivedSecret[0]
    : receivedSecret;

  return Boolean(expectedSecret && secret && expectedSecret === secret);
}

export function getBlogPreviewPath(identifier: string): string {
  return `/posts/preview/${encodeURIComponent(identifier)}`;
}
