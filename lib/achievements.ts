import { getState } from './persistence';
import { creators } from './data';
import { findPath } from './path-finder';
import { analyzeNetwork } from './network-analysis';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: () => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first-contact',
    name: 'First Contact',
    description: 'Visit your first creator page',
    icon: '👋',
    check: () => getState().viewedCreators.length >= 1,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Explore the full Hemingway → Carver → Wolff chain',
    icon: '✂️',
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      return ['hemingway', 'carver'].every(id => viewed.includes(id));
    },
  },
  {
    id: 'genre-hopper',
    name: 'Genre Hopper',
    description: 'Explore creators from 3+ different genres',
    icon: '🦘',
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      const genreSets: Record<string, string[]> = {
        fiction: ['hemingway', 'carver', 'mccarthy', 'faulkner'],
        scifi: ['le-guin', 'chiang'],
        screenplay: ['sorkin', 'chayefsky'],
      };
      let genreCount = 0;
      for (const ids of Object.values(genreSets)) {
        if (ids.some(id => viewed.includes(id))) genreCount++;
      }
      return genreCount >= 3;
    },
  },
  {
    id: 'bridge-builder',
    name: 'Bridge Builder',
    description: 'Discover a bridge creator who connects communities',
    icon: '🌉',
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      const metrics = analyzeNetwork(creators);
      return metrics.bridges.some(b => viewed.includes(b.creator.id));
    },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Visit all 8 creators',
    icon: '🏆',
    check: () => getState().viewedCreators.length >= creators.length,
  },
  {
    id: 'film-buff',
    name: 'Film Buff',
    description: 'Explore both screenplay creators',
    icon: '🎬',
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      return ['sorkin', 'chayefsky'].every(id => viewed.includes(id));
    },
  },
  {
    id: 'six-degrees',
    name: 'Six Degrees',
    description: 'Find a path between two saved creators',
    icon: '🔗',
    check: () => {
      const saved = getState().savedCreators;
      if (saved.length < 2) return false;
      for (let i = 0; i < saved.length; i++) {
        for (let j = i + 1; j < saved.length; j++) {
          const result = findPath(saved[i], saved[j]);
          if (result && result.length > 0) return true;
        }
      }
      return false;
    },
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Save 5 or more creators to your collection',
    icon: '📚',
    check: () => getState().savedCreators.length >= 5,
  },
];

export function getUnlockedAchievements(): Achievement[] {
  const state = getState();
  const unlockedIds = state.achievements.map(a => a.id);
  return achievements.filter(a => unlockedIds.includes(a.id));
}

export function getLockedAchievements(): Achievement[] {
  const state = getState();
  const unlockedIds = state.achievements.map(a => a.id);
  return achievements.filter(a => !unlockedIds.includes(a.id));
}

export function checkAndUnlockAchievements(): Achievement[] {
  const state = getState();
  const unlockedIds = new Set(state.achievements.map(a => a.id));
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of achievements) {
    if (!unlockedIds.has(achievement.id) && achievement.check()) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
