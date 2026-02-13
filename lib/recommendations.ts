import {
  Creator,
  Work,
  creators,
  getCreatorBySlug,
  getAllCreators,
} from "./data";
import { UserProfile, currentUser, getUserById } from "./social";

export interface Recommendation {
  id: string;
  type: "creator" | "work";
  item: Creator | Work;
  score: number;
  reasons: RecommendationReason[];
  creatorSlug?: string; // For work recommendations, the creator
}

export interface RecommendationReason {
  type:
    | "shared_influence"
    | "genre_match"
    | "era_match"
    | "lineage_proximity"
    | "similar_readers"
    | "influence_chain"
    | "saved_creator"
    | "followed_user_interest";
  description: string;
  strength: "strong" | "medium" | "weak";
  relatedItem?: string;
}

export interface FeedbackData {
  recommendationId: string;
  userId: string;
  itemId: string;
  itemType: "creator" | "work";
  feedback: "thumbs_up" | "thumbs_down";
  timestamp: Date;
}

// Mock feedback storage
const feedbackStore: FeedbackData[] = [];

// Genre mappings for creators
const creatorGenres: Record<string, string[]> = {
  // Roots of Modernism
  twain: ["Literary Fiction", "Satire", "Adventure"],
  chekhov: ["Literary Fiction", "Short Stories", "Drama"],
  wells: ["Science Fiction", "Speculative Fiction"],
  stein: ["Literary Fiction", "Modernism", "Experimental"],
  joyce: ["Literary Fiction", "Modernism", "Experimental"],
  woolf: ["Literary Fiction", "Modernism", "Feminist Literature"],
  kafka: ["Literary Fiction", "Modernism", "Surrealism"],
  fitzgerald: ["Literary Fiction", "Modernism"],
  tolkien: ["Fantasy", "Epic Fantasy"],
  // American Masters
  hemingway: ["Literary Fiction", "Modernism", "Minimalism"],
  faulkner: [
    "Literary Fiction",
    "Southern Gothic",
    "Modernism",
    "Experimental",
  ],
  oconnor: ["Literary Fiction", "Southern Gothic", "Short Stories"],
  plath: ["Poetry", "Confessional", "Literary Fiction"],
  morrison: [
    "Literary Fiction",
    "African American Literature",
    "Magical Realism",
  ],
  angelou: ["Memoir", "Poetry", "African American Literature"],
  didion: ["Literary Fiction", "Journalism", "Memoir"],
  kerouac: ["Literary Fiction", "Beat Literature"],
  vonnegut: ["Science Fiction", "Satire", "Literary Fiction"],
  // Minimalism
  carver: ["Literary Fiction", "Minimalism", "Short Stories"],
  wolff: ["Literary Fiction", "Minimalism", "Memoir"],
  hempel: ["Literary Fiction", "Minimalism", "Short Stories"],
  ford: ["Literary Fiction", "Minimalism"],
  // Southern / American Epic
  mccarthy: ["Literary Fiction", "Southern Gothic", "Western"],
  whitehead: [
    "Literary Fiction",
    "African American Literature",
    "Historical Fiction",
  ],
  ward: ["Literary Fiction", "Southern Gothic", "African American Literature"],
  vuong: ["Poetry", "Literary Fiction", "Memoir"],
  // Postmodernism
  pynchon: ["Literary Fiction", "Postmodernism", "Experimental"],
  delillo: ["Literary Fiction", "Postmodernism"],
  wallace: ["Literary Fiction", "Postmodernism", "Experimental"],
  // Speculative Fiction
  huxley: ["Science Fiction", "Dystopia", "Philosophy"],
  orwell: ["Science Fiction", "Dystopia", "Political"],
  bradbury: ["Science Fiction", "Fantasy", "Short Stories"],
  asimov: ["Science Fiction", "Hard SF"],
  dick: ["Science Fiction", "Cyberpunk"],
  "le-guin": ["Science Fiction", "Fantasy", "Speculative Fiction"],
  butler: [
    "Science Fiction",
    "Speculative Fiction",
    "African American Literature",
  ],
  atwood: ["Speculative Fiction", "Dystopia", "Feminist Literature"],
  chiang: ["Science Fiction", "Speculative Fiction", "Philosophy"],
  jemisin: ["Fantasy", "Science Fiction", "Speculative Fiction"],
  clarke: ["Science Fiction", "Hard SF"],
  heinlein: ["Science Fiction", "Hard SF"],
  "l-engle": ["Fantasy", "Science Fiction", "Young Adult"],
  lowry: ["Young Adult", "Dystopia", "Historical Fiction"],
  // Magic Realism / International
  borges: ["Literary Fiction", "Magical Realism", "Philosophy"],
  marquez: ["Literary Fiction", "Magical Realism"],
  murakami: ["Literary Fiction", "Magical Realism", "Surrealism"],
  achebe: ["Literary Fiction", "Postcolonial"],
  adichie: ["Literary Fiction", "Postcolonial", "Feminist Literature"],
  rushdie: ["Literary Fiction", "Magical Realism", "Postcolonial"],
  ishiguro: ["Literary Fiction", "Speculative Fiction"],
  // Screenwriting
  wilder: ["Screenwriting", "Comedy", "Drama"],
  chayefsky: ["Screenwriting", "Satire", "Drama"],
  ephron: ["Screenwriting", "Romantic Comedy"],
  sorkin: ["Screenwriting", "Drama", "Political"],
  "waller-bridge": ["Screenwriting", "Comedy", "Drama"],
  // Pulitzer Winners
  "harper-lee": ["Literary Fiction", "Southern Gothic", "Coming-of-Age"],
  walker: [
    "Literary Fiction",
    "African American Literature",
    "Feminist Literature",
  ],
  roth: ["Literary Fiction", "Satire"],
  robinson: ["Literary Fiction", "Philosophical Fiction"],
  chabon: ["Literary Fiction", "Genre Fiction", "Historical Fiction"],
  egan: ["Literary Fiction", "Postmodernism", "Experimental"],
  // National Book Award
  baldwin: ["Literary Fiction", "African American Literature", "Essay"],
  erdrich: ["Literary Fiction", "Native American Literature"],
  johnson: ["Literary Fiction", "Minimalism", "Short Stories"],
  // Screenplay Oscar Winners
  kaufman: ["Screenwriting", "Surrealism", "Drama"],
  tarantino: ["Screenwriting", "Crime", "Drama"],
  "coen-brothers": ["Screenwriting", "Crime", "Dark Comedy"],
  cody: ["Screenwriting", "Comedy", "Coming-of-Age"],
  peele: ["Screenwriting", "Horror", "Social Commentary"],
  // Teleplay Emmy Winners
  chase: ["Screenwriting", "Drama", "Crime"],
  gilligan: ["Screenwriting", "Drama", "Crime"],
  simon: ["Screenwriting", "Drama", "Social Commentary"],
  coel: ["Screenwriting", "Drama", "Comedy"],
};

