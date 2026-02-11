'use client';

import { useEffect, useState } from 'react';
import { Flame, Target, Compass } from 'lucide-react';
import { recordDailyVisit, getStreakInfo, getDiscoveryProgress } from '@/lib/streaks';
import { usePersistence } from './PersistenceProvider';

export default function StreakBanner() {
  const { state } = usePersistence();
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, isActiveToday: false });
  const [progress, setProgress] = useState({ viewed: 0, total: 8, percentage: 0 });

  useEffect(() => {
    recordDailyVisit();
    const timer = setTimeout(() => {
      setStreak(getStreakInfo());
      setProgress(getDiscoveryProgress());
    }, 0);
    return () => clearTimeout(timer);
  }, [state.viewedCreators]);

  // New users: show invitation instead of hiding
  if (streak.currentStreak === 0 && progress.viewed === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
        <Compass className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-amber-400">
          Start your discovery journey — explore your first creator
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      {/* Streak */}
      {streak.currentStreak > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-400">
            {streak.currentStreak} day streak
          </span>
        </div>
      )}

      {/* Progress */}
      {progress.viewed > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">
            {progress.viewed}/{progress.total} discovered
          </span>
        </div>
      )}
    </div>
  );
}
