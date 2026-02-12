"use client";

import { achievements } from "@/lib/achievements";
import { usePersistence } from "./PersistenceProvider";

export default function AchievementGrid() {
  const { state } = usePersistence();
  const unlockedIds = new Set(state.achievements.map((a) => a.id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {achievements.map((achievement) => {
        const unlocked = unlockedIds.has(achievement.id);
        const unlockedAt = state.achievements.find(
          (a) => a.id === achievement.id,
        )?.unlockedAt;

        return (
          <div
            key={achievement.id}
            className={`rounded-xl p-4 border text-center transition ${
              unlocked
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-zinc-800/30 border-zinc-700/50 opacity-50"
            }`}
          >
            <div className={`text-3xl mb-2 ${unlocked ? "" : "grayscale"}`}>
              {achievement.icon}
            </div>
            <div
              className={`text-sm font-medium ${unlocked ? "text-amber-400" : "text-zinc-500"}`}
            >
              {achievement.name}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              {achievement.description}
            </div>
            {unlocked && unlockedAt && (
              <div className="text-[10px] text-amber-500/60 mt-1">
                {new Date(unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
