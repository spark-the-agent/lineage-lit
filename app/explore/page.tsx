import { creators } from '@/lib/data';
import { Network, BookOpen, Film, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer } from '@/app/components/MobileNav';
import { DesktopNav } from '@/app/components/MobileNav';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Explore Creators" />
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Explore Creators</h2>
          <p className="text-zinc-400 text-sm sm:text-base">Discover writers and their creative lineage</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </main>

      <MobileBottomSpacer />
    </div>
  );
}

function CreatorCard({ creator }: { creator: typeof creators[0] }) {
  const influencedCount = creator.influenced.length;
  const influencedByCount = creator.influencedBy.length;

  return (
    <Link href={`/creators/${creator.id}`} className="block">
      <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800 hover:border-amber-500/50 transition group h-full">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-amber-400 group-hover:text-amber-300 transition truncate">
              {creator.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500">{creator.years}</p>
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
            {creator.works.some(w => w.type === 'book') && (
              <BookOpen className="w-4 h-4 text-zinc-600" />
            )}
            {creator.works.some(w => w.type === 'screenplay') && (
              <Film className="w-4 h-4 text-zinc-600" />
            )}
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{creator.bio}</p>

        <div className="flex items-center gap-2 sm:gap-4 text-xs text-zinc-500 flex-wrap">
          <span>{creator.works.length} works</span>
          {influencedByCount > 0 && (
            <span className="text-zinc-600">← {influencedByCount} influences</span>
          )}
          {influencedCount > 0 && (
            <span className="text-amber-500/70">→ {influencedCount} influenced</span>
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
