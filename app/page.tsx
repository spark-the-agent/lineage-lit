import { BookOpen, Users, Sparkles, Import, Network } from "lucide-react";
import type { Metadata } from "next";
import ReadingDNA from "./components/ReadingDNA";
import DailyLineage from "./components/DailyLineage";
import StreakBanner from "./components/StreakBanner";
import WeeklyChallenge from "./components/WeeklyChallenge";
import InteractiveGraphSection from "./components/InteractiveGraphSection";
import DNAShareCTA from "./components/DNAShareCTA";
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer } from "./components/MobileNav";
import { DesktopNav } from "./components/MobileNav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lineage Lit - Discover the Lineage of Ideas",
  description: "Track books, screenplays, and articles through their creative DNA. Trace how Hemingway influenced Carver, how Faulkner shaped McCarthy, and discover hidden connections.",
  openGraph: {
    title: "Lineage Lit - Discover the Lineage of Ideas",
    description: "Trace creative influence chains between writers. See where writers learned their craft and what influenced their work.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav />
      <MobileHeaderSpacer />

      {/* Header */}
      <header className="border-b border-zinc-800/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <DesktopNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero — compact, lets the graph speak */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            See How <span className="text-amber-400">Ideas</span> Connect
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto">
            Trace creative influence chains between writers. Click any creator to start exploring.
          </p>
        </div>

        {/* THE GRAPH — the product IS the graph */}
        <div className="mb-8 sm:mb-10">
          <InteractiveGraphSection />
        </div>

        {/* Streak & Progress — always visible */}
        <div className="mb-6">
          <StreakBanner />
        </div>

        {/* Daily Lineage + Weekly Challenge */}
        <div className="grid lg:grid-cols-2 gap-4 mb-12 sm:mb-16">
          <DailyLineage />
          <WeeklyChallenge />
        </div>

        {/* Dynamic DNA Share CTA — appears when user has explored creators */}
        <div className="mb-12 sm:mb-16">
          <DNAShareCTA />
        </div>

        {/* Featured Lineage Chain */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            Featured Lineage: Literary Minimalism
          </h3>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-4">
            <CreatorCard name="Ernest Hemingway" years="1899-1961" work="The Sun Also Rises" />
            <Arrow />
            <CreatorCard name="Raymond Carver" years="1938-1988" work="What We Talk About..." />
            <Arrow />
            <CreatorCard name="Tobias Wolff" years="b. 1945" work="This Boy's Life" />
          </div>

          <p className="mt-4 sm:mt-6 text-zinc-400 text-sm">
            The &ldquo;iceberg theory&rdquo; - show only the tip, but the reader feels the weight beneath.
            Hemingway&apos;s sparse prose influenced generations of writers.
          </p>
        </div>

        {/* Reading DNA + Community CTA + Import */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16">
          <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Your Reading DNA
            </h3>
            <ReadingDNA />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                href="/import"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-700 rounded-lg hover:border-amber-500/50 transition text-sm"
              >
                <Import className="w-4 h-4" />
                Import Goodreads
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition text-sm"
              >
                Start Exploring
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 sm:p-8 border border-amber-500/20">
            <h3 className="text-xl font-semibold mb-4 text-amber-400">
              Join the Community
            </h3>
            <p className="text-zinc-300 mb-6">
              Help map the creative lineage of literature. Contribute connections, verify influences, and earn reputation.
            </p>
            <a
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition"
            >
              <Users className="w-5 h-5" />
              Get Started
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              Built with ⚡ by Spark
            </p>
            <div className="flex gap-6">
              <a href="/explore" className="text-zinc-500 hover:text-zinc-300 text-sm transition">Explore</a>
              <a href="/community" className="text-zinc-500 hover:text-zinc-300 text-sm transition">Community</a>
              <a href="https://github.com/spark-the-agent/lineage-lit" className="text-zinc-500 hover:text-zinc-300 text-sm transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <MobileBottomSpacer />
    </div>
  );
}

function CreatorCard({ name, years, work }: { name: string, years: string, work: string }) {
  return (
    <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 min-w-[140px] flex-1">
      <div className="font-medium text-sm">{name}</div>
      <div className="text-zinc-500 text-xs mb-2">{years}</div>
      <div className="text-amber-400/80 text-xs italic">&ldquo;{work}&rdquo;</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center lg:justify-start text-zinc-600">
      <svg className="w-6 h-6 lg:w-8 lg:h-8 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  );
}
