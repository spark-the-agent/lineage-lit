"use client";

import Link from "next/link";
import {
  Network,
  Clock,
  BookOpen,
  Trophy,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
} from "lucide-react";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
  DesktopNav,
} from "@/app/components/MobileNav";
import { getCreatorById } from "@/lib/data";
import WeeklyChallenge from "@/app/components/WeeklyChallenge";
import { usePersistence } from "@/app/components/PersistenceProvider";
import { achievements } from "@/lib/achievements";
import { creatorGenres } from "@/lib/filters";

export default function ActivityPage() {
  const { state } = usePersistence();

  const viewedSorted = [...state.viewedCreators].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  // Group saved creators by genre
  const savedByGenre = new Map<string, string[]>();
  for (const id of state.savedCreators) {
    const genres = creatorGenres[id] || ["Other"];
    const primaryGenre = genres[0];
    const list = savedByGenre.get(primaryGenre) || [];
    list.push(id);
    savedByGenre.set(primaryGenre, list);
  }

  const unlockedIds = new Set(state.achievements.map((a) => a.id));
  const unlockedCount = unlockedIds.size;
  const totalAchievements = achievements.length;

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Your Activity" />
      <MobileHeaderSpacer />

      {/* Desktop Header */}
      <header className="border-b border-zinc-800/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <DesktopNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-400" />
            Your Activity
          </h1>
          <p className="text-zinc-400 mt-2">
            Your exploration history and progress
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center">
                <Eye className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-400">
                  {state.viewedCreators.length}
                </p>
                <p className="text-xs text-zinc-500">Explored</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center">
                <Bookmark className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-400">
                  {state.savedCreators.length}
                </p>
                <p className="text-xs text-zinc-500">Saved</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center">
                <Heart className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-400">
                  {state.likedWorks.length}
                </p>
                <p className="text-xs text-zinc-500">Liked Works</p>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Exploration Timeline
              </h3>
              {viewedSorted.length > 0 ? (
                <div className="space-y-3">
                  {viewedSorted.map((v) => {
                    const creator = getCreatorById(v.id);
                    if (!creator) return null;
                    const date = new Date(v.timestamp);
                    const timeStr = date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    const timeDetail = date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    return (
                      <Link
                        key={v.id}
                        href={`/creators/${v.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition group"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-200 group-hover:text-amber-400 transition truncate">
                            {creator.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {creator.years} &middot;{" "}
                            {creator.works.length} works &middot;{" "}
                            {creator.influenced.length + creator.influencedBy.length} connections
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-zinc-500">{timeStr}</p>
                          <p className="text-xs text-zinc-600">{timeDetail}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">
                    No creators explored yet.
                  </p>
                  <Link
                    href="/explore"
                    className="inline-block mt-3 px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition"
                  >
                    Start Exploring
                  </Link>
                </div>
              )}
            </div>

            {/* Saved Creators by Genre */}
            {state.savedCreators.length > 0 && (
              <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Saved Creators
                </h3>
                <div className="space-y-4">
                  {Array.from(savedByGenre.entries())
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([genreName, ids]) => (
                      <div key={genreName}>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                          {genreName}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ids.map((id) => {
                            const creator = getCreatorById(id);
                            if (!creator) return null;
                            return (
                              <Link
                                key={id}
                                href={`/creators/${id}`}
                                className="px-3 py-1.5 bg-zinc-800/70 rounded-lg text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition"
                              >
                                {creator.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Progress */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Achievements
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Progress</span>
                  <span className="text-amber-400 font-medium">
                    {unlockedCount}/{totalAchievements}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(unlockedCount / totalAchievements) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {achievements.map((a) => {
                  const unlocked = unlockedIds.has(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        unlocked ? "bg-amber-500/10" : "opacity-50"
                      }`}
                    >
                      <span className="text-lg">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            unlocked ? "text-amber-400" : "text-zinc-500"
                          }`}
                        >
                          {a.name}
                        </p>
                        <p className="text-xs text-zinc-600 truncate">
                          {a.description}
                        </p>
                      </div>
                      {unlocked && (
                        <span className="text-xs text-amber-500">&#10003;</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link
                href="/profile"
                className="mt-4 block text-center text-sm text-amber-400 hover:text-amber-300 transition"
              >
                View Full Profile →
              </Link>
            </div>

            {/* Your Network Stats */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Your Network
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Saved Creators</span>
                  <span className="font-medium text-amber-400">
                    {state.savedCreators.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Liked Works</span>
                  <span className="font-medium text-amber-400">
                    {state.likedWorks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Explored</span>
                  <span className="font-medium text-amber-400">
                    {state.viewedCreators.length}
                  </span>
                </div>
                {state.streakData.currentStreak > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Current Streak</span>
                    <span className="font-medium text-amber-400">
                      {state.streakData.currentStreak} days
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Challenge */}
            <WeeklyChallenge />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>Built with ⚡ by Spark & Jeeves</p>
          <p className="mt-2">A prototype for tracking creative lineage</p>
        </div>
      </footer>
      <MobileBottomSpacer />
    </div>
  );
}
