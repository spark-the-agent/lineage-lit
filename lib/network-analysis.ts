import { Creator } from './data';

export interface NetworkMetrics {
  totalNodes: number;
  totalEdges: number;
  density: number;
  averageDegree: number;
  mostInfluential: CreatorScore[];
  mostCentral: CreatorScore[];
  clusteringCoefficients: ClusterScore[];
  connectedComponents: Creator[][];
  pathLengths: PathLength[];
  bridges: Bridge[];
}

export interface CreatorScore {
  creator: Creator;
  score: number;
}

export interface ClusterScore {
  creator: Creator;
  coefficient: number;
}

export interface PathLength {
  from: Creator;
  to: Creator;
  path: Creator[];
  length: number;
}

export interface Bridge {
  creator: Creator;
  betweennessCentrality: number;
}

export function analyzeNetwork(creators: Creator[]): NetworkMetrics {
  const graph = buildGraph(creators);
  
  return {
    totalNodes: creators.length,
    totalEdges: countEdges(creators),
    density: calculateDensity(creators),
    averageDegree: calculateAverageDegree(creators),
    mostInfluential: calculateInfluenceScores(creators),
    mostCentral: calculateCentralityScores(creators, graph),
    clusteringCoefficients: calculateClusteringCoefficients(creators, graph),
    connectedComponents: findConnectedComponents(creators, graph),
    pathLengths: calculatePathLengths(creators, graph),
    bridges: findBridges(creators, graph)
  };
}

interface Graph {
  [key: string]: Set<string>;
}

function buildGraph(creators: Creator[]): Graph {
  const graph: Graph = {};
  
  creators.forEach(c => {
    graph[c.id] = new Set();
    c.influencedBy.forEach(id => graph[c.id].add(id));
    c.influenced.forEach(id => graph[c.id].add(id));
  });
  
  return graph;
}

function countEdges(creators: Creator[]): number {
  return creators.reduce((acc, c) => acc + c.influencedBy.length, 0);
}

function calculateDensity(creators: Creator[]): number {
  const n = creators.length;
  if (n <= 1) return 0;
  const maxEdges = n * (n - 1);
  const actualEdges = countEdges(creators);
  return actualEdges / maxEdges;
}

function calculateAverageDegree(creators: Creator[]): number {
  const totalDegree = creators.reduce(
    (acc, c) => acc + c.influencedBy.length + c.influenced.length, 
    0
  );
  return totalDegree / creators.length;
}

function calculateInfluenceScores(creators: Creator[]): CreatorScore[] {
  // Combine direct influence and influence chain
  const scores = creators.map(creator => {
    const directInfluence = creator.influenced.length;
    const indirectInfluence = countIndirectInfluence(creator, creators);
    const score = directInfluence + indirectInfluence * 0.5;
    
    return { creator, score };
  });
  
  return scores.sort((a, b) => b.score - a.score);
}

function countIndirectInfluence(creator: Creator, allCreators: Creator[]): number {
  let count = 0;
  const visited = new Set<string>();
  const queue = [...creator.influenced];
  
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    count++;
    
    const person = allCreators.find(c => c.id === id);
    if (person) {
      queue.push(...person.influenced);
    }
  }
  
  return count;
}

function calculateCentralityScores(creators: Creator[], graph: Graph): CreatorScore[] {
  // Degree centrality (normalized)
  const scores = creators.map(creator => {
    const connections = (graph[creator.id]?.size || 0);
    const maxPossible = creators.length - 1;
    const score = connections / maxPossible;
    return { creator, score };
  });
  
  return scores.sort((a, b) => b.score - a.score);
}

function calculateClusteringCoefficients(creators: Creator[], graph: Graph): ClusterScore[] {
  const scores = creators.map(creator => {
    const neighbors = Array.from(graph[creator.id] || []);
    if (neighbors.length < 2) return { creator, coefficient: 0 };
    
    let connections = 0;
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (graph[neighbors[i]]?.has(neighbors[j])) {
          connections++;
        }
      }
    }
    
    const possible = (neighbors.length * (neighbors.length - 1)) / 2;
    const coefficient = possible > 0 ? connections / possible : 0;
    
    return { creator, coefficient };
  });
  
  return scores.sort((a, b) => b.coefficient - a.coefficient);
}

function findConnectedComponents(creators: Creator[], graph: Graph): Creator[][] {
  const visited = new Set<string>();
  const components: Creator[][] = [];
  
  creators.forEach(creator => {
    if (visited.has(creator.id)) return;
    
    const component: Creator[] = [];
    const queue = [creator.id];
    
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      
      const person = creators.find(c => c.id === id);
      if (person) component.push(person);
      
      graph[id]?.forEach(neighbor => {
        if (!visited.has(neighbor)) queue.push(neighbor);
      });
    }
    
    components.push(component);
  });
  
  return components.sort((a, b) => b.length - a.length);
}

