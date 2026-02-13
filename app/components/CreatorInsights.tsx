import { Creator, creators } from "@/lib/data";
import { analyzeNetwork } from "@/lib/network-analysis";
import { getSimilarCreators } from "@/lib/recommendations";
import {
  TrendingUp,
  Zap,
  GitBranch,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import Link from "next/link";

interface CreatorInsightsProps {
  creator: Creator;
}

export default function CreatorInsights({ creator }: CreatorInsightsProps) {
  const metrics = analyzeNetwork(creators);

  // Influence rank
  const influenceRank =
    metrics.mostInfluential.findIndex((s) => s.creator.slug === creator.slug) +
    1;
  const influenceScore =
    metrics.mostInfluential.find((s) => s.creator.slug === creator.slug)
      ?.score ?? 0;

  // Centrality
  const centralityEntry = metrics.mostCentral.find(
    (s) => s.creator.slug === creator.slug,
  );
  const centralityScore = centralityEntry
    ? Math.round(centralityEntry.score * 100)
    : 0;

  // Bridge detection
  const bridgeEntry = metrics.bridges.find(
    (b) => b.creator.slug === creator.slug,
  );
  const isBridge = bridgeEntry && bridgeEntry.betweennessCentrality > 0;

  // Longest chain from this creator
  const chains = metrics.pathLengths.filter(
    (p) => p.from.slug === creator.slug,
  );
  const longestChain = chains.length > 0 ? chains[0] : null;

  // Similar creators
  const similar = getSimilarCreators(creator.slug, 3);

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 border border-zinc-800">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" />
        Network Insights
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Influence Rank */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Influence</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">
            #{influenceRank}
          </div>
          <div className="text-[10px] text-zinc-500">
            of {creators.length} creators
          </div>
        </div>

        {/* Centrality */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <LinkIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Centrality</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">
            {centralityScore}%
          </div>
          <div className="text-[10px] text-zinc-500">connectedness</div>
        </div>

        {/* Bridge indicator */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Bridge</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">
            {isBridge ? "Yes" : "No"}
          </div>
          <div className="text-[10px] text-zinc-500">
            {isBridge ? "Connects communities" : "Within cluster"}
          </div>
        </div>

        {/* Longest Chain */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Chain</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">
            {longestChain ? longestChain.length : 0}
          </div>
          <div className="text-[10px] text-zinc-500">
            {longestChain
              ? `→ ${longestChain.to.name.split(" ").pop()}`
              : "No chain"}
          </div>
        </div>
      </div>

      {/* Influence score explanation */}
      {influenceScore > 0 && (
        <p className="text-xs text-zinc-400 mb-4">
          {creator.name} has an influence score of{" "}
          <span className="text-amber-400 font-medium">
            {influenceScore.toFixed(1)}
          </span>
          , ranking{" "}
          <span className="text-amber-400 font-medium">#{influenceRank}</span>{" "}
          most influential in the network
          {longestChain && (
            <>
              {" "}
              with a chain spanning{" "}
              {longestChain.path
                .map((c) => c.name.split(" ").pop())
                .join(" → ")}
            </>
          )}
          .
        </p>
      )}

      {/* Similar Creators */}
      {similar.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Similar Creators
          </h4>
          <div className="flex flex-wrap gap-2">
            {similar.map((c) => (
              <Link
                key={c.slug}
                href={`/creators/${c.slug}`}
                className="px-3 py-1.5 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
