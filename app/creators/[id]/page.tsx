import { getCreatorById, getLineage, creators } from '@/lib/data';
import { Network, BookOpen, Film, ArrowLeft, ArrowRight, User, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer } from '@/app/components/MobileNav';
import { DesktopNav } from '@/app/components/MobileNav';
import CreatorActions from '@/app/components/CreatorActions';
import CreatorInsights from '@/app/components/CreatorInsights';
import CreatorViewTracker from '@/app/components/CreatorViewTracker';
import LineageChainCard from '@/app/components/LineageChainCard';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return creators.map((creator) => ({
    id: creator.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const creator = getCreatorById(id);
  if (!creator) return {};

  const workTitles = creator.works.map(w => w.title).join(', ');
  const influenceChain = creator.influencedBy.length > 0
    ? `Influenced by: ${creator.influencedBy.map(id => getCreatorById(id)?.name).filter(Boolean).join(', ')}. `
    : '';
  const influencedChain = creator.influenced.length > 0
    ? `Influenced: ${creator.influenced.map(id => getCreatorById(id)?.name).filter(Boolean).join(', ')}.`
    : '';
  const description = `${creator.name} (${creator.years}) — ${creator.bio} ${influenceChain}${influencedChain} Notable works: ${workTitles}.`;

  return {
    title: `${creator.name} — Creative Lineage | Lineage Lit`,
    description,
    openGraph: {
      title: `${creator.name} — Trace the Creative Lineage`,
      description: `${creator.bio} ${influenceChain}`,
      type: 'profile',
      siteName: 'Lineage Lit',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${creator.name} — Creative Lineage`,
      description: `${creator.bio} ${influenceChain}`,
    },
  };
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
      <CreatorViewTracker creatorId={id} />
      <MobileNav
        currentPage={creator.name}
        showBackButton
        backHref="/explore"
        backLabel="Creators"
      />
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-12">
        {/* Back link (desktop) */}
        <Link 
          href="/explore" 
          className="hidden lg:inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Creators</span>
        </Link>

        {/* Creator Header */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">{creator.name}</h2>
              <p className="text-zinc-500 text-sm sm:text-base">{creator.years}</p>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <CreatorActions creatorId={creator.id} creatorName={creator.name} />
              {creator.works.some(w => w.type === 'book') && (
                <span className="px-3 py-1.5 bg-zinc-800 rounded-full text-xs text-zinc-400 flex items-center gap-1.5 min-h-[32px]">
                  <BookOpen className="w-3.5 h-3.5" /> Author
                </span>
              )}
              {creator.works.some(w => w.type === 'screenplay') && (
                <span className="px-3 py-1.5 bg-zinc-800 rounded-full text-xs text-zinc-400 flex items-center gap-1.5 min-h-[32px]">
                  <Film className="w-3.5 h-3.5" /> Screenwriter
                </span>
              )}
            </div>
          </div>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">{creator.bio}</p>
        </div>

        {/* Network Insights */}
        <div className="mb-6 sm:mb-8">
          <CreatorInsights creator={creator} />
        </div>

        {/* Lineage Graph */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Network className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            Creative Lineage
          </h3>

          <div className="flex flex-col items-center gap-4">
            {/* Ancestors */}
            {ancestors.length > 0 && (
              <div className="w-full">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 text-center">Influenced By</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {ancestors.map(ancestor => (
                    <LineageCard key={ancestor.id} creator={ancestor} type="ancestor" />
                  ))}
                </div>
              </div>
            )}

            {/* Connection Arrow */}
            {ancestors.length > 0 && (
              <div className="text-zinc-600 rotate-90 sm:rotate-0">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}

            {/* Current */}
            <div className="bg-amber-500/10 border-2 border-amber-500 rounded-xl p-4 sm:p-6 w-full sm:min-w-[200px] sm:w-auto text-center">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-semibold text-amber-400 text-sm sm:text-base">{creator.name}</h4>
              <p className="text-xs text-zinc-500 mt-1">Current</p>
            </div>

            {/* Connection Arrow */}
            {descendants.length > 0 && (
              <div className="text-amber-500/50 rotate-90 sm:rotate-0">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}

            {/* Descendants */}
            {descendants.length > 0 && (
              <div className="w-full">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 text-center">Influenced</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {descendants.map(descendant => (
                    <LineageCard key={descendant.id} creator={descendant} type="descendant" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Find Connection */}
        <div className="mb-6 sm:mb-8">
          <LineageChainCard fromCreatorId={id} />
        </div>

        {/* Works */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Notable Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {creator.works.map(work => (
              <div key={work.id} className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-zinc-200 text-sm sm:text-base truncate">&ldquo;{work.title}&rdquo;</h4>
                    <p className="text-xs sm:text-sm text-zinc-500">{work.year}</p>
                  </div>
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 flex-shrink-0">
                    {work.type}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 line-clamp-2">{work.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileBottomSpacer />
    </div>
  );
}

function LineageCard({ creator, type }: { creator: typeof creators[0], type: 'ancestor' | 'descendant' }) {
  return (
    <Link href={`/creators/${creator.id}`} className="block">
      <div className={`rounded-lg p-3 sm:p-4 min-w-[140px] sm:min-w-[160px] text-center border transition hover:scale-105 ${
        type === 'ancestor' 
          ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500' 
          : 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
      }`}>
        <h4 className={`font-medium text-sm ${type === 'descendant' ? 'text-amber-400' : 'text-zinc-300'} truncate`}>
          {creator.name}
        </h4>
        <p className="text-xs text-zinc-500 mt-1">{creator.years}</p>
      </div>
    </Link>
  );
}
