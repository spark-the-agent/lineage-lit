/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import { Trophy, Flame, Target, Award } from "lucide-react";
import { mockUsers, currentUser } from "@/lib/social";
import { usePersistence } from "./PersistenceProvider";
import { useCreators } from "@/lib/use-convex-data";

interface LeaderEntry {
  name: string;
  avatar: string;
  score: number;
  creatorsExplored: number;
  streak: number;
  badges: number;
  isCurrentUser: boolean;
}

export default function Leaderboard() {
  const creators = useCreators();
  const { state } = usePersistence();

  const entries = useMemo<LeaderEntry[]>(() => {
    // Current user from real data
    const currentEntry: LeaderEntry = {
      name: currentUser.displayName,
      avatar: currentUser.avatar,
      score:
        state.viewedCreators.length * 10 +
        state.achievements.length * 15 +
        state.savedCreators.length * 5,
      creatorsExplored: state.viewedCreators.length,
      streak: state.streakData.currentStreak,
      badges: state.achievements.length,
      isCurrentUser: true,
    };

    // Mock users with simulated progress (deterministic based on user data)
    const mockEntries = mockUsers.map((user) => ({
      name: user.displayName,
      avatar: user.avatar,
      score: Math.floor(
        user.readingDNA.totalAuthors * 1.5 + user.savedCreators.length * 10,
      ),
      creatorsExplored: Math.min(
        user.savedCreators.length + 2,
        creators.length,
      ),
      streak: (user.readingDNA.totalBooks % 7) + 1,
      badges: (user.readingDNA.totalAuthors % 5) + 1,
      isCurrentUser: false,
    }));

    return [currentEntry, ...mockEntries].sort((a, b) => b.score - a.score);
  }, [state, creators]);

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        Exploration Leaderboard
      </h3>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div
            key={entry.name}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              entry.isCurrentUser
                ? "bg-amber-500/10 border border-amber-500/20"
                : "hover:bg-zinc-800/50"
            }`}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                i === 0
                  ? "bg-amber-500 text-zinc-900"
                  : i === 1
                    ? "bg-zinc-600 text-zinc-200"
                    : i === 2
                      ? "bg-amber-700 text-zinc-200"
                      : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {i + 1}
            </span>
            <img
              src={entry.avatar}
              alt=""
              className="w-8 h-8 rounded-full bg-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium truncate ${entry.isCurrentUser ? "text-amber-400" : "text-zinc-200"}`}
                >
                  {entry.name}
                </span>
                {entry.isCurrentUser && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                    You
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-[10px] text-zinc-500 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Target className="w-2.5 h-2.5" />
                  {entry.creatorsExplored}/{creators.length}
                </span>
                <span className="flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5" />
                  {entry.streak}d
                </span>
                <span className="flex items-center gap-0.5">
                  <Award className="w-2.5 h-2.5" />
                  {entry.badges}
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-zinc-400">
              {entry.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
