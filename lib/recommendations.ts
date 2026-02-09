import { Creator, Work, creators, getCreatorById, getAllCreators } from './data';
import { UserProfile, currentUser, getUserById } from './social';

export interface Recommendation {
  id: string;
  type: 'creator' | 'work';
  item: Creator | Work;
  score: number;
  reasons: RecommendationReason[];
  creatorId?: string; // For work recommendations, the creator
}

export interface RecommendationReason {
  type: 'shared_influence' | 'genre_match' | 'era_match' | 'lineage_proximity' | 
        'similar_readers' | 'influence_chain' | 'saved_creator' | 'followed_user_interest';
  description: string;
  strength: 'strong' | 'medium' | 'weak';
  relatedItem?: string;
}

export interface FeedbackData {
  recommendationId: string;
  userId: string;
  itemId: string;
  itemType: 'creator' | 'work';
  feedback: 'thumbs_up' | 'thumbs_down';
  timestamp: Date;
}

// Mock feedback storage
const feedbackStore: FeedbackData[] = [];

// Genre mappings for creators
const creatorGenres: Record<string, string[]> = {
  'hemingway': ['Literary Fiction', 'Modernism', 'Minimalism'],
  'carver': ['Literary Fiction', 'Minimalism', 'Short Stories'],
  'mccarthy': ['Literary Fiction', 'Southern Gothic', 'Western'],
  'faulkner': ['Literary Fiction', 'Southern Gothic', 'Modernism', 'Experimental'],
  'le-guin': ['Science Fiction', 'Fantasy', 'Speculative Fiction'],
  'chiang': ['Science Fiction', 'Speculative Fiction', 'Philosophy'],
  'sorkin': ['Screenwriting', 'Drama', 'Political'],
  'chayefsky': ['Screenwriting', 'Satire', 'Drama'],
};

// Era mappings
const creatorEras: Record<string, string> = {
  'hemingway': '1920s-1950s',
  'faulkner': '1920s-1950s',
  'chayefsky': '1950s-1970s',
  'le-guin': '1960s-1980s',
  'carver': '1960s-1980s',
  'mccarthy': '1960s-1980s',
  'sorkin': '1990s-2010s',
  'chiang': '1990s-2010s',
};

