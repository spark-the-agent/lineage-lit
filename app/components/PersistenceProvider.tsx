'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  PersistedState,
  getState,
  setState as setGlobalState,
  subscribe,
  toggleSavedCreator as _toggleSaved,
  toggleLikedWork as _toggleLiked,
  toggleFollowedUser as _toggleFollowed,
  recordCreatorView as _recordView,
  unlockAchievement as _unlockAchievement,
} from '@/lib/persistence';

interface PersistenceContextValue {
  state: PersistedState;
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

export function PersistenceProvider({ children }: { children: ReactNode }) {
  const [state, setLocalState] = useState<PersistedState>(getState);

  useEffect(() => {
    // Sync when localStorage loads on client
    setLocalState(getState());
    return subscribe(setLocalState);
  }, []);

  const toggleSavedCreator = useCallback((id: string) => _toggleSaved(id), []);
  const toggleLikedWork = useCallback((id: string) => _toggleLiked(id), []);
  const toggleFollowedUser = useCallback((id: string) => _toggleFollowed(id), []);
  const recordCreatorView = useCallback((id: string) => _recordView(id), []);
  const unlockAchievement = useCallback((id: string) => _unlockAchievement(id), []);

  const isCreatorSaved = useCallback((id: string) => state.savedCreators.includes(id), [state.savedCreators]);
  const isWorkLiked = useCallback((id: string) => state.likedWorks.includes(id), [state.likedWorks]);
  const isUserFollowed = useCallback((id: string) => state.followedUsers.includes(id), [state.followedUsers]);

  return (
    <PersistenceContext.Provider
      value={{
        state,
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
  if (!ctx) throw new Error('usePersistence must be used inside PersistenceProvider');
  return ctx;
}
