export async function concurrentRequests<T>(
  requests: Promise<T>[],
  maxConcurrent: number
) {
  let results: Promise<T>[] = [];
  let executing: Promise<T>[] = [];

  for (const request of requests) {
    const p = request.then((result) => {
      executing = executing.filter((e) => e !== p);
      return result;
    });
    results.push(p);
    executing.push(p);

    if (executing.length >= maxConcurrent) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

export function sortItems<T extends { order: number; children?: any[] }>(
  items: T[]
): T[] {
  return items
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      children: item.children ? sortItems(item.children) : [],
    }));
}
