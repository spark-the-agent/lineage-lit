import { Creator, creators, getCreatorBySlug } from "./data";

interface PathResult {
  path: Creator[];
  length: number;
}

/**
 * Bidirectional BFS that follows influence connections in both directions.
 * Unlike getInfluencePath which only follows "influenced" direction,
 * this treats all influence links as bidirectional for discovery purposes.
 */
export function findPath(fromSlug: string, toSlug: string): PathResult | null {
  if (fromSlug === toSlug) {
    const c = getCreatorBySlug(fromSlug);
    return c ? { path: [c], length: 0 } : null;
  }

  // Build undirected adjacency
  const adj = new Map<string, Set<string>>();
  creators.forEach((c) => {
    if (!adj.has(c.slug)) adj.set(c.slug, new Set());
    c.influencedBy.forEach((slug) => {
      adj.get(c.slug)!.add(slug);
      if (!adj.has(slug)) adj.set(slug, new Set());
      adj.get(slug)!.add(c.slug);
    });
    c.influenced.forEach((slug) => {
      adj.get(c.slug)!.add(slug);
      if (!adj.has(slug)) adj.set(slug, new Set());
      adj.get(slug)!.add(c.slug);
    });
  });

  // BFS from source
  const visited = new Map<string, string | null>(); // node -> parent
  visited.set(fromSlug, null);
  const queue: string[] = [fromSlug];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === toSlug) break;

    const neighbors = adj.get(current);
    if (!neighbors) continue;

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  if (!visited.has(toSlug)) return null;

  // Reconstruct path
  const pathSlugs: string[] = [];
  let current: string | null = toSlug;
  while (current !== null) {
    pathSlugs.unshift(current);
    current = visited.get(current) ?? null;
  }

  const path = pathSlugs
    .map((slug) => getCreatorBySlug(slug))
    .filter((c): c is Creator => c !== undefined);

  return { path, length: path.length - 1 };
}

export function getAllPaths(): { from: string; to: string; length: number }[] {
  const results: { from: string; to: string; length: number }[] = [];
  for (let i = 0; i < creators.length; i++) {
    for (let j = i + 1; j < creators.length; j++) {
      const result = findPath(creators[i].slug, creators[j].slug);
      if (result) {
        results.push({
          from: creators[i].slug,
          to: creators[j].slug,
          length: result.length,
        });
      }
    }
  }
  return results;
}
