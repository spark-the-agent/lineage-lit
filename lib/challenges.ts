import { getState } from './persistence';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  check: () => number; // Returns current progress count
}

const allChallenges: Challenge[] = [
  {
    id: 'explore-3',
    title: 'Explorer',
    description: 'Explore 3 new creators this week',
    icon: '🧭',
    target: 3,
    check: () => {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return getState().viewedCreators.filter(v => v.timestamp > weekAgo).length;
    },
  },
  {
    id: 'find-path',
    title: 'Pathfinder',
    description: 'Find the Hemingway-Chiang connection',
    icon: '🔍',
    target: 1,
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      return (viewed.includes('hemingway') && viewed.includes('chiang')) ? 1 : 0;
    },
  },
  {
    id: 'screenplay-duo',
    title: 'Silver Screen',
    description: 'Discover both screenplay creators',
    icon: '🎬',
    target: 2,
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      return ['sorkin', 'chayefsky'].filter(id => viewed.includes(id)).length;
    },
  },
  {
    id: 'save-5',
    title: 'Collector',
    description: 'Save 5 creators to your collection',
    icon: '📚',
    target: 5,
    check: () => getState().savedCreators.length,
  },
  {
    id: 'southern-gothic',
    title: 'Gothic Reader',
    description: 'Explore the Southern Gothic lineage (Faulkner + McCarthy)',
    icon: '🏚️',
    target: 2,
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      return ['faulkner', 'mccarthy'].filter(id => viewed.includes(id)).length;
    },
  },
  {
    id: 'minimalist-chain',
    title: 'Less is More',
    description: 'Trace the minimalist chain: Hemingway → Carver',
    icon: '✂️',
    target: 2,
    check: () => {
      const viewed = getState().viewedCreators.map(v => v.id);
      return ['hemingway', 'carver'].filter(id => viewed.includes(id)).length;
    },
  },
];

export function getWeeklyChallenge(): Challenge {
  // Rotate based on week of year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7
  );
  const idx = weekNumber % allChallenges.length;
  return allChallenges[idx];
}

export function getChallengeProgress(challenge: Challenge): { current: number; target: number; percentage: number } {
  const current = Math.min(challenge.check(), challenge.target);
  return {
    current,
    target: challenge.target,
    percentage: Math.round((current / challenge.target) * 100),
  };
}