// Recommendation Algorithm
export function generateRecommendations(user: UserProfile = currentUser, limit: number = 10): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const scoredItems = new Map<string, { score: number; reasons: RecommendationReason[] }>();

  // Get all creators and works
  const allCreators = getAllCreators();

  // 1. Shared Influences Analysis
  // If user likes a creator, recommend those they influenced or were influenced by
  user.readingDNA.topAuthors.forEach(authorId => {
    const author = getCreatorById(authorId);
    if (!author) return;

    // Recommend creators influenced by this author
    author.influenced.forEach(influencedId => {
      if (user.savedCreators.includes(influencedId)) return; // Already saved
      
      const influenced = getCreatorById(influencedId);
      if (!influenced) return;

      const existing = scoredItems.get(influencedId) || { score: 0, reasons: [] };
      existing.score += 25;
      existing.reasons.push({
        type: 'shared_influence',
        description: `Influenced by ${author.name}, one of your favorite authors`,
        strength: 'strong',
        relatedItem: authorId,
      });
      scoredItems.set(influencedId, existing);
    });

    // Recommend creators who influenced this author
    author.influencedBy.forEach(influencerId => {
      if (user.savedCreators.includes(influencerId)) return;

      const influencer = getCreatorById(influencerId);
      if (!influencer) return;

      const existing = scoredItems.get(influencerId) || { score: 0, reasons: [] };
      existing.score += 20;
      existing.reasons.push({
        type: 'shared_influence',
        description: `Influenced ${author.name}, showing you the roots of their style`,
        strength: 'strong',
        relatedItem: authorId,
      });
      scoredItems.set(influencerId, existing);
    });
  });

  // 2. Genre Overlap Analysis
  user.favoriteGenres.forEach(genre => {
    allCreators.forEach(creator => {
      if (user.savedCreators.includes(creator.id)) return;

      const genres = creatorGenres[creator.id] || [];
      if (genres.includes(genre)) {
        const existing = scoredItems.get(creator.id) || { score: 0, reasons: [] };
        existing.score += 15;
        
        // Check if we already have this reason
        const hasGenreReason = existing.reasons.some(r => r.type === 'genre_match' && r.relatedItem === genre);
        if (!hasGenreReason) {
          existing.reasons.push({
            type: 'genre_match',
            description: `Matches your interest in ${genre}`,
            strength: 'medium',
            relatedItem: genre,
          });
        }
        scoredItems.set(creator.id, existing);
      }
    });
  });

  // 3. Era Preference Matching
  user.eraPreferences.forEach(era => {
    allCreators.forEach(creator => {
      if (user.savedCreators.includes(creator.id)) return;

      if (creatorEras[creator.id] === era) {
        const existing = scoredItems.get(creator.id) || { score: 0, reasons: [] };
        existing.score += 10;
        
        const hasEraReason = existing.reasons.some(r => r.type === 'era_match');
        if (!hasEraReason) {
          existing.reasons.push({
            type: 'era_match',
            description: `From the ${era} era you enjoy`,
            strength: 'medium',
            relatedItem: era,
          });
        }
        scoredItems.set(creator.id, existing);
      }
    });
  });

  // 4. Lineage Proximity - Second degree connections
  user.savedCreators.forEach(savedId => {
    const saved = getCreatorById(savedId);
    if (!saved) return;

    // Check who influenced the saved creator's influences
    saved.influencedBy.forEach(firstDegreeId => {
      const firstDegree = getCreatorById(firstDegreeId);
      if (!firstDegree) return;

      firstDegree.influencedBy.forEach(secondDegreeId => {
        if (user.savedCreators.includes(secondDegreeId)) return;
        if (secondDegreeId === savedId) return;

        const secondDegree = getCreatorById(secondDegreeId);
        if (!secondDegree) return;

        const existing = scoredItems.get(secondDegreeId) || { score: 0, reasons: [] };
        existing.score += 12;
        existing.reasons.push({
          type: 'lineage_proximity',
          description: `Part of the same lineage as ${saved.name} → ${firstDegree.name}`,
          strength: 'medium',
          relatedItem: savedId,
        });
        scoredItems.set(secondDegreeId, existing);
      });

      // Check who was influenced by the saved creator's influences
      firstDegree.influenced.forEach(secondDegreeId => {
        if (user.savedCreators.includes(secondDegreeId)) return;
        if (secondDegreeId === savedId) return;

        const secondDegree = getCreatorById(secondDegreeId);
        if (!secondDegree) return;

        const existing = scoredItems.get(secondDegreeId) || { score: 0, reasons: [] };
        existing.score += 12;
        existing.reasons.push({
          type: 'lineage_proximity',
          description: `Connected through ${saved.name} → ${firstDegree.name} lineage`,
          strength: 'medium',
          relatedItem: savedId,
        });
        scoredItems.set(secondDegreeId, existing);
      });
    });
  });

  // 5. Similar Readers Analysis
  // If users you follow like something, you might too
  user.following.forEach(followingId => {
    const followingUser = getUserById(followingId);
    if (!followingUser) return;

    followingUser.savedCreators.forEach(creatorId => {
      if (user.savedCreators.includes(creatorId)) return;

      const existing = scoredItems.get(creatorId) || { score: 0, reasons: [] };
      existing.score += 8;
      
      const hasFollowerReason = existing.reasons.some(r => r.type === 'followed_user_interest');
      if (!hasFollowerReason) {
        existing.reasons.push({
          type: 'followed_user_interest',
          description: `${followingUser.displayName} follows this creator`,
          strength: 'weak',
          relatedItem: followingId,
        });
      }
      scoredItems.set(creatorId, existing);
    });
  });

  // 6. Influence Chain Discovery
  // Find chains: A → B → C where user has A and C, recommend B
  user.savedCreators.forEach(startId => {
    const start = getCreatorById(startId);
    if (!start) return;

    start.influenced.forEach(midId => {
      const mid = getCreatorById(midId);
      if (!mid || user.savedCreators.includes(midId)) return;

      mid.influenced.forEach(endId => {
        if (user.savedCreators.includes(endId)) {
          const existing = scoredItems.get(midId) || { score: 0, reasons: [] };
          existing.score += 30;
          existing.reasons.push({
            type: 'influence_chain',
            description: `The missing link: ${start.name} → ? → ${getCreatorById(endId)?.name}`,
            strength: 'strong',
            relatedItem: `${startId}-${endId}`,
          });
          scoredItems.set(midId, existing);
        }
      });
    });
  });

  // Convert scored items to recommendations
  scoredItems.forEach((data, creatorId) => {
    const creator = getCreatorById(creatorId);
    if (!creator) return;

    // Boost score for creators with more works
    data.score += creator.works.length * 2;

    // Add individual work recommendations
    creator.works.forEach(work => {
      if (user.readWorks.includes(work.id)) return;
      if (user.likedWorks.includes(work.id)) return;

      let workScore = data.score * 0.8;
      if (user.likedWorks.some(likedId => creator.works.some(w => w.id === likedId))) {
        workScore += 10; // Boost if user liked other works by this creator
      }

      recommendations.push({
        id: `rec-work-${work.id}`,
        type: 'work',
        item: work,
        creatorId: creator.id,
        score: workScore,
        reasons: data.reasons.map(r => ({
          ...r,
          description: r.description.replace(creator.name, `${creator.name}'s "${work.title}"`),
        })),
      });
    });

    recommendations.push({
      id: `rec-creator-${creatorId}`,
      type: 'creator',
      item: creator,
      score: data.score,
      reasons: data.reasons,
    });
  });

  // Sort by score and take top N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Get personalized "Why Recommended" explanation
