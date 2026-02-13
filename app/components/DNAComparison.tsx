"use client";

import { X, Sparkles } from "lucide-react";
import { ReadingDNA } from "@/lib/social";
import { compareDNA } from "@/lib/dna-comparison";
import { useCreatorLookup } from "@/lib/use-convex-data";

interface DNAComparisonProps {
  userA: { name: string; dna: ReadingDNA };
  userB: { name: string; dna: ReadingDNA };
  onClose: () => void;
}

export default function DNAComparison({
  userA,
  userB,
  onClose,
}: DNAComparisonProps) {
  const getCreatorBySlug = useCreatorLookup();
  const result = compareDNA(userA.dna, userB.dna);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl p-6 max-w-2xl w-full border border-zinc-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            DNA Comparison
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Overall similarity */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-amber-400 mb-2">
            {result.overallSimilarity}%
          </div>
          <p className="text-zinc-400 text-sm">
            Literary DNA similarity between {userA.name} and {userB.name}
          </p>
        </div>

        {/* Shared traits */}
        {result.sharedTraits.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Shared Traits
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.sharedTraits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unique traits */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Unique to {userA.name}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {result.uniqueA.map((trait) => (
                <span
                  key={trait}
                  className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-400"
                >
                  {trait}
                </span>
              ))}
              {result.uniqueA.length === 0 && (
                <span className="text-xs text-zinc-600">None</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Unique to {userB.name}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {result.uniqueB.map((trait) => (
                <span
                  key={trait}
                  className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-400"
                >
                  {trait}
                </span>
              ))}
              {result.uniqueB.length === 0 && (
                <span className="text-xs text-zinc-600">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Genre comparison bars */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Genre Comparison
          </h4>
          <div className="space-y-3">
            {result.genreOverlap.map((genre) => (
              <div key={genre.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">{genre.name}</span>
                  <span className="text-zinc-500">
                    {genre.percentA}% / {genre.percentB}%
                  </span>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${genre.percentA}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${genre.percentB}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              {userA.name}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              {userB.name}
            </div>
          </div>
        </div>

        {/* Shared Authors */}
        {result.sharedAuthors.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Shared Top Authors
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.sharedAuthors.map((slug) => {
                const author = getCreatorBySlug(slug);
                return (
                  <span
                    key={slug}
                    className="px-3 py-1.5 bg-zinc-800 rounded-lg text-xs text-zinc-300"
                  >
                    {author?.name || slug}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
