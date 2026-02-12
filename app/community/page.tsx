/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Network,
  Users,
  Share2,
  UserPlus,
  UserCheck,
  Search,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
  DesktopNav,
} from "@/app/components/MobileNav";
import {
  currentUser,
  mockUsers,
  getActivityFeed,
  formatTimeAgo,
  getActivityIcon,
  getActivityText,
  Activity,
} from "@/lib/social";
import { getCreatorById } from "@/lib/data";
import { computeDNAFromState } from "@/lib/compute-dna";
import Leaderboard from "@/app/components/Leaderboard";
import DNAComparison from "@/app/components/DNAComparison";
import WeeklyChallenge from "@/app/components/WeeklyChallenge";
import { usePersistence } from "@/app/components/PersistenceProvider";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "people">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [comparingUser, setComparingUser] = useState<
    (typeof mockUsers)[0] | null
  >(null);
  const { state, userProfile, isUserFollowed, toggleFollowedUser } =
    usePersistence();

  const activityFeed = getActivityFeed(currentUser.id);
  const myDNA = computeDNAFromState(state);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFollowToggle = (userId: string) => {
    toggleFollowedUser(userId);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Community" />
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
            <Users className="w-8 h-8 text-amber-400" />
            Community
          </h1>
          <p className="text-zinc-400 mt-2">
            Connect with fellow readers and discover what they&apos;re exploring
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-800">
              {(["feed", "people"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 -mb-[2px] ${
                    activeTab === tab
                      ? "text-amber-400 border-amber-400"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {tab === "feed" ? "Activity Feed" : "People"}
                </button>
              ))}
            </div>

            {activeTab === "feed" ? (
              <div className="space-y-4">
                {/* Your Recent Explorations (from persistence data) */}
                {state.viewedCreators.length > 0 && (
                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                    <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                      Your Recent Explorations
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {state.viewedCreators
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 8)
                        .map((v) => {
                          const creator = getCreatorById(v.id);
                          if (!creator) return null;
                          return (
                            <Link
                              key={v.id}
                              href={`/creators/${v.id}`}
                              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/70 rounded-lg text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {creator.name}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Activity Feed */}
                {activityFeed.length > 0 ? (
                  activityFeed.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                    <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-400">
                      No activity yet
                    </h3>
                    <p className="text-zinc-500 text-sm mt-2">
                      Start following people to see their activity here
                    </p>
                    <button
                      onClick={() => setActiveTab("people")}
                      className="mt-4 px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg font-medium hover:bg-amber-400 transition"
                    >
                      Discover People
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* People List */}
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      isFollowing={isUserFollowed(user.id) || false}
                      onFollowToggle={() => handleFollowToggle(user.id)}
                      onCompare={() => setComparingUser(user)}
                    />
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-zinc-500">
                      No users found matching &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Network Stats */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Your Network
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Following</span>
                  <span className="font-medium text-amber-400">
                    {state.followedUsers.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Saved Creators</span>
                  <span className="font-medium text-amber-400">
                    {state.savedCreators.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Explored</span>
                  <span className="font-medium text-amber-400">
                    {state.viewedCreators.length}
                  </span>
                </div>
              </div>
              <Link
                href="/profile"
                className="mt-4 block text-center text-sm text-amber-400 hover:text-amber-300 transition"
              >
                View Your Profile →
              </Link>
            </div>

            {/* Suggested People */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Suggested for You
              </h3>
              <div className="space-y-3">
                {mockUsers
                  .filter(
                    (u) => !isUserFollowed(u.id) && u.id !== currentUser.id,
                  )
                  .slice(0, 3)
                  .map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full bg-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-200 truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          @{user.username}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Trending in Community */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Trending Now
              </h3>
              <div className="space-y-3">
                <TrendingItem rank={1} name="Ted Chiang" change="+45 readers" />
                <TrendingItem
                  rank={2}
                  name="The Iceberg Theory"
                  change="+32 discussions"
                />
                <TrendingItem
                  rank={3}
                  name="Southern Gothic"
                  change="+28 mentions"
                />
              </div>
            </div>

            {/* Weekly Challenge */}
            <WeeklyChallenge />

            {/* Leaderboard */}
            <Leaderboard />

            {/* Quick Share */}
            <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-400">
                <Share2 className="w-5 h-5" />
                Share Your Lineage
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Share your favorite creators and help others discover great
                literature.
              </p>
              <Link
                href="/profile"
                className="block w-full text-center px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg font-medium hover:bg-amber-400 transition"
              >
                Share Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* DNA Comparison Modal */}
      {comparingUser && (
        <DNAComparison
          userA={{ name: userProfile.displayName, dna: myDNA }}
          userB={{
            name: comparingUser.displayName,
            dna: comparingUser.readingDNA,
          }}
          onClose={() => setComparingUser(null)}
        />
      )}

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

function ActivityCard({ activity }: { activity: Activity }) {
  const user =
    activity.userId === currentUser.id
      ? currentUser
      : mockUsers.find((u) => u.id === activity.userId);

  if (!user) return null;

  const icon = getActivityIcon(activity.type);
  const text = getActivityText(activity);
  const timeAgo = formatTimeAgo(activity.timestamp);

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition">
      <div className="flex items-start gap-4">
        <Link href={`/profile`}>
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-10 h-10 rounded-full bg-zinc-800 hover:ring-2 hover:ring-amber-500/50 transition"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-zinc-200">
            <span className="font-medium text-amber-400">
              {user.displayName}
            </span>{" "}
            {text.replace(user.displayName, "")}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
            <span>{timeAgo}</span>
            <span className="text-xl leading-none">{icon}</span>
          </div>
        </div>
        {activity.targetType === "creator" && (
          <Link
            href={`/creators/${activity.targetId}`}
            className="text-xs px-3 py-1 bg-zinc-800 rounded-full text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}

function UserCard({
  user,
  isFollowing,
  onFollowToggle,
  onCompare,
}: {
  user: (typeof mockUsers)[0];
  isFollowing: boolean;
  onFollowToggle: () => void;
  onCompare: () => void;
}) {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition">
      <div className="flex items-start gap-4">
        <img
          src={user.avatar}
          alt={user.displayName}
          className="w-12 h-12 rounded-full bg-zinc-800"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-zinc-200">{user.displayName}</h4>
              <p className="text-xs text-zinc-500">@{user.username}</p>
            </div>
            <button
              onClick={onFollowToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isFollowing
                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  : "bg-amber-500 text-zinc-900 hover:bg-amber-400"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{user.bio}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
            <span>{user.readingDNA.totalBooks} books</span>
            <span>{user.followers.length} followers</span>
            <span className="text-amber-500/70">
              {user.readingDNA.literaryDNA.slice(0, 2).join(", ")}
            </span>
            <button
              onClick={onCompare}
              className="ml-auto text-xs text-amber-400/70 hover:text-amber-400 transition"
            >
              Compare DNA
            </button>
          </div>

          {/* Recent Activity Preview */}
          <div className="flex flex-wrap gap-2 mt-3">
            {user.readingDNA.topAuthors.slice(0, 3).map((authorId) => {
              const author = getCreatorById(authorId);
              if (!author) return null;
              return (
                <Link
                  key={authorId}
                  href={`/creators/${authorId}`}
                  className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 hover:text-amber-400 transition"
                >
                  {author.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingItem({
  rank,
  name,
  change,
}: {
  rank: number;
  name: string;
  change: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
          rank === 1
            ? "bg-amber-500 text-zinc-900"
            : rank === 2
              ? "bg-zinc-600 text-zinc-200"
              : rank === 3
                ? "bg-amber-700 text-zinc-200"
                : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {rank}
      </span>
      <div className="flex-1">
        <p className="font-medium text-zinc-200 text-sm">{name}</p>
        <p className="text-xs text-amber-500/70">{change}</p>
      </div>
    </div>
  );
}
