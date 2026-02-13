"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Network, Zap, Share2, RotateCcw, Check } from "lucide-react";
import Link from "next/link";
import { useCreators, useCreatorLookup } from "@/lib/use-convex-data";
import { findPath } from "@/lib/path-finder";
import PathAnimation from "@/app/components/PathAnimation";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
  DesktopNav,
} from "@/app/components/MobileNav";

export default function SixDegreesPage() {
  return (
    <Suspense>
      <SixDegreesContent />
    </Suspense>
  );
}

function getInitialParamsState(
  searchParams: ReturnType<typeof useSearchParams>,
  getCreatorBySlug: ReturnType<typeof useCreatorLookup>,
) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from && to && getCreatorBySlug(from) && getCreatorBySlug(to)) {
    return { from, to, result: findPath(from, to), searched: true };
  }
  return { from: "", to: "", result: null, searched: false };
}

function SixDegreesContent() {
  const creators = useCreators();
  const getCreatorBySlug = useCreatorLookup();
  const searchParams = useSearchParams();
  const initial = getInitialParamsState(searchParams, getCreatorBySlug);
  const [fromId, setFromId] = useState(initial.from);
  const [toId, setToId] = useState(initial.to);
  const [result, setResult] = useState<ReturnType<typeof findPath>>(
    initial.result,
  );
  const [searched, setSearched] = useState(initial.searched);
  const [copied, setCopied] = useState(false);

  const handleFind = () => {
    if (!fromId || !toId) return;
    const path = findPath(fromId, toId);
    setResult(path);
    setSearched(true);
    // Update URL for shareability without full navigation
    const url = new URL(window.location.href);
    url.searchParams.set("from", fromId);
    url.searchParams.set("to", toId);
    window.history.replaceState({}, "", url.toString());
  };

  const handleReset = () => {
    setFromId("");
    setToId("");
    setResult(null);
    setSearched(false);
    setCopied(false);
    // Clean URL params
    const url = new URL(window.location.href);
    url.searchParams.delete("from");
    url.searchParams.delete("to");
    window.history.replaceState({}, "", url.toString());
  };

  const handleShare = async () => {
    if (!result) return;
    const pathNames = result.path.map((c) => c.name).join(" → ");
    const text = `${pathNames} — ${result.length} degree${result.length !== 1 ? "s" : ""} of separation on Lineage Lit!`;
    const shareUrl = `${window.location.origin}/six-degrees/?from=${fromId}&to=${toId}`;

    if (navigator.share) {
      await navigator.share({
        title: "Six Degrees of Lineage",
        text,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Six Degrees" />
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

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            <Zap className="w-4 h-4" />
            Interactive
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Six Degrees of <span className="text-amber-400">Lineage</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Find the shortest influence path between any two creators in the
            literary network.
          </p>
        </div>

        {/* Picker */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800 mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                From
              </label>
              <select
                value={fromId}
                onChange={(e) => {
                  setFromId(e.target.value);
                  setSearched(false);
                }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-amber-500/50"
              >
                <option value="">Select a creator...</option>
                {creators.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                To
              </label>
              <select
                value={toId}
                onChange={(e) => {
                  setToId(e.target.value);
                  setSearched(false);
                }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-amber-500/50"
              >
                <option value="">Select a creator...</option>
                {creators
                  .filter((c) => c.slug !== fromId)
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleFind}
              disabled={!fromId || !toId}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              Find Path
            </button>
            {searched && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        {searched && (
          <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
            {result ? (
              <div className="space-y-6">
                <PathAnimation path={result.path} />

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-zinc-900 font-medium rounded-lg hover:bg-amber-400 transition text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share This Path
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400 text-lg">
                  No path found between these creators.
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  They belong to separate influence networks.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Fun stats */}
        {!searched && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="text-2xl font-bold text-amber-400">
                {creators.length}
              </div>
              <div className="text-xs text-zinc-500">Creators</div>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="text-2xl font-bold text-amber-400">
                {creators.reduce((sum, c) => sum + c.influenced.length, 0)}
              </div>
              <div className="text-xs text-zinc-500">Connections</div>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="text-2xl font-bold text-amber-400">3</div>
              <div className="text-xs text-zinc-500">Max Steps</div>
            </div>
          </div>
        )}
      </main>
      <MobileBottomSpacer />
    </div>
  );
}
