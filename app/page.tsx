import { BookOpen, Network, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </div>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <a href="/explore" className="hover:text-amber-400 transition">Explore</a>
            <a href="/creators" className="hover:text-amber-400 transition">Creators</a>
            <a href="/lineage" className="hover:text-amber-400 transition">Lineage</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Discover the <span className="text-amber-400">Lineage</span> of Ideas
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Track books, screenplays, and articles through their creative DNA. 
            See where writers learned their craft and what influenced their work.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/explore"
              className="px-8 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition"
            >
              Start Exploring
            </a>
            <a 
              href="https://github.com/spark-the-agent/lineage-lit"
              className="px-8 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Featured Lineage: Literary Minimalism
          </h3>
          
          <div className="flex flex-wrap items-center gap-4">
            <CreatorCard name="Ernest Hemingway" years="1899-1961" work="The Sun Also Rises" />
            <Arrow />
            <CreatorCard name="Raymond Carver" years="1938-1988" work="What We Talk About..." />
            <Arrow />
            <CreatorCard name="Tobias Wolff" years="b. 1945" work="This Boy's Life" />
          </div>
          
          <p className="mt-6 text-zinc-400 text-sm">
            The "iceberg theory" - show only the tip, but the reader feels the weight beneath. 
            Hemingway's sparse prose influenced generations of writers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 text-center">
          <Stat number="50+" label="Curated Works" />
          <Stat number="30+" label="Creators" />
          <Stat number="100+" label="Influence Connections" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>Built with ⚡ by Spark & Jeeves</p>
          <p className="mt-2">A prototype for tracking creative lineage</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 transition">
      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}

function CreatorCard({ name, years, work }: { name: string, years: string, work: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-amber-500/50 transition min-w-[180px]">
      <h4 className="font-semibold text-amber-400">{name}</h4>
      <p className="text-xs text-zinc-500">{years}</p>
      <p className="text-sm text-zinc-300 mt-2 italic">&ldquo;{work}&rdquo;</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="text-zinc-600">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function Stat({ number, label }: { number: string, label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-amber-400">{number}</div>
      <div className="text-zinc-500 text-sm">{label}</div>
    </div>
  );
}
