import { getCreatorById, getLineage, creators } from '@/lib/data';
import { Network, BookOpen, Film, ArrowLeft, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return creators.map((creator) => ({
    id: creator.id,
  }));
}

export default async function CreatorPage({ params }: Props) {
  const { id } = await params;
  const creator = getCreatorById(id);
  
  if (!creator) {
    notFound();
  }

  const { ancestors, descendants } = getLineage(id);

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
            <a href="/explore" className="hover:text-amber-400 transition">Explore</a>
            <a href="/creators" className="text-amber-400">Creators</a>
            <a href="/lineage" className="hover:text-amber-400 transition">Lineage</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Creators</span>
        </Link>

        {/* Creator Header */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-amber-400 mb-2">{creator.name}</h2>
              <p className="text-zinc-500">{creator.years}</p>
            </div>
            <div className="flex gap-2">
              {creator.works.some(w => w.type === 'book') && (
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Author
                </span>
              )}
              {creator.works.some(w => w.type === 'screenplay') && (
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400 flex items-center gap-1">
                  <Film className="w-3 h-3" /> Screenwriter
                </span>
              )}
            </div>
          </div>
          <p className="text-zinc-300 text-lg leading-relaxed">{creator.bio}</p>
        </div>

        {/* Lineage Graph */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Network className="w-6 h-6 text-amber-400" />
            Creative Lineage
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Ancestors */}
            {ancestors.length > 0 && (
              <>
                <div className="flex flex-wrap gap-3">
                  {ancestors.map(ancestor => (
                    <LineageCard key={ancestor.id} creator={ancestor} type="ancestor" />
                  ))}
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600" />
              </>
            )}

            {/* Current */}
            <div className="bg-amber-500/10 border-2 border-amber-500 rounded-xl p-6 min-w-[200px] text-center">
              <User className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-semibold text-amber-400">{creator.name}</h4>
              <p className="text-xs text-zinc-500 mt-1">Current</p>
            </div>

            {/* Descendants */}
            {descendants.length > 0 && (
              <>
                <ArrowRight className="w-6 h-6 text-amber-500/50" />
                <div className="flex flex-wrap gap-3">
                  {descendants.map(descendant => (
                    <LineageCard key={descendant.id} creator={descendant} type="descendant" />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Works */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Notable Works</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {creator.works.map(work => (
              <div key={work.id} className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-200">&ldquo;{work.title}&rdquo;</h4>
                    <p className="text-sm text-zinc-500">{work.year}</p>
                  </div>
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                    {work.type}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-2">{work.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function LineageCard({ creator, type }: { creator: typeof creators[0], type: 'ancestor' | 'descendant' }) {
  return (
    <Link href={`/creators/${creator.id}`}>
      <div className={`rounded-lg p-4 min-w-[160px] text-center border transition hover:scale-105 ${
        type === 'ancestor' 
          ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500' 
          : 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
      }`}>
        <h4 className={`font-medium text-sm ${type === 'descendant' ? 'text-amber-400' : 'text-zinc-300'}`}>
          {creator.name}
        </h4>
        <p className="text-xs text-zinc-500 mt-1">{creator.years}</p>
      </div>
    </Link>
  );
}
