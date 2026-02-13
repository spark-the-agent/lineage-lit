"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  PersistedState,
  UserProfileData,
  defaultUserProfile,
  defaultState,
  getState,
  subscribe,
  toggleSavedCreator as _toggleSaved,
  toggleLikedWork as _toggleLiked,
  toggleFollowedUser as _toggleFollowed,
  recordCreatorView as _recordView,
  unlockAchievement as _unlockAchievement,
  updateUserProfile as _updateUserProfile,
} from "@/lib/persistence";
import {
  useConvexUser,
  useUserActions,
  useSavedCreators,
  useLikedWorks,
} from "@/lib/use-convex-user";

interface PersistenceContextValue {
  state: PersistedState;
  userProfile: UserProfileData;
  updateUserProfile: (profile: Partial<UserProfileData>) => void;
  toggleSavedCreator: (id: string) => boolean;
  toggleLikedWork: (id: string) => boolean;
  toggleFollowedUser: (id: string) => boolean;
  recordCreatorView: (id: string) => void;
  unlockAchievement: (id: string) => boolean;
  isCreatorSaved: (id: string) => boolean;
  isWorkLiked: (id: string) => boolean;
  isUserFollowed: (id: string) => boolean;
}

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

// Stable references for useSyncExternalStore (must not be inline arrows)
const getSnapshot = () => getState();
const getServerSnapshot = () => defaultState;

const EMPTY_STATE: PersistedState = {
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

export function PersistenceProvider({ children }: { children: ReactNode }) {
  const localState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const convexUser = useConvexUser();
  const actions = useUserActions();
  const savedCreators = useSavedCreators();
  const likedWorks = useLikedWorks();
  const isAuthenticated = actions.isAuthenticated;
  const migratedRef = useRef(false);

  // One-time migration: localStorage -> Convex on first sign-in
  useEffect(() => {
    if (!isAuthenticated || migratedRef.current) return;
    if (!convexUser) return; // Wait for user doc to load

    migratedRef.current = true;

    // Only migrate if localStorage has non-default data
    const lsSaved = localState.savedCreators;
    const lsLiked = localState.likedWorks;
    const hasLocalData = lsSaved.length > 0 || lsLiked.length > 0;

    if (hasLocalData) {
      actions.migrateFromLocalStorage(lsSaved, lsLiked).catch(() => {
        migratedRef.current = false; // Retry on failure
      });
    }
  }, [
    isAuthenticated,
    convexUser,
    localState.savedCreators,
    localState.likedWorks,
    actions,
  ]);

  // Build the effective state: Convex for signed-in, localStorage for anonymous
  const state: PersistedState =
    isAuthenticated && convexUser
      ? {
          savedCreators,
          likedWorks,
          followedUsers: localState.followedUsers, // Follows handled separately
          viewedCreators: convexUser.viewedCreators ?? [],
          streakData: convexUser.streakData ?? EMPTY_STATE.streakData,
          achievements: convexUser.achievements ?? [],
        }
      : localState;

  const userProfile = localState.userProfile ?? defaultUserProfile;
  const updateUserProfile = useCallback(
    (profile: Partial<UserProfileData>) => _updateUserProfile(profile),
    [],
  );

  // Toggle save: route to Convex (signed-in) or localStorage (anonymous)
  const toggleSavedCreator = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        actions.toggleSaveCreator(id);
        // Return optimistic state (inverse of current)
        return !savedCreators.includes(id);
      }
      return _toggleSaved(id);
    },
    [isAuthenticated, actions, savedCreators],
  );

  const toggleLikedWork = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        actions.toggleLikeWork(id);
        return !likedWorks.includes(id);
      }
      return _toggleLiked(id);
    },
    [isAuthenticated, actions, likedWorks],
  );

  const toggleFollowedUser = useCallback(
    (id: string) => _toggleFollowed(id),
    [],
  );

  const recordCreatorView = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        actions.recordCreatorView(id);
        return;
      }
      _recordView(id);
    },
    [isAuthenticated, actions],
  );

  const unlockAchievement = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        actions.unlockAchievement(id);
        return true;
      }
      return _unlockAchievement(id);
    },
    [isAuthenticated, actions],
  );

  const isCreatorSaved = useCallback(
    (id: string) => state.savedCreators.includes(id),
    [state.savedCreators],
  );
  const isWorkLiked = useCallback(
    (id: string) => state.likedWorks.includes(id),
    [state.likedWorks],
  );
  const isUserFollowed = useCallback(
    (id: string) => state.followedUsers.includes(id),
    [state.followedUsers],
  );

  return (
    <PersistenceContext.Provider
      value={{
        state,
        userProfile,
        updateUserProfile,
        toggleSavedCreator,
        toggleLikedWork,
        toggleFollowedUser,
        recordCreatorView,
        unlockAchievement,
        isCreatorSaved,
        isWorkLiked,
        isUserFollowed,
      }}
    >
      {children}
    </PersistenceContext.Provider>
  );
}

export function usePersistence(): PersistenceContextValue {
  const ctx = useContext(PersistenceContext);
  if (!ctx)
    throw new Error("usePersistence must be used inside PersistenceProvider");
  return ctx;
}
