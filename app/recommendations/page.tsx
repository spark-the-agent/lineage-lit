"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Network,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Users,
  ArrowRight,
  Lightbulb,
  GitBranch,
  Target,
  Clock,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Bookmark,
  Heart,
} from "lucide-react";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
  DesktopNav,
} from "@/app/components/MobileNav";
import { currentUser } from "@/lib/social";
import {
  generateRecommendations,
  submitFeedback,
  getRecommendationExplanation,
  getAllReasons,
  getRecommendationStats,
  Recommendation,
} from "@/lib/recommendations";
import type { Creator } from "@/lib/data";
import { useCreatorLookup } from "@/lib/use-convex-data";
import { usePersistence } from "@/app/components/PersistenceProvider";

export default function RecommendationsPage() {
  const getCreatorBySlug = useCreatorLookup();
  const [refreshKey, setRefreshKey] = useState(0);
  const [feedbackState, setFeedbackState] = useState<
    Record<string, "thumbs_up" | "thumbs_down">
  >({});
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(
    new Set(),
  );
  const [filterType, setFilterType] = useState<"all" | "creators" | "works">(
    "all",
  );
  const {
    state,
    toggleSavedCreator,
    toggleLikedWork,
    isCreatorSaved,
    isWorkLiked,
  } = usePersistence();

  // Build a dynamic user profile from persistence state for recommendations
  // refreshKey is read to force recomputation when the user clicks "refresh"
  const recommendations = useMemo(() => {
    void refreshKey;
    const dynamicUser = {
      ...currentUser,
      savedCreators: state.savedCreators,
      likedWorks: state.likedWorks,
    };
    return generateRecommendations(dynamicUser, 20);
  }, [refreshKey, state.savedCreators, state.likedWorks]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    if (filterType === "all") return recommendations;
    return recommendations.filter((r) => r.type === filterType.slice(0, -1));
  }, [recommendations, filterType]);

  // Get stats
  const stats = useMemo(
    () => getRecommendationStats(recommendations),
    [recommendations],
  );

  const handleFeedback = (
    rec: Recommendation,
    feedback: "thumbs_up" | "thumbs_down",
  ) => {
    const itemId = rec.type === "creator" ? rec.item.slug : rec.item.slug;
    submitFeedback(rec.id, itemId, rec.type, feedback);
    setFeedbackState((prev) => ({ ...prev, [rec.id]: feedback }));
  };

  const toggleReasons = (recId: string) => {
    setExpandedReasons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recId)) {
        newSet.delete(recId);
      } else {
        newSet.add(recId);
      }
      return newSet;
    });
  };

  const handleSaveCreator = (creatorId: string) => {
    toggleSavedCreator(creatorId);
  };

  const handleLikeWork = (workId: string) => {
    toggleLikedWork(workId);
  };

  const topRecommendations = filteredRecommendations.slice(0, 3);
  const moreRecommendations = filteredRecommendations.slice(3);

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="For You" />
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
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold">AI-Powered Recommendations</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Discover your next favorite read based on shared influences, genre
            overlap, era preferences, and lineage proximity. The more you
            explore, the better our recommendations get.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            value={stats.totalRecommendations}
            label="Recommendations"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            value={stats.creatorsRecommended}
            label="Creators"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            value={stats.worksRecommended}
            label="Works"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={`${stats.averageScore}%`}
            label="Avg Match"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {(["all", "creators", "works"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === type
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Top Picks */}
        {topRecommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Top Picks for You
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topRecommendations.map((rec) => (
                <TopRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  getCreatorBySlug={getCreatorBySlug}
                  feedback={feedbackState[rec.id]}
                  onFeedback={(f) => handleFeedback(rec, f)}
                  showReasons={expandedReasons.has(rec.id)}
                  onToggleReasons={() => toggleReasons(rec.id)}
                  isSaved={
                    rec.type === "creator"
                      ? isCreatorSaved(rec.item.slug)
                      : undefined
                  }
                  isLiked={
                    rec.type === "work" ? isWorkLiked(rec.item.slug) : undefined
                  }
                  onSave={() =>
                    rec.type === "creator" && handleSaveCreator(rec.item.slug)
                  }
                  onLike={() =>
                    rec.type === "work" && handleLikeWork(rec.item.slug)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* More Recommendations */}
        {moreRecommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              More Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {moreRecommendations.map((rec) => (
                <CompactRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  feedback={feedbackState[rec.id]}
                  onFeedback={(f) => handleFeedback(rec, f)}
                  isSaved={
                    rec.type === "creator"
                      ? isCreatorSaved(rec.item.slug)
                      : undefined
                  }
                  isLiked={
                    rec.type === "work" ? isWorkLiked(rec.item.slug) : undefined
                  }
                  onSave={() =>
                    rec.type === "creator" && handleSaveCreator(rec.item.slug)
                  }
                  onLike={() =>
                    rec.type === "work" && handleLikeWork(rec.item.slug)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <Sparkles className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">
              No recommendations yet
            </h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              Explore more creators and save your favorites to get personalized
              recommendations.
            </p>
            <Link
              href="/explore"
              className="inline-block mt-6 px-6 py-3 bg-amber-500 text-zinc-900 rounded-lg font-medium hover:bg-amber-400 transition"
            >
              Start Exploring
            </Link>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16 bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            How Our AI Recommends
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <HowItWorksStep
              icon={<GitBranch className="w-6 h-6" />}
              title="Shared Influences"
              description="We find creators who influenced your favorites, or were influenced by them"
            />
            <HowItWorksStep
              icon={<BookOpen className="w-6 h-6" />}
              title="Genre Overlap"
              description="Matching your preferred genres with creators who excel in them"
            />
            <HowItWorksStep
              icon={<Clock className="w-6 h-6" />}
              title="Era Preferences"
              description="Recommending works from the time periods you enjoy most"
            />
            <HowItWorksStep
              icon={<Users className="w-6 h-6" />}
              title="Lineage Proximity"
              description="Finding second and third-degree connections in the influence graph"
            />
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

function TopRecommendationCard({
  recommendation,
  getCreatorBySlug,
  feedback,
  onFeedback,
  showReasons,
  onToggleReasons,
  isSaved,
  isLiked,
  onSave,
  onLike,
}: {
  recommendation: Recommendation;
  getCreatorBySlug: (slug: string) => Creator | undefined;
  feedback?: "thumbs_up" | "thumbs_down";
  onFeedback: (feedback: "thumbs_up" | "thumbs_down") => void;
  showReasons: boolean;
  onToggleReasons: () => void;
  isSaved?: boolean;
  isLiked?: boolean;
  onSave?: () => void;
  onLike?: () => void;
}) {
  const isCreator = recommendation.type === "creator";
  const item = recommendation.item;
  const creator = isCreator
    ? (item as Creator)
    : getCreatorBySlug(recommendation.creatorSlug || "");

  const mainText = getRecommendationExplanation(recommendation);
  const allReasons = getAllReasons(recommendation);

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-amber-500/30 transition group hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isCreator
                ? "bg-amber-500/20 text-amber-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {isCreator ? "Creator" : "Work"}
          </span>
          <span className="text-xs text-zinc-500">
            {recommendation.score}% match
          </span>
        </div>
        <div className="flex gap-1">
          {isCreator && onSave && (
            <button
              onClick={onSave}
              className={`p-2 rounded-lg transition ${
                isSaved
                  ? "text-amber-400 bg-amber-500/10"
                  : "text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
              />
            </button>
          )}
          {!isCreator && onLike && (
            <button
              onClick={onLike}
              className={`p-2 rounded-lg transition ${
                isLiked
                  ? "text-red-400 bg-red-500/10"
                  : "text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-amber-400 transition">
          {isCreator
            ? (item as { name: string }).name
            : (item as { title: string }).title}
        </h3>
        {!isCreator && creator && (
          <p className="text-sm text-zinc-500">
            by {(creator as { name: string }).name}
          </p>
        )}
        {isCreator && (
          <p className="text-sm text-zinc-500">
            {(item as { years: string }).years}
          </p>
        )}
      </div>

      {/* Why Recommended */}
      <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
        <p className="text-sm text-zinc-300">
          <span className="text-amber-400 font-medium">Why: </span>
          {mainText}
        </p>
        {allReasons.length > 1 && (
          <button
            onClick={onToggleReasons}
            className="mt-2 text-xs text-zinc-500 hover:text-amber-400 transition"
          >
            {showReasons
              ? "Hide details"
              : `+${allReasons.length - 1} more reasons`}
          </button>
        )}
        {showReasons && allReasons.length > 1 && (
          <div className="mt-3 pt-3 border-t border-zinc-700 space-y-2">
            {allReasons.slice(1).map((reason, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    reason.strength === "strong"
                      ? "bg-green-400"
                      : reason.strength === "medium"
                        ? "bg-yellow-400"
                        : "bg-zinc-500"
                  }`}
                />
                <span className="text-zinc-400">{reason.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={
            isCreator
              ? `/creators/${item.slug}`
              : `/creators/${recommendation.creatorSlug}`
          }
          className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition"
        >
          Explore
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex gap-2">
          <button
            onClick={() => onFeedback("thumbs_up")}
            className={`p-2 rounded-lg transition ${
              feedback === "thumbs_up"
                ? "bg-green-500/20 text-green-400"
                : "text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 ${feedback === "thumbs_up" ? "fill-current" : ""}`}
            />
          </button>
          <button
            onClick={() => onFeedback("thumbs_down")}
            className={`p-2 rounded-lg transition ${
              feedback === "thumbs_down"
                ? "bg-red-500/20 text-red-400"
                : "text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <ThumbsDown
              className={`w-4 h-4 ${feedback === "thumbs_down" ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompactRecommendationCard({
  recommendation,
  feedback,
  onFeedback,
  isSaved,
  isLiked,
  onSave,
  onLike,
}: {
  recommendation: Recommendation;
  feedback?: "thumbs_up" | "thumbs_down";
  onFeedback: (feedback: "thumbs_up" | "thumbs_down") => void;
  isSaved?: boolean;
  isLiked?: boolean;
  onSave?: () => void;
  onLike?: () => void;
}) {
  const isCreator = recommendation.type === "creator";
  const item = recommendation.item;
  // const creator = isCreator
  //   ? item
  //   : getCreatorBySlug(recommendation.creatorSlug || "");

  const mainReason = getRecommendationExplanation(recommendation);

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-4">
      {/* Score */}
      <div className="shrink-0 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
        <span className="text-sm font-bold text-amber-400">
          {recommendation.score}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-zinc-200 truncate">
            {isCreator
              ? (item as { name: string }).name
              : (item as { title: string }).title}
          </h4>
          <span
            className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] ${
              isCreator
                ? "bg-amber-500/10 text-amber-400"
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            {isCreator ? "Creator" : "Work"}
          </span>
        </div>
        <p className="text-xs text-zinc-500 truncate">{mainReason}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {isCreator && onSave && (
          <button
            onClick={onSave}
            className={`p-2 rounded-lg transition ${
              isSaved ? "text-amber-400" : "text-zinc-500 hover:text-amber-400"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        )}
        {!isCreator && onLike && (
          <button
            onClick={onLike}
            className={`p-2 rounded-lg transition ${
              isLiked ? "text-red-400" : "text-zinc-500 hover:text-red-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        )}
        <Link
          href={
            isCreator
              ? `/creators/${item.slug}`
              : `/creators/${recommendation.creatorSlug}`
          }
          className="p-2 text-zinc-500 hover:text-amber-400 transition"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onFeedback("thumbs_up")}
          className={`p-2 rounded-lg transition ${
            feedback === "thumbs_up"
              ? "text-green-400"
              : "text-zinc-500 hover:text-green-400"
          }`}
        >
          <ThumbsUp
            className={`w-4 h-4 ${feedback === "thumbs_up" ? "fill-current" : ""}`}
          />
        </button>
        <button
          onClick={() => onFeedback("thumbs_down")}
          className={`p-2 rounded-lg transition ${
            feedback === "thumbs_down"
              ? "text-red-400"
              : "text-zinc-500 hover:text-red-400"
          }`}
        >
          <ThumbsDown
            className={`w-4 h-4 ${feedback === "thumbs_down" ? "fill-current" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <div className="text-amber-400 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}

function HowItWorksStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  );
}
