import { creators } from '@/lib/data';
import { Network, BookOpen, Film, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <a href="/explore" className="text-amber-400">Explore</a>
            <a href="/creators" className="hover:text-amber-400 transition">Creators</a>
            <a href="/lineage" className="hover:text-amber-400 transition">Lineage</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-2">Explore Creators</h2>
        <p className="text-zinc-400 mb-8">Discover writers and their creative lineage</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </main>
    </div>
  );
}

function CreatorCard({ creator }: { creator: typeof creators[0] }) {
  const influencedCount = creator.influenced.length;
  const influencedByCount = creator.influencedBy.length;

  return (
    <Link href={`/creators/${creator.id}`}>
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-amber-500/50 transition group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-amber-400 group-hover:text-amber-300 transition">
              {creator.name}
            </h3>
            <p className="text-sm text-zinc-500">{creator.years}</p>
          </div>
          <div className="flex gap-2">
            {creator.works.some(w => w.type === 'book') && (
              <BookOpen className="w-4 h-4 text-zinc-600" />
            )}
            {creator.works.some(w => w.type === 'screenplay') && (
              <Film className="w-4 h-4 text-zinc-600" />
            )}
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{creator.bio}</p>

        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>{creator.works.length} works</span>
          {influencedByCount > 0 && (
            <span className="text-zinc-600">← {influencedByCount} influences</span>
          )}
          {influencedCount > 0 && (
            <span className="text-amber-500/70">→ {influencedCount} influenced</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-amber-400/70 group-hover:text-amber-400 transition">
          <span>View lineage</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
