"use client";

import { useEffect, useRef, useState } from "react";
import { Achievement, checkAndUnlockAchievements } from "@/lib/achievements";
import { usePersistence } from "./PersistenceProvider";

export default function AchievementToast() {
  const { state, unlockAchievement } = usePersistence();
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Defer the check to avoid synchronous setState in effect
    timerRef.current = setTimeout(() => {
      const newlyUnlocked = checkAndUnlockAchievements();
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach((a) => unlockAchievement(a.id));
        setToasts(newlyUnlocked);
        timerRef.current = setTimeout(() => setToasts([]), 4000);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.viewedCreators, state.savedCreators, unlockAchievement]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {toasts.map((achievement) => (
        <div
          key={achievement.id}
          className="flex items-center gap-3 px-5 py-3 bg-zinc-900 border border-amber-500/50 rounded-xl shadow-xl shadow-amber-500/10 animate-bounce"
        >
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <div className="text-sm font-semibold text-amber-400">
              Achievement Unlocked!
            </div>
            <div className="text-xs text-zinc-300">{achievement.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
