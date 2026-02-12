'use client';

import { useState } from 'react';
import { Network, Sparkles, Search, Loader2, ArrowRight, Zap, Crown, BookOpen } from 'lucide-react';
import Link from 'next/link';
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer, DesktopNav } from '@/app/components/MobileNav';
import { getCreatorById, creators } from '@/lib/data';

interface InfluenceResult {
  name: string;
  confidence: number;
  evidence: string;
}

interface DiscoveryResult {
  identifiedInfluences: InfluenceResult[];
  relatedWorks: string[];
  lineageSummary: string;
}

// Local mock analysis for when Convex is not connected
function mockAnalyze(title: string, author: string): Promise<DiscoveryResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      // Try to match against existing creators
      const matchedCreator = creators.find(c =>
        c.name.toLowerCase().includes(author.toLowerCase()) ||
        c.works.some(w => w.title.toLowerCase().includes(title.toLowerCase()))
      );

      if (matchedCreator) {
        const influences = matchedCreator.influencedBy
          .map(id => getCreatorById(id))
          .filter(Boolean)
          .map(c => ({
            name: c!.name,
            confidence: 0.7 + Math.random() * 0.25,
            evidence: `${c!.name}'s work in ${c!.works[0]?.title || 'literary fiction'} shows direct stylistic influence on this work.`,
          }));

        resolve({
          identifiedInfluences: influences.length > 0 ? influences : [
            { name: 'Ernest Hemingway', confidence: 0.72, evidence: 'Sparse, declarative prose style echoing the iceberg theory.' },
            { name: 'Raymond Carver', confidence: 0.65, evidence: 'Minimalist approach to domestic themes.' },
          ],
          relatedWorks: matchedCreator.works.map(w => `${w.title} by ${matchedCreator.name}`),
          lineageSummary: `This work sits within the ${matchedCreator.bio.includes('minimalis') ? 'minimalist' : 'modernist'} literary tradition, showing connections to ${matchedCreator.influencedBy.map(id => getCreatorById(id)?.name).filter(Boolean).join(', ')}.`,
        });
      } else {
        resolve({
          identifiedInfluences: [
            { name: 'Ernest Hemingway', confidence: 0.82, evidence: 'The spare prose style and understated emotional depth strongly echo Hemingway\'s "iceberg theory."' },
            { name: 'Anton Chekhov', confidence: 0.74, evidence: 'Character-driven narrative with subtle dramatic tension mirrors Chekhov\'s approach.' },
            { name: 'Raymond Carver', confidence: 0.68, evidence: 'Minimalist approach to depicting everyday life and its quiet revelations.' },
          ],
          relatedWorks: [
            'The Sun Also Rises by Ernest Hemingway',
            'What We Talk About When We Talk About Love by Raymond Carver',
            'The Lady with the Dog by Anton Chekhov',
          ],
          lineageSummary: `This work shows strong minimalist influences, drawing from the Hemingway-Carver lineage of sparse, emotionally resonant prose. The attention to subtext and unsaid meaning reflects a deep connection to Chekhov's dramatic tradition.`,
        });
      }
    }, 2500); // Simulate processing time
  });
}

export default function DiscoverPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiscoveryResult | null>(null);

  const handleDiscover = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const analysis = await mockAnalyze(title, author);
      setResult(analysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Discover" />
      <MobileHeaderSpacer />

      <header className="border-b border-zinc-800/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <DesktopNav />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Discover Any Book&apos;s <span className="text-amber-400">Lineage</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Enter any book, screenplay, or article and our AI will trace its creative DNA
            back through literary history.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Book / Work Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='e.g. "No Country for Old Men"'
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Author (optional)
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder='e.g. "Cormac McCarthy"'
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Acknowledgments / Preface Text (optional)
              </label>
              <textarea
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
                placeholder="Paste the acknowledgments page or author's note for more accurate analysis..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>

            <button
              onClick={handleDiscover}
              disabled={!title.trim() || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Literary DNA...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Discover Lineage
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/50 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-zinc-200 font-medium">Tracing creative lineage...</p>
                <p className="text-zinc-500 text-sm mt-1">Analyzing influences, styles, and connections</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Lineage Analysis
              </h3>
              <p className="text-zinc-300 leading-relaxed">{result.lineageSummary}</p>
            </div>

            {/* Identified Influences */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Identified Influences
              </h3>
              <div className="space-y-4">
                {result.identifiedInfluences
                  .sort((a, b) => b.confidence - a.confidence)
                  .map((influence, i) => {
                    const existing = creators.find(c =>
                      c.name.toLowerCase() === influence.name.toLowerCase()
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                        style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <span className="text-amber-400 font-bold text-lg">
                              {Math.round(influence.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-zinc-200">{influence.name}</h4>
                            {existing && (
                              <Link
                                href={`/creators/${existing.id}`}
                                className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full hover:bg-amber-500/20 transition"
                              >
                                View Profile
                              </Link>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{influence.evidence}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Related Works */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Related Works
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.relatedWorks.map((work, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-zinc-800 rounded-lg text-sm text-zinc-300 border border-zinc-700"
                  >
                    {work}
                  </span>
                ))}
              </div>
            </div>

            {/* Explore More CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setResult(null); setTitle(''); setAuthor(''); setSourceText(''); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
              >
                Analyze Another Work
              </button>
              <Link
                href="/six-degrees"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition"
              >
                Explore Connections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Pro Upgrade CTA */}
        {!result && !loading && (
          <div className="bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-zinc-900 rounded-2xl p-6 sm:p-8 border border-amber-500/20 mt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center border border-amber-500/30">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 mb-1">Lineage Lit Pro</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  Unlimited AI lineage analysis, bulk import analysis, and priority processing.
                  Currently in demo mode with mock results.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="px-2 py-1 bg-zinc-800 rounded">Unlimited analyses</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded">Acknowledgments parsing</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded">Export lineage trees</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded">API access</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <MobileBottomSpacer />
    </div>
  );
}
