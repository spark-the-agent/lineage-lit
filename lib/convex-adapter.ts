import type { Creator, Work } from './data';

// Adapts Convex document shapes to frontend Creator/Work types.
// The frontend uses flat slug-based IDs; Convex uses _id + slug.

interface ConvexCreator {
  _id: string;
  slug: string;
  name: string;
  bio: string;
  birthYear?: number;
  deathYear?: number;
  influencedBy: string[];
  influenced: string[];
}

interface ConvexWork {
  _id: string;
  slug: string;
  title: string;
  year?: number;
  type: 'book' | 'article' | 'screenplay' | 'essay' | 'poem';
  description: string;
  creatorId: string;
}

export function adaptCreator(
  doc: ConvexCreator,
  works: ConvexWork[] = []
): Creator {
  const yearStr = doc.deathYear
    ? `${doc.birthYear}-${doc.deathYear}`
    : doc.birthYear
      ? `b. ${doc.birthYear}`
      : '';

  return {
    id: doc.slug,
    name: doc.name,
    years: yearStr,
    bio: doc.bio,
    influencedBy: doc.influencedBy,
    influenced: doc.influenced,
    works: works
      .filter((w): w is ConvexWork & { type: 'book' | 'screenplay' | 'article' } =>
        w.type === 'book' || w.type === 'screenplay' || w.type === 'article'
      )
      .map(adaptWork),
  };
}

export function adaptWork(doc: ConvexWork & { type: 'book' | 'screenplay' | 'article' }): Work {
  return {
    id: doc.slug,
    title: doc.title,
    year: doc.year || 0,
    type: doc.type,
    description: doc.description,
  };
}
