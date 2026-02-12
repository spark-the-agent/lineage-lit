"use client";

import {
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Share2,
  Import,
  Download,
} from "lucide-react";
import Link from "next/link";
import { downloadJSON } from "@/lib/export";
import { creators } from "@/lib/data";

interface ReadingStats {
  totalBooks: number;
  totalAuthors: number;
  favoriteGenres: { name: string; percentage: number }[];
  eraBreakdown: { era: string; count: number }[];
  influenceScore: number;
  literaryDNA: string[];
}

export default function ReadingDNA() {
  // Mock data - in real app, this comes from user's reading history
  const stats: ReadingStats = {
    totalBooks: 47,
    totalAuthors: 32,
    favoriteGenres: [
      { name: "Literary Fiction", percentage: 40 },
      { name: "Science Fiction", percentage: 30 },
      { name: "Screenwriting", percentage: 15 },
      { name: "Philosophy", percentage: 15 },
    ],
    eraBreakdown: [
      { era: "1920s-1950s", count: 12 },
      { era: "1960s-1980s", count: 18 },
      { era: "1990s-2010s", count: 17 },
    ],
    influenceScore: 78,
    literaryDNA: ["Modernist", "Speculative", "Minimalist", "Humanist"],
  };

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            Your Reading DNA
          </h2>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">
            Based on 47 books across 32 authors
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/import"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-500/10 text-amber-400 rounded-lg text-sm hover:bg-amber-500/20 transition min-h-[44px]"
          >
            <Import className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </Link>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition min-h-[44px]">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Literary DNA Badges */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">
          Your Literary DNA
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {stats.literaryDNA.map((trait, i) => (
            <span
              key={trait}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatCard
          icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
          value={stats.totalBooks}
          label="Books Read"
          trend="+12 this year"
        />
        <StatCard
          icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
          value={stats.totalAuthors}
          label="Unique Authors"
          trend="8 new discoveries"
        />
        <StatCard
          icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
          value={`${stats.influenceScore}%`}
          label="Influence Score"
          trend="Well-connected"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
          value="Top 15%"
          label="Active Reader"
          trend="vs. all users"
        />
      </div>

      {/* Genre Breakdown */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 mb-3 sm:mb-4 uppercase tracking-wider">
          Genre Breakdown
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {stats.favoriteGenres.map((genre) => (
            <div key={genre.name}>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-zinc-300">{genre.name}</span>
                <span className="text-zinc-500">{genre.percentage}%</span>
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
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 mb-3 sm:mb-4 uppercase tracking-wider">
          Reading by Era
        </h3>
        <div className="flex gap-2 sm:gap-4">
          {stats.eraBreakdown.map((era) => (
            <div
              key={era.era}
              className="flex-1 bg-zinc-800/50 rounded-lg p-3 sm:p-4 text-center border border-zinc-700 hover:border-amber-500/30 transition"
            >
              <div className="text-xl sm:text-2xl font-bold text-amber-400">
                {era.count}
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-500 mt-1">
                {era.era}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Influence Network */}
      <div className="bg-zinc-800/30 rounded-xl p-4 sm:p-6 border border-zinc-800 mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 mb-3 sm:mb-4 uppercase tracking-wider">
          Your Influence Network
        </h3>
        <p className="text-zinc-400 text-sm mb-4">
          Your reading connects to{" "}
          <span className="text-amber-400">156 creators</span> through influence
          chains. You&apos;re most connected to the{" "}
          <span className="text-amber-400">Modernist → Minimalist</span>{" "}
          lineage.
        </p>
        <Link
          href="/lineage"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition"
        >
          Explore your network
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/explore"
          className="flex-1 bg-amber-500 text-zinc-900 font-semibold py-3 sm:py-4 rounded-lg text-center hover:bg-amber-400 transition min-h-[48px] flex items-center justify-center"
        >
          Discover Your Next Read
        </Link>
        <button
          onClick={() => downloadJSON(creators)}
          className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 border border-zinc-700 rounded-lg text-zinc-300 hover:border-zinc-500 transition min-h-[48px]"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>
    </div>
  );
}

function StatCard({
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
    <div className="bg-zinc-800/50 rounded-xl p-3 sm:p-4 border border-zinc-800">
      <div className="text-amber-400 mb-1 sm:mb-2">{icon}</div>
      <div className="text-xl sm:text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">
        {label}
      </div>
      <div className="text-[10px] sm:text-xs text-amber-500/70 mt-0.5 sm:mt-1">
        {trend}
      </div>
    </div>
  );
}