export function getRecommendationExplanation(recommendation: Recommendation): string {
  const strongReasons = recommendation.reasons.filter(r => r.strength === 'strong');
  const mediumReasons = recommendation.reasons.filter(r => r.strength === 'medium');

  if (strongReasons.length > 0) {
    return strongReasons[0].description;
  }
  if (mediumReasons.length > 0) {
    return mediumReasons[0].description;
  }
  return recommendation.reasons[0]?.description || 'Recommended based on your reading history';
}

// Get all reasons for display
export function getAllReasons(recommendation: Recommendation): RecommendationReason[] {
  return recommendation.reasons.sort((a, b) => {
    const strengthOrder = { strong: 3, medium: 2, weak: 1 };
    return strengthOrder[b.strength] - strengthOrder[a.strength];
  });
}

// Feedback functions
export function submitFeedback(
  recommendationId: string,
  itemId: string,
  itemType: 'creator' | 'work',
  feedback: 'thumbs_up' | 'thumbs_down'
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

export function getUserFeedback(userId: string = currentUser.id): Map<string, 'thumbs_up' | 'thumbs_down'> {
  const userFeedback = new Map<string, 'thumbs_up' | 'thumbs_down'>();
  feedbackStore
    .filter(f => f.userId === userId)
    .forEach(f => userFeedback.set(f.itemId, f.feedback));
  return userFeedback;
}

export function hasFeedback(itemId: string, userId: string = currentUser.id): boolean {
  return feedbackStore.some(f => f.userId === userId && f.itemId === itemId);
}

// Get similar creators based on shared influences
export function getSimilarCreators(creatorId: string, limit: number = 3): Creator[] {
  const creator = getCreatorById(creatorId);
  if (!creator) return [];

  const similarities = new Map<string, number>();

  creators.forEach(other => {
    if (other.id === creatorId) return;

    let score = 0;
    
    // Shared influences
    const sharedInfluencedBy = creator.influencedBy.filter(id => other.influencedBy.includes(id));
    score += sharedInfluencedBy.length * 10;

    // Shared influenced
    const sharedInfluenced = creator.influenced.filter(id => other.influenced.includes(id));
    score += sharedInfluenced.length * 10;

    // Genre overlap
    const creatorGenres_list = creatorGenres[creator.id] || [];
    const otherGenres = creatorGenres[other.id] || [];
    const sharedGenres = creatorGenres_list.filter(g => otherGenres.includes(g));
    score += sharedGenres.length * 5;

    // Same era
    if (creatorEras[creator.id] === creatorEras[other.id]) {
      score += 3;
    }

    if (score > 0) {
      similarities.set(other.id, score);
    }
  });

  return Array.from(similarities.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => getCreatorById(id))
    .filter((c): c is Creator => c !== undefined);
}

// Get discovery path - how to get from user favorites to this creator
export function getDiscoveryPath(targetCreatorId: string, user: UserProfile = currentUser): string[] {
  const target = getCreatorById(targetCreatorId);
  if (!target) return [];

  // Direct influence
  for (const savedId of user.savedCreators) {
    const saved = getCreatorById(savedId);
    if (!saved) continue;

    if (saved.influenced.includes(targetCreatorId)) {
      return [savedId, targetCreatorId];
    }
    if (saved.influencedBy.includes(targetCreatorId)) {
      return [targetCreatorId, savedId];
    }
  }

  // Second degree
  for (const savedId of user.savedCreators) {
    const saved = getCreatorById(savedId);
    if (!saved) continue;

    for (const firstDegreeId of saved.influenced) {
      const firstDegree = getCreatorById(firstDegreeId);
      if (!firstDegree) continue;

      if (firstDegree.influenced.includes(targetCreatorId)) {
        return [savedId, firstDegreeId, targetCreatorId];
      }
    }

    for (const firstDegreeId of saved.influencedBy) {
      const firstDegree = getCreatorById(firstDegreeId);
      if (!firstDegree) continue;

      if (firstDegree.influencedBy.includes(targetCreatorId)) {
        return [targetCreatorId, firstDegreeId, savedId];
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

export function getRecommendationStats(recommendations: Recommendation[]): RecommendationStats {
  if (recommendations.length === 0) {
    return {
      totalRecommendations: 0,
      creatorsRecommended: 0,
      worksRecommended: 0,
      averageScore: 0,
      topReason: '',
      userFeedbackRate: 0,
    };
  }

  const creatorsRecommended = recommendations.filter(r => r.type === 'creator').length;
  const worksRecommended = recommendations.filter(r => r.type === 'work').length;
  const averageScore = recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length;

  // Count reason types
  const reasonCounts = new Map<string, number>();
  recommendations.forEach(rec => {
    rec.reasons.forEach(reason => {
      reasonCounts.set(reason.type, (reasonCounts.get(reason.type) || 0) + 1);
    });
  });

  const topReasonEntry = Array.from(reasonCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const topReason = topReasonEntry ? topReasonEntry[0] : '';

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
