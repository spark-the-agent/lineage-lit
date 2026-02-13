import { creators, Creator } from "./data";
import { analyzeNetwork } from "./network-analysis";

export interface DailyLineage {
  date: string;
  chain: Creator[];
  narrative: string;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDateSeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function getDailyLineage(): DailyLineage {
  const metrics = analyzeNetwork(creators);
  const paths = metrics.pathLengths.filter((p) => p.length >= 2);
  const seed = getDateSeed();

  // If we have interesting paths, pick one deterministically
  if (paths.length > 0) {
    const idx = Math.floor(seededRandom(seed) * paths.length);
    const selected = paths[idx];
    return {
      date: new Date().toISOString().split("T")[0],
      chain: selected.path,
      narrative: buildNarrative(selected.path),
    };
  }

  // Fallback: pick a random influence pair
  const pairs: Creator[][] = [];
  creators.forEach((c) => {
    c.influenced.forEach((slug) => {
      const target = creators.find((t) => t.slug === slug);
      if (target) pairs.push([c, target]);
    });
  });

  const idx = Math.floor(seededRandom(seed) * pairs.length);
  const pair = pairs[idx] || [creators[0], creators[1]];
  return {
    date: new Date().toISOString().split("T")[0],
    chain: pair,
    narrative: buildNarrative(pair),
  };
}

function buildNarrative(chain: Creator[]): string {
  if (chain.length === 2) {
    const eraSpan = getEraSpan(chain[0], chain[chain.length - 1]);
    return `${chain[0].name} influenced ${chain[1].name}'s work${eraSpan}.`;
  }

  const middle = chain
    .slice(1, -1)
    .map((c) => c.name)
    .join(", then ");
  const eraSpan = getEraSpan(chain[0], chain[chain.length - 1]);
  return `${chain[0].name} influenced ${middle}, who in turn shaped ${chain[chain.length - 1].name}'s writing${eraSpan}.`;
}

function getEraSpan(from: Creator, to: Creator): string {
  const fromYear = parseInt(from.years.split("-")[0]);
  const toStart = to.years.startsWith("b.")
    ? parseInt(to.years.slice(3))
    : parseInt(to.years.split("-")[0]);
  const span = toStart - fromYear;
  if (span > 0) {
    return `, spanning ${span} years of literary tradition`;
  }
  return "";
}
