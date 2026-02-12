"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Network,
  TrendingUp,
  GitBranch,
  Link as LinkIcon,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { creators } from "@/lib/data";
import { analyzeNetwork, getMovementClusters } from "@/lib/network-analysis";
import LineageGraph from "@/app/components/LineageGraph";
import InfluenceRanking from "@/app/components/InfluenceRanking";
import NetworkStats from "@/app/components/NetworkStats";
import ClusterView from "@/app/components/ClusterView";
import MobileNav, {
  MobileHeaderSpacer,
  MobileBottomSpacer,
} from "@/app/components/MobileNav";
import { DesktopNav } from "@/app/components/MobileNav";

export default function InsightsContent() {
  const metrics = useMemo(() => analyzeNetwork(creators), []);
  const clusters = useMemo(() => getMovementClusters(creators), []);

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Network Insights" />
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
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-amber-400" />
            Network Intelligence
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Deep analysis of the literary influence network
          </p>
        </div>

        {/* Network Health */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-400" />
            Network Health
          </h3>
          <NetworkStats metrics={metrics} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Influence Ranking */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Most Influential
            </h3>
            <InfluenceRanking scores={metrics.mostInfluential} />
          </div>

          {/* Network Bridges */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              Network Bridges
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Creators with high betweenness centrality — they connect otherwise
              separate communities.
            </p>
            {metrics.bridges.length > 0 ? (
              <div className="space-y-3">
                {metrics.bridges.map((bridge) => (
                  <Link
                    key={bridge.creator.id}
                    href={`/creators/${bridge.creator.id}`}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-amber-500/50 transition"
                  >
                    <div>
                      <span className="text-sm font-medium text-zinc-200">
                        {bridge.creator.name}
                      </span>
                      <p className="text-xs text-zinc-500">
                        {bridge.creator.years}
                      </p>
                    </div>
                    <span className="text-xs text-amber-400 font-mono">
                      {(bridge.betweennessCentrality * 100).toFixed(1)}%
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">
                No bridge creators detected in the current network.
              </p>
            )}
          </div>
        </div>

        {/* Literary Clusters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Literary Clusters
          </h3>
          <ClusterView clusters={clusters} />
        </div>

        {/* Longest Chains */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-amber-400" />
            Longest Influence Chains
          </h3>
          {metrics.pathLengths.length > 0 ? (
            <div className="space-y-3">
              {metrics.pathLengths.slice(0, 5).map((pl, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  {pl.path.map((creator, j) => (
                    <div key={creator.id} className="flex items-center gap-2">
                      <Link
                        href={`/creators/${creator.id}`}
                        className="text-sm text-zinc-300 hover:text-amber-400 transition"
                      >
                        {creator.name}
                      </Link>
                      {j < pl.path.length - 1 && (
                        <span className="text-amber-500/50 text-xs">→</span>
                      )}
                    </div>
                  ))}
                  <span className="text-xs text-zinc-600 ml-2">
                    ({pl.length} steps)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No long chains detected.</p>
          )}
        </div>

        {/* Interactive Graph */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-400" />
            Full Network Graph
          </h3>
          <div className="h-[400px] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <LineageGraph creators={creators} />
          </div>
        </div>
      </main>

      <MobileBottomSpacer />
    </div>
  );
}
