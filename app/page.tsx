import { BookOpen, Network, Users, Sparkles, Import } from "lucide-react";
import LineageGraph from "./components/LineageGraph";
import ReadingDNA from "./components/ReadingDNA";
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer } from "./components/MobileNav";
import { DesktopNav } from "./components/MobileNav";
import { creators } from "@/lib/data";
import Link from "next/link";

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

        {/* Featured Lineage */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-12 sm:mb-16">
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16 text-center">
          <Stat number="50+" label="Curated Works" />
          <Stat number="30+" label="Creators" />
          <Stat number="100+" label="Influence Connections" />
        </div>

        {/* Interactive Lineage Graph */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Network className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            Explore the Lineage Graph
          </h3>
          <p className="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Click nodes to explore connections. Orange dashed lines show influence relationships.
          </p>
          <LineageGraph creators={creators} />
        </div>

        {/* Reading DNA Feature */}
        <div className="mb-12 sm:mb-16">
          <ReadingDNA />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-zinc-500 text-sm">
          <p>Built with ⚡ by Spark & Jeeves</p>
          <p className="mt-2">A prototype for tracking creative lineage</p>
        </div>
      </footer>

      <MobileBottomSpacer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 transition">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}

function CreatorCard({ name, years, work }: { name: string, years: string, work: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700 hover:border-amber-500/50 transition min-w-0 flex-1">
      <h4 className="font-semibold text-amber-400 text-sm sm:text-base">{name}</h4>
      <p className="text-xs text-zinc-500">{years}</p>
      <p className="text-xs sm:text-sm text-zinc-300 mt-1 sm:mt-2 italic truncate">&ldquo;{work}&rdquo;</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="text-zinc-600 rotate-90 lg:rotate-0">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function Stat({ number, label }: { number: string, label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold text-amber-400">{number}</div>
      <div className="text-zinc-500 text-xs sm:text-sm mt-1">{label}</div>
    </div>
  );
}