// Era mappings
const creatorEras: Record<string, string> = {
  // Pre-1900
  twain: "1860s-1900s",
  chekhov: "1880s-1900s",
  wells: "1890s-1940s",
  // Early Modernism
  stein: "1900s-1930s",
  joyce: "1910s-1940s",
  woolf: "1910s-1940s",
  kafka: "1910s-1920s",
  fitzgerald: "1920s-1940s",
  tolkien: "1930s-1960s",
  // Mid-Century
  hemingway: "1920s-1950s",
  faulkner: "1920s-1950s",
  huxley: "1930s-1960s",
  orwell: "1930s-1950s",
  borges: "1940s-1970s",
  bradbury: "1940s-1980s",
  asimov: "1940s-1980s",
  wilder: "1940s-1970s",
  chayefsky: "1950s-1970s",
  kerouac: "1950s-1960s",
  "harper-lee": "1960s",
  angelou: "1960s-2000s",
  baldwin: "1950s-1980s",
  heinlein: "1940s-1980s",
  clarke: "1950s-1990s",
  // Late 20th Century
  oconnor: "1950s-1960s",
  plath: "1950s-1960s",
  marquez: "1960s-2000s",
  "le-guin": "1960s-1980s",
  vonnegut: "1960s-1990s",
  pynchon: "1960s-2000s",
  didion: "1960s-2000s",
  morrison: "1970s-2000s",
  mccarthy: "1960s-1980s",
  carver: "1960s-1980s",
  wolff: "1970s-2000s",
  hempel: "1980s-2000s",
  ford: "1980s-2000s",
  dick: "1960s-1980s",
  achebe: "1950s-1990s",
  atwood: "1980s-2010s",
  murakami: "1980s-2010s",
  butler: "1970s-2000s",
  ishiguro: "1980s-2010s",
  rushdie: "1980s-2010s",
  ephron: "1980s-2000s",
  roth: "1960s-2000s",
  walker: "1970s-2000s",
  robinson: "1980s-2010s",
  erdrich: "1980s-2010s",
  "l-engle": "1960s-1980s",
  // Contemporary
  delillo: "1980s-2010s",
  sorkin: "1990s-2010s",
  wallace: "1990s-2000s",
  chiang: "1990s-2010s",
  whitehead: "2000s-2020s",
  ward: "2010s-2020s",
  adichie: "2000s-2020s",
  jemisin: "2010s-2020s",
  vuong: "2010s-2020s",
  "waller-bridge": "2010s-2020s",
  chabon: "1990s-2010s",
  egan: "2000s-2020s",
  johnson: "1990s-2000s",
  lowry: "1980s-2000s",
  kaufman: "1990s-2010s",
  tarantino: "1990s-2010s",
  "coen-brothers": "1990s-2010s",
  cody: "2000s-2010s",
  peele: "2010s-2020s",
  chase: "1990s-2000s",
  gilligan: "2000s-2010s",
  simon: "2000s-2010s",
  coel: "2010s-2020s",
};

