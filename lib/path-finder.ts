import { Creator, creators, getCreatorById } from "./data";

interface PathResult {
  path: Creator[];
  length: number;
}

/**
 * Bidirectional BFS that follows influence connections in both directions.
 * Unlike getInfluencePath which only follows "influenced" direction,
 * this treats all influence links as bidirectional for discovery purposes.
 */
export function findPath(fromId: string, toId: string): PathResult | null {
  if (fromId === toId) {
    const c = getCreatorById(fromId);
    return c ? { path: [c], length: 0 } : null;
  }

  // Build undirected adjacency
  const adj = new Map<string, Set<string>>();
  creators.forEach((c) => {
    if (!adj.has(c.id)) adj.set(c.id, new Set());
    c.influencedBy.forEach((id) => {
      adj.get(c.id)!.add(id);
      if (!adj.has(id)) adj.set(id, new Set());
      adj.get(id)!.add(c.id);
    });
    c.influenced.forEach((id) => {
      adj.get(c.id)!.add(id);
      if (!adj.has(id)) adj.set(id, new Set());
      adj.get(id)!.add(c.id);
    });
  });

  // BFS from source
  const visited = new Map<string, string | null>(); // node -> parent
  visited.set(fromId, null);
  const queue: string[] = [fromId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === toId) break;

    const neighbors = adj.get(current);
    if (!neighbors) continue;

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  if (!visited.has(toId)) return null;

  // Reconstruct path
  const pathIds: string[] = [];
  let current: string | null = toId;
  while (current !== null) {
    pathIds.unshift(current);
    current = visited.get(current) ?? null;
  }

  const path = pathIds
    .map((id) => getCreatorById(id))
    .filter((c): c is Creator => c !== undefined);

  return { path, length: path.length - 1 };
}

export function getAllPaths(): { from: string; to: string; length: number }[] {
  const results: { from: string; to: string; length: number }[] = [];
  for (let i = 0; i < creators.length; i++) {
    for (let j = i + 1; j < creators.length; j++) {
      const result = findPath(creators[i].id, creators[j].id);
      if (result) {
        results.push({
          from: creators[i].id,
          to: creators[j].id,
          length: result.length,
        });
      }
    }
  }
  return results;
}
