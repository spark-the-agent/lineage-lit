'use client';

import { useState } from 'react';
import { Sparkles, Share2, Dna } from 'lucide-react';
import { usePersistence } from './PersistenceProvider';
import { computeDNAFromState } from '@/lib/compute-dna';
import ShareableCard from './ShareableCard';

export default function DNAShareCTA() {
  const { state, userProfile } = usePersistence();
  const [showCard, setShowCard] = useState(false);

  const hasActivity = state.savedCreators.length > 0 || state.viewedCreators.length > 0;
  const dna = computeDNAFromState(state);

  if (!hasActivity) return null;

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-zinc-900 rounded-2xl p-6 sm:p-8 border border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
              <Dna className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-zinc-100 mb-1">
              Your Reading DNA is Ready
            </h3>
            <p className="text-zinc-400 text-sm mb-3">
              Based on {dna.totalAuthors} authors you&apos;ve explored
              {dna.literaryDNA.length > 0 && (
                <> &mdash; you&apos;re a <span className="text-amber-400">{dna.literaryDNA[0]}</span></>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {dna.literaryDNA.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCard(true)}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition whitespace-nowrap"
          >
            <Share2 className="w-4 h-4" />
            Share Your DNA
          </button>
        </div>
      </div>

      {showCard && (
        <ShareableCard
          data={{
            displayName: userProfile.displayName,
            username: userProfile.username,
            readingDNA: dna,
          }}
          onClose={() => setShowCard(false)}
        />
      )}
    </>
  );
}
