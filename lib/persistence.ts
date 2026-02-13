"use client";

export interface UserProfileData {
  displayName: string;
  username: string;
  bio: string;
  avatarSeed: string;
}

export const defaultUserProfile: UserProfileData = {
  displayName: "Literary Explorer",
  username: "explorer",
  bio: "Discovering the lineage of ideas.",
  avatarSeed: "explorer",
};

export interface PersistedState {
  savedCreators: string[];
  likedWorks: string[];
  followedUsers: string[];
  viewedCreators: { slug: string; timestamp: number }[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastVisitDate: string; // YYYY-MM-DD
    streakStartDate: string;
  };
  achievements: { id: string; unlockedAt: number }[];
  userProfile?: UserProfileData;
}

const STORAGE_KEY = "lineage-lit-state";

export const defaultState: PersistedState = {
  savedCreators: [],
  likedWorks: [],
  followedUsers: [],
  viewedCreators: [],
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: "",
    streakStartDate: "",
  },
  achievements: [],
};

type Listener = (state: PersistedState) => void;
const listeners = new Set<Listener>();

let cachedState: PersistedState | null = null;

function isClient(): boolean {
  return typeof window !== "undefined";
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

  listeners.forEach((fn) => fn(next));
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Convenience helpers
export function toggleSavedCreator(slug: string): boolean {
  const state = getState();
  const saved = state.savedCreators.includes(slug);
  setState({
    savedCreators: saved
      ? state.savedCreators.filter((c) => c !== slug)
      : [...state.savedCreators, slug],
  });
  return !saved;
}

export function toggleLikedWork(slug: string): boolean {
  const state = getState();
  const liked = state.likedWorks.includes(slug);
  setState({
    likedWorks: liked
      ? state.likedWorks.filter((w) => w !== slug)
      : [...state.likedWorks, slug],
  });
  return !liked;
}

export function toggleFollowedUser(id: string): boolean {
  const state = getState();
  const following = state.followedUsers.includes(id);
  setState({
    followedUsers: following
      ? state.followedUsers.filter((u) => u !== id)
      : [...state.followedUsers, id],
  });
  return !following;
}

export function recordCreatorView(slug: string): void {
  const state = getState();
  const already = state.viewedCreators.some((v) => v.slug === slug);
  if (!already) {
    setState({
      viewedCreators: [
        ...state.viewedCreators,
        { slug, timestamp: Date.now() },
      ],
    });
  }
}

export function unlockAchievement(id: string): boolean {
  const state = getState();
  if (state.achievements.some((a) => a.id === id)) return false;
  setState({
    achievements: [...state.achievements, { id, unlockedAt: Date.now() }],
  });
  return true;
}

export function updateUserProfile(profile: Partial<UserProfileData>): void {
  const state = getState();
  const current = state.userProfile ?? defaultUserProfile;
  setState({
    userProfile: { ...current, ...profile },
  });
}
