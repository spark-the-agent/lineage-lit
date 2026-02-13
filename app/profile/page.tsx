"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Network,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Share2,
  Bookmark,
  Heart,
  Edit3,
  MapPin,
  ExternalLink,
  UserPlus,
} from "lucide-react";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
  DesktopNav,
} from "../components/MobileNav";
import { useCreators, useCreatorLookup } from "@/lib/use-convex-data";
import { computeDNAFromState } from "@/lib/compute-dna";
import LineageGraph from "../components/LineageGraph";
import ShareableCard from "../components/ShareableCard";
import AchievementGrid from "../components/AchievementGrid";
import EditProfileModal from "../components/EditProfileModal";
import { usePersistence } from "../components/PersistenceProvider";

export default function ProfilePage() {
  const creators = useCreators();
  const getCreatorBySlug = useCreatorLookup();
  const [activeTab, setActiveTab] = useState<
    "overview" | "saved" | "dna" | "achievements"
  >("overview");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    state,
    userProfile,
    updateUserProfile,
    toggleSavedCreator,
    isCreatorSaved,
  } = usePersistence();

  const savedCreatorsList = state.savedCreators
    .map((id) => getCreatorBySlug(id))
    .filter(Boolean);
  const dynamicDNA = computeDNAFromState(state);
  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(userProfile.avatarSeed)}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Profile" />
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
        {/* Profile Header */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-amber-500 to-orange-600 p-1">
                <img
                  src={avatarUrl}
                  alt={userProfile.displayName}
                  className="w-full h-full rounded-full bg-zinc-900"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">
                    {userProfile.displayName}
                  </h1>
                  <p className="text-zinc-500">@{userProfile.username}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              <p className="text-zinc-400 mt-4 max-w-2xl">{userProfile.bio}</p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Literary Explorer</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{state.likedWorks.length} works liked</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6 pt-6 border-t border-zinc-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {state.followedUsers.length}
                  </div>
                  <div className="text-sm text-zinc-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {savedCreatorsList.length}
                  </div>
                  <div className="text-sm text-zinc-500">Saved Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {state.likedWorks.length}
                  </div>
                  <div className="text-sm text-zinc-500">Works Liked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 border-b border-zinc-800 overflow-x-auto">
          {(["overview", "saved", "dna", "achievements"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 sm:px-6 sm:py-3 text-sm font-medium capitalize transition border-b-2 -mb-[2px] whitespace-nowrap ${
                  activeTab === tab
                    ? "text-amber-400 border-amber-400"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                {tab === "dna" ? "Reading DNA" : tab}
              </button>
            ),
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats Row */}
            <div className="grid md:grid-cols-4 gap-4">
              <QuickStat
                icon={<TrendingUp className="w-5 h-5" />}
                value={`${dynamicDNA.influenceScore}%`}
                label="Influence Score"
                description="Well-connected reader"
              />
              <QuickStat
                icon={<Award className="w-5 h-5" />}
                value={dynamicDNA.literaryDNA[0] || "Explorer"}
                label="Primary Style"
                description="Based on your reading"
              />
              <QuickStat
                icon={<BookOpen className="w-5 h-5" />}
                value={String(dynamicDNA.totalAuthors)}
                label="Unique Authors"
                description="Across all genres"
              />
              <QuickStat
                icon={<Heart className="w-5 h-5" />}
                value={String(state.likedWorks.length)}
                label="Liked Works"
                description="Your favorites"
              />
            </div>

            {/* Literary DNA Preview */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Your Literary DNA
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {dynamicDNA.literaryDNA.map((trait) => (
                  <span
                    key={trait}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Genre Breakdown */}
              <div className="space-y-3">
                {dynamicDNA.favoriteGenres.map((genre) => (
                  <div key={genre.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">{genre.name}</span>
                      <span className="text-zinc-500">{genre.percentage}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Your Top Authors
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dynamicDNA.topAuthors.map((authorId) => {
                  const author = getCreatorBySlug(authorId);
                  if (!author) return null;
                  return (
                    <Link
                      key={authorId}
                      href={`/creators/${authorId}`}
                      className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-amber-500/50 transition group"
                    >
                      <h4 className="font-medium text-zinc-200 group-hover:text-amber-400 transition">
                        {author.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        {author.years}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-amber-400" />
                Recently Viewed
              </h3>
              <div className="flex flex-wrap gap-3">
                {dynamicDNA.recentlyViewed.map((creatorId) => {
                  const creator = getCreatorBySlug(creatorId);
                  if (!creator) return null;
                  return (
                    <Link
                      key={creatorId}
                      href={`/creators/${creatorId}`}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {creator.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="space-y-8">
            {/* Saved Creators */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                Saved Creators ({savedCreatorsList.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCreatorsList.map((creator) => {
                  if (!creator) return null;
                  return (
                    <div
                      key={creator.slug}
                      className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-amber-500/50 transition hover-lift"
                    >
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/creators/${creator.slug}`}
                          className="flex-1"
                        >
                          <h4 className="font-medium text-zinc-200 hover:text-amber-400 transition">
                            {creator.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">
                            {creator.years}
                          </p>
                          <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                            {creator.bio}
                          </p>
                        </Link>
                        <button
                          onClick={() => toggleSavedCreator(creator.slug)}
                          className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Remove from saved"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3 text-xs text-zinc-500">
                        <span>{creator.works.length} works</span>
                        <span>•</span>
                        <span>{creator.influenced.length} influenced</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested Creators to Save */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                You Might Like
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creators
                  .filter((c) => !isCreatorSaved(c.slug))
                  .slice(0, 3)
                  .map((creator) => (
                    <div
                      key={creator.slug}
                      className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition"
                    >
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/creators/${creator.slug}`}
                          className="flex-1"
                        >
                          <h4 className="font-medium text-zinc-200 hover:text-amber-400 transition">
                            {creator.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">
                            {creator.years}
                          </p>
                        </Link>
                        <button
                          onClick={() => toggleSavedCreator(creator.slug)}
                          className="p-2 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                          title="Save creator"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "dna" && (
          <div className="space-y-8">
            {/* Full Reading DNA */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    Your Complete Reading DNA
                  </h2>
                  <p className="text-zinc-400 mt-1">
                    Based on {dynamicDNA.totalBooks} books across{" "}
                    {dynamicDNA.totalAuthors} authors
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
                >
                  <Share2 className="w-4 h-4" />
                  Share DNA
                </button>
              </div>

              {/* Literary DNA Badges */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">
                  Your Literary DNA
                </h3>
                <div className="flex flex-wrap gap-3">
                  {dynamicDNA.literaryDNA.map((trait, i) => (
                    <span
                      key={trait}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8">
                <DNACard
                  icon={<BookOpen className="w-5 h-5" />}
                  value={dynamicDNA.totalBooks}
                  label="Books Read"
                  trend={`${state.likedWorks.length} liked`}
                />
                <DNACard
                  icon={<Users className="w-5 h-5" />}
                  value={dynamicDNA.totalAuthors}
                  label="Unique Authors"
                  trend={`${state.savedCreators.length} saved`}
                />
                <DNACard
                  icon={<Award className="w-5 h-5" />}
                  value={`${dynamicDNA.influenceScore}%`}
                  label="Influence Score"
                  trend="Well-connected"
                />
                <DNACard
                  icon={<TrendingUp className="w-5 h-5" />}
                  value={`${state.viewedCreators.length}`}
                  label="Explored"
                  trend="Creators viewed"
                />
              </div>

              {/* Genre Breakdown */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">
                  Genre Breakdown
                </h3>
                <div className="space-y-4">
                  {dynamicDNA.favoriteGenres.map((genre) => (
                    <div key={genre.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-300">{genre.name}</span>
                        <span className="text-zinc-500">
                          {genre.percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                          style={{ width: `${genre.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Era Timeline */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">
                  Reading by Era
                </h3>
                <div className="flex gap-4">
                  {dynamicDNA.eraBreakdown.map((era) => (
                    <div
                      key={era.era}
                      className="flex-1 bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700 hover:border-amber-500/30 transition"
                    >
                      <div className="text-2xl font-bold text-amber-400">
                        {era.count}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {era.era}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Your Influence Network */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-amber-400" />
                Your Influence Network
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Visualize the connections between your favorite creators and
                discover new ones.
              </p>
              <LineageGraph
                creators={savedCreatorsList.filter(
                  (c): c is NonNullable<typeof c> => c !== undefined,
                )}
              />
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-8">
            <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Achievements
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Unlock achievements by exploring the literary network
              </p>
              <AchievementGrid />
            </div>
          </div>
        )}
      </main>

      {/* Shareable DNA Card */}
      {showShareModal && (
        <ShareableCard
          data={{
            displayName: userProfile.displayName,
            username: userProfile.username,
            readingDNA: dynamicDNA,
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          currentProfile={userProfile}
          onSave={updateUserProfile}
          onClose={() => setShowEditModal(false)}
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

function QuickStat({
  icon,
  value,
  label,
  description,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <div className="text-amber-400 mb-2">{icon}</div>
      <div className="text-xl font-bold text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
      <div className="text-xs text-amber-500/70 mt-1">{description}</div>
    </div>
  );
}

function DNACard({
  icon,
  value,
  label,
  trend,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend: string;
}) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-800">
      <div className="text-amber-400 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
      <div className="text-xs text-amber-500/70 mt-1">{trend}</div>
    </div>
  );
}
