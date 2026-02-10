import { ReadingDNA } from './social';

export interface DNAComparisonResult {
  overallSimilarity: number; // 0-100
  sharedTraits: string[];
  uniqueA: string[];
  uniqueB: string[];
  genreOverlap: { name: string; percentA: number; percentB: number }[];
  eraComparison: { era: string; countA: number; countB: number }[];
  sharedAuthors: string[];
}

export function compareDNA(a: ReadingDNA, b: ReadingDNA): DNAComparisonResult {
  // Literary DNA overlap
  const sharedTraits = a.literaryDNA.filter(t => b.literaryDNA.includes(t));
  const uniqueA = a.literaryDNA.filter(t => !b.literaryDNA.includes(t));
  const uniqueB = b.literaryDNA.filter(t => !a.literaryDNA.includes(t));
  const traitSimilarity = sharedTraits.length / Math.max(
    new Set([...a.literaryDNA, ...b.literaryDNA]).size, 1
  );

  // Genre overlap
  const allGenres = new Set([
    ...a.favoriteGenres.map(g => g.name),
    ...b.favoriteGenres.map(g => g.name),
  ]);
  const genreOverlap = Array.from(allGenres).map(name => ({
    name,
    percentA: a.favoriteGenres.find(g => g.name === name)?.percentage || 0,
    percentB: b.favoriteGenres.find(g => g.name === name)?.percentage || 0,
  }));

  // Genre similarity (cosine-like)
  let genreDotProduct = 0;
  let genreMagA = 0;
  let genreMagB = 0;
  genreOverlap.forEach(g => {
    genreDotProduct += g.percentA * g.percentB;
    genreMagA += g.percentA * g.percentA;
    genreMagB += g.percentB * g.percentB;
  });
  const genreSimilarity = (genreMagA > 0 && genreMagB > 0)
    ? genreDotProduct / (Math.sqrt(genreMagA) * Math.sqrt(genreMagB))
    : 0;

  // Era comparison
  const allEras = new Set([
    ...a.eraBreakdown.map(e => e.era),
    ...b.eraBreakdown.map(e => e.era),
  ]);
  const eraComparison = Array.from(allEras).map(era => ({
    era,
    countA: a.eraBreakdown.find(e => e.era === era)?.count || 0,
    countB: b.eraBreakdown.find(e => e.era === era)?.count || 0,
  }));

  // Shared authors
  const sharedAuthors = a.topAuthors.filter(id => b.topAuthors.includes(id));
  const authorSimilarity = sharedAuthors.length / Math.max(
    new Set([...a.topAuthors, ...b.topAuthors]).size, 1
  );

  // Overall similarity (weighted)
  const overallSimilarity = Math.round(
    (traitSimilarity * 40 + genreSimilarity * 35 + authorSimilarity * 25) * 100
  );

  return {
    overallSimilarity: Math.min(overallSimilarity, 100),
    sharedTraits,
    uniqueA,
    uniqueB,
    genreOverlap,
    eraComparison,
    sharedAuthors,
  };
}
