"use client";

import { useState, useMemo } from "react";
import { creators, Creator } from "@/lib/data";
import {
  Network,
  BookOpen,
  Film,
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
} from "@/app/components/MobileNav";
import { DesktopNav } from "@/app/components/MobileNav";
import ExportNetworkButton from "@/app/components/ExportNetworkButton";
import DegreeBadge from "@/app/components/DegreeBadge";
import { creatorGenres, creatorEras, eraFilters, type EraFilter } from "@/lib/filters";

type SortOption = "alpha" | "connections" | "chronological";
type MediumFilter = "all" | "book" | "screenplay";

// Top-level genres to show as chips (most useful for discovery)
const GENRE_CHIPS = [
  "Literary Fiction",
  "Science Fiction",
  "Southern Gothic",
  "Minimalism",
  "Screenwriting",
  "Fantasy",
  "Magical Realism",
  "Postmodernism",
  "African American Literature",
  "Dystopia",
  "Poetry",
  "Memoir",
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [era, setEra] = useState<EraFilter | null>(null);
  const [medium, setMedium] = useState<MediumFilter>("all");
  const [sort, setSort] = useState<SortOption>("alpha");
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    let results = [...creators];

    // Search by name and bio
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q),
      );
    }

    // Genre filter
    if (genre) {
      results = results.filter((c) => {
        const genres = creatorGenres[c.id] || [];
        return genres.includes(genre);
      });
    }

    // Era filter
    if (era) {
      const eraConfig = eraFilters.find((e) => e.label === era);
      if (eraConfig) {
        results = results.filter((c) => {
          const creatorEra = creatorEras[c.id];
          return creatorEra && eraConfig.match(creatorEra);
        });
      }
    }

    // Medium filter
    if (medium !== "all") {
      results = results.filter((c) =>
        c.works.some((w) => w.type === medium),
      );
    }

    // Sort
    switch (sort) {
      case "alpha":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "connections":
        results.sort(
          (a, b) =>
            b.influenced.length +
            b.influencedBy.length -
            (a.influenced.length + a.influencedBy.length),
        );
        break;
      case "chronological":
        results.sort((a, b) => {
          const yearA = parseInt(a.years.match(/\d{4}/)?.[0] || "0");
          const yearB = parseInt(b.years.match(/\d{4}/)?.[0] || "0");
          return yearA - yearB;
        });
        break;
    }

    return results;
  }, [query, genre, era, medium, sort]);

  const hasActiveFilters = query || genre || era || medium !== "all";

  function clearAllFilters() {
    setQuery("");
    setGenre(null);
    setEra(null);
    setMedium("all");
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Explore Creators" />
      <MobileHeaderSpacer />

      {/* Header */}
      <header className="border-b border-zinc-800/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <DesktopNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Explore Creators
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Discover writers and their creative lineage
            </p>
          </div>
          <ExportNetworkButton />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or bio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter toggle for mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-3 sm:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? "Hide filters" : "Show filters"}
        </button>

        {/* Filters */}
        <div className={`space-y-3 mb-6 ${showFilters ? "" : "hidden sm:block"}`}>
          {/* Genre chips */}
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGenre(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  !genre
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All Genres
              </button>
              {GENRE_CHIPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(genre === g ? null : g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    genre === g
                      ? "bg-amber-500 text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Era chips */}
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEra(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  !era
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All Eras
              </button>
              {eraFilters.map((e) => (
                <button
                  key={e.label}
                  onClick={() => setEra(era === e.label ? null : e.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    era === e.label
                      ? "bg-amber-500 text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medium + Sort row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {(
                [
                  ["all", "All"],
                  ["book", "Books"],
                  ["screenplay", "Screenplays"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setMedium(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    medium === value
                      ? "bg-amber-500 text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-zinc-700 focus:outline-none focus:border-amber-500/50"
              >
                <option value="alpha">A-Z</option>
                <option value="connections">Most Connections</option>
                <option value="chronological">Chronological</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">
            Showing {filtered.length} of {creators.length} creators
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-amber-400 hover:text-amber-300 transition"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Grid or empty state */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">
              No creators found
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg font-medium hover:bg-amber-400 transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <MobileBottomSpacer />
    </div>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  const influencedCount = creator.influenced.length;
  const influencedByCount = creator.influencedBy.length;

  return (
    <Link href={`/creators/${creator.id}`} className="block">
      <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800 hover:border-amber-500/50 transition group h-full hover-lift">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-amber-400 group-hover:text-amber-300 transition truncate">
                {creator.name}
              </h3>
              <DegreeBadge creatorId={creator.id} />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500">{creator.years}</p>
          </div>
          <div className="flex gap-1 sm:gap-2 shrink-0 ml-2">
            {creator.works.some((w) => w.type === "book") && (
              <BookOpen className="w-4 h-4 text-zinc-600" />
            )}
            {creator.works.some((w) => w.type === "screenplay") && (
              <Film className="w-4 h-4 text-zinc-600" />
            )}
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{creator.bio}</p>

        <div className="flex items-center gap-2 sm:gap-4 text-xs text-zinc-500 flex-wrap">
          <span>{creator.works.length} works</span>
          {influencedByCount > 0 && (
            <span className="text-zinc-600">
              ← {influencedByCount} influences
            </span>
          )}
          {influencedCount > 0 && (
            <span className="text-amber-500/70">
              → {influencedCount} influenced
            </span>
          )}
        </div>

        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-sm text-amber-400/70 group-hover:text-amber-400 transition">
          <span>View lineage</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