function calculatePathLengths(creators: Creator[], graph: Graph): PathLength[] {
  const paths: PathLength[] = [];
  
  // Find influence chains (longest paths)
  creators.forEach(from => {
    const chain = findLongestChain(from, creators, graph);
    if (chain.length > 2) {
      paths.push({
        from,
        to: chain[chain.length - 1],
        path: chain,
        length: chain.length - 1
      });
    }
  });
  
  return paths
    .filter((p, i, arr) => 
      // Keep only unique, non-subset paths
      !arr.some((other, j) => 
        j !== i && 
        other.path.every(node => p.path.includes(node)) &&
        other.path.length > p.path.length
      )
    )
    .sort((a, b) => b.length - a.length);
}

function findLongestChain(start: Creator, allCreators: Creator[], graph: Graph): Creator[] {
  let longest: Creator[] = [start];
  
  function dfs(current: Creator, path: Creator[]) {
    const influenced = current.influenced
      .map(id => allCreators.find(c => c.id === id))
      .filter((c): c is Creator => c !== undefined);
    
    if (influenced.length === 0) {
      if (path.length > longest.length) {
        longest = [...path];
      }
      return;
    }
    
    for (const next of influenced) {
      if (!path.includes(next)) {
        dfs(next, [...path, next]);
      }
    }
  }
  
  dfs(start, [start]);
  return longest;
}

function findBridges(creators: Creator[], graph: Graph): Bridge[] {
  // Find nodes that connect otherwise separate communities
  const betweennessScores = creators.map(creator => {
    const score = calculateBetweennessCentrality(creator, creators, graph);
    return { creator, betweennessCentrality: score };
  });
  
  return betweennessScores
    .filter(b => b.betweennessCentrality > 0)
    .sort((a, b) => b.betweennessCentrality - a.betweennessCentrality);
}

function calculateBetweennessCentrality(creator: Creator, allCreators: Creator[], graph: Graph): number {
  let shortestPathsThrough = 0;
  let totalShortestPaths = 0;
  
  allCreators.forEach(source => {
    allCreators.forEach(target => {
      if (source.id === target.id || source.id === creator.id || target.id === creator.id) return;
      
      const paths = findAllShortestPaths(source.id, target.id, graph);
      if (paths.length === 0) return;
      
      totalShortestPaths += paths.length;
      shortestPathsThrough += paths.filter(p => p.includes(creator.id)).length;
    });
  });
  
  return totalShortestPaths > 0 ? shortestPathsThrough / totalShortestPaths : 0;
}

function findAllShortestPaths(start: string, end: string, graph: Graph): string[][] {
  const queue: { node: string; path: string[] }[] = [{ node: start, path: [start] }];
  const paths: string[][] = [];
  let shortestLength = Infinity;
  
  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    
    if (path.length > shortestLength) continue;
    
    if (node === end) {
      if (path.length < shortestLength) {
        shortestLength = path.length;
        paths.length = 0;
      }
      if (path.length === shortestLength) {
        paths.push(path);
      }
      continue;
    }
    
    graph[node]?.forEach(neighbor => {
      if (!path.includes(neighbor)) {
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    });
  }
  
  return paths;
}

// Additional analysis functions
export function getMovementClusters(creators: Creator[]): { name: string; members: Creator[]; era: string }[] {
  const components = findConnectedComponents(creators, buildGraph(creators));
  
  return components.map(comp => {
    const years = comp.map(c => parseInt(c.years.split('-')[0]));
    const avgYear = years.reduce((a, b) => a + b, 0) / years.length;
    
    let era = 'Unknown';
    if (avgYear < 1900) era = 'Pre-Modern';
    else if (avgYear < 1920) era = 'Modernist';
    else if (avgYear < 1960) era = 'Mid-Century';
    else if (avgYear < 1990) era = 'Late 20th Century';
    else era = 'Contemporary';
    
    // Determine movement name based on connections
    const names = comp.map(c => c.name.split(' ').pop());
    
    return {
      name: names.slice(0, 2).join('-') + ' School',
      members: comp,
      era
    };
  });
}

export function getKeyWorks(creators: Creator[]): { work: string; creator: string; influenceScore: number }[] {
  const workScores: { [key: string]: { creator: string; score: number } } = {};
  
  creators.forEach(c => {
    const influenceScore = c.influenced.length + c.influencedBy.length;
    c.works.forEach(w => {
      workScores[w.id] = {
        creator: c.name,
        score: influenceScore
      };
    });
  });
  
  return Object.entries(workScores)
    .map(([id, data]) => ({
      work: id,
      creator: data.creator,
      influenceScore: data.score
    }))
    .sort((a, b) => b.influenceScore - a.influenceScore);
}

export function getInfluencePath(fromId: string, toId: string, creators: Creator[]): Creator[] | null {
  const graph = buildGraph(creators);
  const creatorMap = new Map(creators.map(c => [c.id, c]));
  
  const queue: { id: string; path: string[] }[] = [{ id: fromId, path: [fromId] }];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    
    if (id === toId) {
      return path.map(pid => creatorMap.get(pid)).filter((c): c is Creator => c !== undefined);
    }
    
    if (visited.has(id)) continue;
    visited.add(id);
    
    // Follow influence direction (who they influenced)
    const creator = creatorMap.get(id);
    if (creator) {
      creator.influenced.forEach(nextId => {
        if (!visited.has(nextId)) {
          queue.push({ id: nextId, path: [...path, nextId] });
        }
      });
    }
  }
  
  return null;
}
