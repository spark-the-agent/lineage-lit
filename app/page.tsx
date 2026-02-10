import { BookOpen, Network, Users, Sparkles, Import, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import LineageGraph from "./components/LineageGraph";
import ReadingDNA from "./components/ReadingDNA";
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer } from "./components/MobileNav";
import { DesktopNav } from "./components/MobileNav";
import { creators } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

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

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Discover the <span className="text-amber-400">Lineage</span> of Ideas
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Track books, screenplays, and articles through their creative DNA. 
            See where writers learned their craft and what influenced their work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <a 
              href="/explore"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition min-h-[48px] flex items-center justify-center text-base"
            >
              Start Exploring
            </a>
            <a 
              href="/import"
              className="px-6 sm:px-8 py-3 sm:py-4 border border-zinc-700 rounded-lg hover:border-zinc-500 transition min-h-[48px] flex items-center justify-center gap-2 text-base"
            >
              <Import className="w-5 h-5" />
              Import Goodreads
            </a>
          </div>
        </div>

        {/* Featured DNA Card Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Featured Creator</span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">Creative DNA Cards</h3>
            <p className="text-zinc-400 mt-2">Beautiful trading cards for literary creators</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            {/* Card Display */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full group-hover:bg-amber-500/30 transition" />
              <Image
                src="/hemingway-card-v2.png"
                alt="Ernest Hemingway Creative DNA Card"
                width={375}
                height={525}
                className="relative rounded-xl shadow-2xl border border-zinc-700/50 group-hover:scale-105 transition transform"
              />
            </div>
            
            {/* Card Info */}
            <div className="max-w-md text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Nobel Prize 1954
              </div>
              <h4 className="text-3xl font-bold mb-2">Ernest Hemingway</h4>
              <p className="text-zinc-400 mb-4">1899 — 1961</p>
              <p className="text-zinc-300 mb-6">
                Master of the "iceberg theory" - sparse prose that influenced generations 
                from Raymond Carver to Cormac McCarthy.
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">The Sun Also Rises</span>
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">The Old Man and the Sea</span>
              </div>
              <Link 
                href="/creators/hemingway"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition"
              >
                Explore his lineage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          <FeatureCard 
            icon={<Network className="w-6 h-6" />}
            title="Creator Lineage"
            description="Trace influences from mentor to student, from inspiration to masterpiece."
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6" />}
            title="Smart Recommendations"
            description="Discover works based on shared creative DNA, not just 'people also liked.'"
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6" />}
            title="Community Driven"
            description="Contribute lineage data, verify influences, build the literary graph together."
          />
        </div>

        {/* Featured Lineage with Visual */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                Featured Lineage: Literary Minimalism
              </h3>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-4">
                <CreatorCard name="Ernest Hemingway" years="1899-1961" work="The Sun Also Rises" />
                <div className="flex justify-center lg:justify-start">
                  <Arrow />
                </div>
                <CreatorCard name="Raymond Carver" years="1938-1988" work="What We Talk About..." />
                <div className="flex justify-center lg:justify-start">
                  <Arrow />
                </div>
                <CreatorCard name="Tobias Wolff" years="b. 1945" work="This Boy's Life" />
              </div>
              
              <p className="mt-4 sm:mt-6 text-zinc-400 text-sm">
                The &ldquo;iceberg theory&rdquo; - show only the tip, but the reader feels the weight beneath. 
                Hemingway&apos;s sparse prose influenced generations of writers.
              </p>
            </div>
            
            {/* Visual Graph Preview */}
            <div className="lg:w-1/3">
              <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 h-full min-h-[200px] flex items-center justify-center">
                <LineageGraph creators={creators.slice(0, 3)} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16 text-center">
          <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1">6</div>
            <div className="text-xs sm:text-sm text-zinc-400">Creators</div>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1">14</div>
            <div className="text-xs sm:text-sm text-zinc-400">Works</div>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1">∞</div>
            <div className="text-xs sm:text-sm text-zinc-400">Connections</div>
          </div>
        </div>

        {/* Interactive Graph Section */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
            Explore the Literary Graph
          </h3>
          <p className="text-zinc-400 text-center mb-6 max-w-xl mx-auto">
            Click and drag to explore connections. Double-click a creator to see their profile.
          </p>
          <div className="h-[300px] sm:h-[400px] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <LineageGraph creators={creators} />
          </div>
        </div>

        {/* Reading DNA Teaser */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16">
          <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Your Reading DNA
            </h3>
            <ReadingDNA />
            <p className="text-zinc-400 text-sm mt-4">
              Import your reading history to discover your literary influences and find your next favorite book.
            </p>
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
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-amber-500/50 transition group">
      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
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
    <div className="text-zinc-600">
      <svg className="w-6 h-6 lg:w-8 lg:h-8 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  );
}
