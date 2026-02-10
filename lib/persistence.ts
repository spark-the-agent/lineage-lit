'use client';

export interface PersistedState {
  savedCreators: string[];
  likedWorks: string[];
  followedUsers: string[];
  viewedCreators: { id: string; timestamp: number }[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastVisitDate: string; // YYYY-MM-DD
    streakStartDate: string;
  };
  achievements: { id: string; unlockedAt: number }[];
}

const STORAGE_KEY = 'lineage-lit-state';

const defaultState: PersistedState = {
  savedCreators: ['hemingway', 'carver', 'le-guin'],
  likedWorks: ['cathedral', 'blood-meridian', 'dispossessed'],
  followedUsers: ['user-2', 'user-5'],
  viewedCreators: [],
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    streakStartDate: '',
  },
  achievements: [],
};

type Listener = (state: PersistedState) => void;
const listeners = new Set<Listener>();

let cachedState: PersistedState | null = null;

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getState(): PersistedState {
  if (cachedState) return cachedState;
  if (!isClient()) return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cachedState = { ...defaultState, ...JSON.parse(raw) };
    } else {
      cachedState = { ...defaultState };
    }
  } catch {
    cachedState = { ...defaultState };
  }
  return cachedState!;
}

export function setState(partial: Partial<PersistedState>): void {
  const current = getState();
  const next = { ...current, ...partial };
  cachedState = next;

  if (isClient()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full — silently ignore
    }
  }

  listeners.forEach(fn => fn(next));
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Convenience helpers
export function toggleSavedCreator(id: string): boolean {
  const state = getState();
  const saved = state.savedCreators.includes(id);
  setState({
    savedCreators: saved
      ? state.savedCreators.filter(c => c !== id)
      : [...state.savedCreators, id],
  });
  return !saved;
}

export function toggleLikedWork(id: string): boolean {
  const state = getState();
  const liked = state.likedWorks.includes(id);
  setState({
    likedWorks: liked
      ? state.likedWorks.filter(w => w !== id)
      : [...state.likedWorks, id],
  });
  return !liked;
}

export function toggleFollowedUser(id: string): boolean {
  const state = getState();
  const following = state.followedUsers.includes(id);
  setState({
    followedUsers: following
      ? state.followedUsers.filter(u => u !== id)
      : [...state.followedUsers, id],
  });
  return !following;
}

export function recordCreatorView(id: string): void {
  const state = getState();
  const already = state.viewedCreators.some(v => v.id === id);
  if (!already) {
    setState({
      viewedCreators: [...state.viewedCreators, { id, timestamp: Date.now() }],
    });
  }
}

export function unlockAchievement(id: string): boolean {
  const state = getState();
  if (state.achievements.some(a => a.id === id)) return false;
  setState({
    achievements: [...state.achievements, { id, unlockedAt: Date.now() }],
  });
  return true;
}