// Recommendation Algorithm
export function generateRecommendations(
  user: UserProfile = currentUser,
  limit: number = 10,
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const scoredItems = new Map<
    string,
    { score: number; reasons: RecommendationReason[] }
  >();

  // Get all creators and works
  const allCreators = getAllCreators();

  // 1. Shared Influences Analysis
  // If user likes a creator, recommend those they influenced or were influenced by
  user.readingDNA.topAuthors.forEach((authorSlug) => {
    const author = getCreatorBySlug(authorSlug);
    if (!author) return;

    // Recommend creators influenced by this author
    author.influenced.forEach((influencedSlug) => {
      if (user.savedCreators.includes(influencedSlug)) return; // Already saved

      const influenced = getCreatorBySlug(influencedSlug);
      if (!influenced) return;

      const existing = scoredItems.get(influencedSlug) || {
        score: 0,
        reasons: [],
      };
      existing.score += 25;
      existing.reasons.push({
        type: "shared_influence",
        description: `Influenced by ${author.name}, one of your favorite authors`,
        strength: "strong",
        relatedItem: authorSlug,
      });
      scoredItems.set(influencedSlug, existing);
    });

    // Recommend creators who influenced this author
    author.influencedBy.forEach((influencerSlug) => {
      if (user.savedCreators.includes(influencerSlug)) return;

      const influencer = getCreatorBySlug(influencerSlug);
      if (!influencer) return;

      const existing = scoredItems.get(influencerSlug) || {
        score: 0,
        reasons: [],
      };
      existing.score += 20;
      existing.reasons.push({
        type: "shared_influence",
        description: `Influenced ${author.name}, showing you the roots of their style`,
        strength: "strong",
        relatedItem: authorSlug,
      });
      scoredItems.set(influencerSlug, existing);
    });
  });

  // 2. Genre Overlap Analysis
  user.favoriteGenres.forEach((genre) => {
    allCreators.forEach((creator) => {
      if (user.savedCreators.includes(creator.slug)) return;

      const genres = creatorGenres[creator.slug] || [];
      if (genres.includes(genre)) {
        const existing = scoredItems.get(creator.slug) || {
          score: 0,
          reasons: [],
        };
        existing.score += 15;

        // Check if we already have this reason
        const hasGenreReason = existing.reasons.some(
          (r) => r.type === "genre_match" && r.relatedItem === genre,
        );
        if (!hasGenreReason) {
          existing.reasons.push({
            type: "genre_match",
            description: `Matches your interest in ${genre}`,
            strength: "medium",
            relatedItem: genre,
          });
        }
        scoredItems.set(creator.slug, existing);
      }
    });
  });

  // 3. Era Preference Matching
  user.eraPreferences.forEach((era) => {
    allCreators.forEach((creator) => {
      if (user.savedCreators.includes(creator.slug)) return;

      if (creatorEras[creator.slug] === era) {
        const existing = scoredItems.get(creator.slug) || {
          score: 0,
          reasons: [],
        };
        existing.score += 10;

        const hasEraReason = existing.reasons.some(
          (r) => r.type === "era_match",
        );
        if (!hasEraReason) {
          existing.reasons.push({
            type: "era_match",
            description: `From the ${era} era you enjoy`,
            strength: "medium",
            relatedItem: era,
          });
        }
        scoredItems.set(creator.slug, existing);
      }
    });
  });

  // 4. Lineage Proximity - Second degree connections
  user.savedCreators.forEach((savedSlug) => {
    const saved = getCreatorBySlug(savedSlug);
    if (!saved) return;

    // Check who influenced the saved creator's influences
    saved.influencedBy.forEach((firstDegreeSlug) => {
      const firstDegree = getCreatorBySlug(firstDegreeSlug);
      if (!firstDegree) return;

      firstDegree.influencedBy.forEach((secondDegreeSlug) => {
        if (user.savedCreators.includes(secondDegreeSlug)) return;
        if (secondDegreeSlug === savedSlug) return;

        const secondDegree = getCreatorBySlug(secondDegreeSlug);
        if (!secondDegree) return;

        const existing = scoredItems.get(secondDegreeSlug) || {
          score: 0,
          reasons: [],
        };
        existing.score += 12;
        existing.reasons.push({
          type: "lineage_proximity",
          description: `Part of the same lineage as ${saved.name} → ${firstDegree.name}`,
          strength: "medium",
          relatedItem: savedSlug,
        });
        scoredItems.set(secondDegreeSlug, existing);
      });

      // Check who was influenced by the saved creator's influences
      firstDegree.influenced.forEach((secondDegreeSlug) => {
        if (user.savedCreators.includes(secondDegreeSlug)) return;
        if (secondDegreeSlug === savedSlug) return;

        const secondDegree = getCreatorBySlug(secondDegreeSlug);
        if (!secondDegree) return;

        const existing = scoredItems.get(secondDegreeSlug) || {
          score: 0,
          reasons: [],
        };
        existing.score += 12;
        existing.reasons.push({
          type: "lineage_proximity",
          description: `Connected through ${saved.name} → ${firstDegree.name} lineage`,
          strength: "medium",
          relatedItem: savedSlug,
        });
        scoredItems.set(secondDegreeSlug, existing);
      });
    });
  });

  // 5. Similar Readers Analysis
  // If users you follow like something, you might too
  user.following.forEach((followingId) => {
    const followingUser = getUserById(followingId);
    if (!followingUser) return;

    followingUser.savedCreators.forEach((creatorSlug) => {
      if (user.savedCreators.includes(creatorSlug)) return;

      const existing = scoredItems.get(creatorSlug) || {
        score: 0,
        reasons: [],
      };
      existing.score += 8;

      const hasFollowerReason = existing.reasons.some(
        (r) => r.type === "followed_user_interest",
      );
      if (!hasFollowerReason) {
        existing.reasons.push({
          type: "followed_user_interest",
          description: `${followingUser.displayName} follows this creator`,
          strength: "weak",
          relatedItem: followingId,
        });
      }
      scoredItems.set(creatorSlug, existing);
    });
  });

  // 6. Influence Chain Discovery
  // Find chains: A → B → C where user has A and C, recommend B
  user.savedCreators.forEach((startSlug) => {
    const start = getCreatorBySlug(startSlug);
    if (!start) return;

    start.influenced.forEach((midSlug) => {
      const mid = getCreatorBySlug(midSlug);
      if (!mid || user.savedCreators.includes(midSlug)) return;

      mid.influenced.forEach((endSlug) => {
        if (user.savedCreators.includes(endSlug)) {
          const existing = scoredItems.get(midSlug) || {
            score: 0,
            reasons: [],
          };
          existing.score += 30;
          existing.reasons.push({
            type: "influence_chain",
            description: `The missing link: ${start.name} → ? → ${getCreatorBySlug(endSlug)?.name}`,
            strength: "strong",
            relatedItem: `${startSlug}-${endSlug}`,
          });
          scoredItems.set(midSlug, existing);
        }
      });
    });
  });

  // Convert scored items to recommendations
  scoredItems.forEach((data, creatorSlug) => {
    const creator = getCreatorBySlug(creatorSlug);
    if (!creator) return;

    // Boost score for creators with more works
    data.score += creator.works.length * 2;

    // Add individual work recommendations
    creator.works.forEach((work) => {
      if (user.readWorks.includes(work.slug)) return;
      if (user.likedWorks.includes(work.slug)) return;

      let workScore = data.score * 0.8;
      if (
        user.likedWorks.some((likedSlug) =>
          creator.works.some((w) => w.slug === likedSlug),
        )
      ) {
        workScore += 10; // Boost if user liked other works by this creator
      }

      recommendations.push({
        id: `rec-work-${work.slug}`,
        type: "work",
        item: work,
        creatorSlug: creator.slug,
        score: workScore,
        reasons: data.reasons.map((r) => ({
          ...r,
          description: r.description.replace(
            creator.name,
            `${creator.name}'s "${work.title}"`,
          ),
        })),
      });
    });

    recommendations.push({
      id: `rec-creator-${creatorSlug}`,
      type: "creator",
      item: creator,
      score: data.score,
      reasons: data.reasons,
    });
  });

  // Sort by score and take top N
  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Get personalized "Why Recommended" explanation
export function getRecommendationExplanation(
  recommendation: Recommendation,
): string {
  const strongReasons = recommendation.reasons.filter(
    (r) => r.strength === "strong",
  );
  const mediumReasons = recommendation.reasons.filter(
    (r) => r.strength === "medium",
  );

  if (strongReasons.length > 0) {
    return strongReasons[0].description;
  }
  if (mediumReasons.length > 0) {
    return mediumReasons[0].description;
  }
  return (
    recommendation.reasons[0]?.description ||
    "Recommended based on your reading history"
  );
}

// Get all reasons for display
export function getAllReasons(
  recommendation: Recommendation,
): RecommendationReason[] {
  return recommendation.reasons.sort((a, b) => {
    const strengthOrder = { strong: 3, medium: 2, weak: 1 };
    return strengthOrder[b.strength] - strengthOrder[a.strength];
  });
}

// Feedback functions
export function submitFeedback(
  recommendationId: string,
  itemId: string,
  itemType: "creator" | "work",
  feedback: "thumbs_up" | "thumbs_down",
): void {
  feedbackStore.push({
    recommendationId,
    userId: currentUser.id,
    itemId,
    itemType,
    feedback,
    timestamp: new Date(),
  });
}

export function getUserFeedback(
  userId: string = currentUser.id,
): Map<string, "thumbs_up" | "thumbs_down"> {
  const userFeedback = new Map<string, "thumbs_up" | "thumbs_down">();
  feedbackStore
    .filter((f) => f.userId === userId)
    .forEach((f) => userFeedback.set(f.itemId, f.feedback));
  return userFeedback;
}

export function hasFeedback(
  itemId: string,
  userId: string = currentUser.id,
): boolean {
  return feedbackStore.some((f) => f.userId === userId && f.itemId === itemId);
}

// Get similar creators based on shared influences
export function getSimilarCreators(
  creatorSlug: string,
  limit: number = 3,
): Creator[] {
  const creator = getCreatorBySlug(creatorSlug);
  if (!creator) return [];

  const similarities = new Map<string, number>();

  creators.forEach((other) => {
    if (other.slug === creatorSlug) return;

    let score = 0;

    // Shared influences
    const sharedInfluencedBy = creator.influencedBy.filter((slug) =>
      other.influencedBy.includes(slug),
    );
    score += sharedInfluencedBy.length * 10;

    // Shared influenced
    const sharedInfluenced = creator.influenced.filter((slug) =>
      other.influenced.includes(slug),
    );
    score += sharedInfluenced.length * 10;

    // Genre overlap
    const creatorGenres_list = creatorGenres[creator.slug] || [];
    const otherGenres = creatorGenres[other.slug] || [];
    const sharedGenres = creatorGenres_list.filter((g) =>
      otherGenres.includes(g),
    );
    score += sharedGenres.length * 5;

    // Same era
    if (creatorEras[creator.slug] === creatorEras[other.slug]) {
      score += 3;
    }

    if (score > 0) {
      similarities.set(other.slug, score);
    }
  });

  return Array.from(similarities.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => getCreatorBySlug(slug))
    .filter((c): c is Creator => c !== undefined);
}

// Get discovery path - how to get from user favorites to this creator
export function getDiscoveryPath(
  targetCreatorSlug: string,
  user: UserProfile = currentUser,
): string[] {
  const target = getCreatorBySlug(targetCreatorSlug);
  if (!target) return [];

  // Direct influence
  for (const savedSlug of user.savedCreators) {
    const saved = getCreatorBySlug(savedSlug);
    if (!saved) continue;

    if (saved.influenced.includes(targetCreatorSlug)) {
      return [savedSlug, targetCreatorSlug];
    }
    if (saved.influencedBy.includes(targetCreatorSlug)) {
      return [targetCreatorSlug, savedSlug];
    }
  }

  // Second degree
  for (const savedSlug of user.savedCreators) {
    const saved = getCreatorBySlug(savedSlug);
    if (!saved) continue;

    for (const firstDegreeSlug of saved.influenced) {
      const firstDegree = getCreatorBySlug(firstDegreeSlug);
      if (!firstDegree) continue;

      if (firstDegree.influenced.includes(targetCreatorSlug)) {
        return [savedSlug, firstDegreeSlug, targetCreatorSlug];
      }
    }

    for (const firstDegreeSlug of saved.influencedBy) {
      const firstDegree = getCreatorBySlug(firstDegreeSlug);
      if (!firstDegree) continue;

      if (firstDegree.influencedBy.includes(targetCreatorSlug)) {
        return [targetCreatorSlug, firstDegreeSlug, savedSlug];
      }
    }
  }

  return [];
}

// Stats for the recommendations page
export interface RecommendationStats {
  totalRecommendations: number;
  creatorsRecommended: number;
  worksRecommended: number;
  averageScore: number;
  topReason: string;
  userFeedbackRate: number;
}

export function getRecommendationStats(
  recommendations: Recommendation[],
): RecommendationStats {
  if (recommendations.length === 0) {
    return {
      totalRecommendations: 0,
      creatorsRecommended: 0,
      worksRecommended: 0,
      averageScore: 0,
      topReason: "",
      userFeedbackRate: 0,
    };
  }

  const creatorsRecommended = recommendations.filter(
    (r) => r.type === "creator",
  ).length;
  const worksRecommended = recommendations.filter(
    (r) => r.type === "work",
  ).length;
  const averageScore =
    recommendations.reduce((sum, r) => sum + r.score, 0) /
    recommendations.length;

  // Count reason types
  const reasonCounts = new Map<string, number>();
  recommendations.forEach((rec) => {
    rec.reasons.forEach((reason) => {
      reasonCounts.set(reason.type, (reasonCounts.get(reason.type) || 0) + 1);
    });
  });

  const topReasonEntry = Array.from(reasonCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const topReason = topReasonEntry ? topReasonEntry[0] : "";

  const userFeedback = getUserFeedback();
  const userFeedbackRate = (userFeedback.size / recommendations.length) * 100;

  return {
    totalRecommendations: recommendations.length,
    creatorsRecommended,
    worksRecommended,
    averageScore: Math.round(averageScore),
    topReason,
    userFeedbackRate: Math.round(userFeedbackRate),
  };
}
