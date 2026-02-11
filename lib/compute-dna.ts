import { getCreatorById, Creator } from './data';
import type { ReadingDNA } from './social';
import type { PersistedState } from './persistence';

/**
 * Computes a dynamic ReadingDNA from the user's actual persistence data
 * (saved creators, viewed creators, liked works).
 */
export function computeDNAFromState(state: PersistedState): ReadingDNA {
  const savedCreators = state.savedCreators
    .map(id => getCreatorById(id))
    .filter((c): c is Creator => !!c);

  const viewedCreators = state.viewedCreators
    .map(v => getCreatorById(v.id))
    .filter((c): c is Creator => !!c);

  // Combine saved + viewed (deduplicated), saved weighted higher
  const allCreators = new Map<string, Creator>();
  for (const c of viewedCreators) allCreators.set(c.id, c);
  for (const c of savedCreators) allCreators.set(c.id, c);
  const uniqueCreators = Array.from(allCreators.values());

  // Count work types for genre breakdown
  const genreCounts: Record<string, number> = {};
  let totalWorks = 0;
  for (const creator of uniqueCreators) {
    for (const work of creator.works) {
      const genre = workTypeToGenre(work.type);
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      totalWorks++;
    }
  }

  const favoriteGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      percentage: totalWorks > 0 ? Math.round((count / totalWorks) * 100) : 0,
    }));

  // Era breakdown from creator years
  const eraCounts: Record<string, number> = {
    'Pre-1900': 0,
    '1900-1950': 0,
    '1950-2000': 0,
    '2000+': 0,
  };
  for (const creator of uniqueCreators) {
    const birthYear = parseBirthYear(creator.years);
    if (birthYear < 1870) eraCounts['Pre-1900']++;
    else if (birthYear < 1920) eraCounts['1900-1950']++;
    else if (birthYear < 1970) eraCounts['1950-2000']++;
    else eraCounts['2000+']++;
  }

  const eraBreakdown = Object.entries(eraCounts)
    .filter(([, count]) => count > 0)
    .map(([era, count]) => ({ era, count }));

  // Influence score: how connected are your saved creators?
  const connectionCount = uniqueCreators.reduce(
    (acc, c) => acc + c.influencedBy.length + c.influenced.length,
    0
  );
  const maxConnections = uniqueCreators.length * 6; // rough max
  const influenceScore = maxConnections > 0
    ? Math.min(99, Math.round((connectionCount / maxConnections) * 100))
    : 0;

  // Literary DNA tags based on the creators
  const literaryDNA = computeLiteraryTags(uniqueCreators);

  // Top authors = saved creators (most intentional signal)
  const topAuthors = state.savedCreators.slice(0, 4);

  // Recently viewed
  const recentlyViewed = state.viewedCreators
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4)
    .map(v => v.id);

  return {
    totalBooks: Math.max(totalWorks, state.likedWorks.length),
    totalAuthors: uniqueCreators.length,
    favoriteGenres,
    eraBreakdown,
    influenceScore,
    literaryDNA,
    topAuthors,
    recentlyViewed,
  };
}

function workTypeToGenre(type: string): string {
  switch (type) {
    case 'book': return 'Literary Fiction';
    case 'screenplay': return 'Screenwriting';
    case 'article': return 'Essays & Articles';
    default: return 'Other';
  }
}

function parseBirthYear(years: string): number {
  const match = years.match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : 1950;
}

function computeLiteraryTags(creators: Creator[]): string[] {
  const tags: Record<string, number> = {};

  for (const c of creators) {
    // Infer tags from bio keywords and influence networks
    const bio = c.bio.toLowerCase();
    if (bio.includes('minimalis') || bio.includes('spare') || bio.includes('iceberg')) {
      tags['Minimalist'] = (tags['Minimalist'] || 0) + 2;
    }
    if (bio.includes('science fiction') || bio.includes('speculative') || bio.includes('dystop')) {
      tags['Speculative'] = (tags['Speculative'] || 0) + 2;
    }
    if (bio.includes('modernist') || bio.includes('modernism') || bio.includes('stream of consciousness')) {
      tags['Modernist'] = (tags['Modernist'] || 0) + 2;
    }
    if (bio.includes('magic realism') || bio.includes('magical realist') || bio.includes('surreal')) {
      tags['Magical Realist'] = (tags['Magical Realist'] || 0) + 2;
    }
    if (bio.includes('postmodern') || bio.includes('maximalist') || bio.includes('metafiction')) {
      tags['Postmodernist'] = (tags['Postmodernist'] || 0) + 2;
    }
    if (bio.includes('screenplay') || bio.includes('screenwriter') || bio.includes('dialogue')) {
      tags['Cinephile'] = (tags['Cinephile'] || 0) + 2;
    }
    if (bio.includes('humanist') || bio.includes('empathy') || bio.includes('compassion')) {
      tags['Humanist'] = (tags['Humanist'] || 0) + 2;
    }
    if (bio.includes('southern') || bio.includes('gothic')) {
      tags['Southern Gothic'] = (tags['Southern Gothic'] || 0) + 2;
    }
    if (bio.includes('afrofutur') || bio.includes('african') || bio.includes('postcolonial')) {
      tags['Global Voice'] = (tags['Global Voice'] || 0) + 2;
    }
    // General: every explored creator adds a small "Curious" signal
    tags['Curious Reader'] = (tags['Curious Reader'] || 0) + 1;
  }

  return Object.entries(tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([tag]) => tag);
}
