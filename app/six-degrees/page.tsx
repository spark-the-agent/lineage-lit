'use client';

import { useState } from 'react';
import { Network, Zap, Share2, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { creators } from '@/lib/data';
import { findPath } from '@/lib/path-finder';
import PathAnimation from '@/app/components/PathAnimation';

export default function SixDegreesPage() {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [result, setResult] = useState<ReturnType<typeof findPath>>(null);
  const [searched, setSearched] = useState(false);

  const handleFind = () => {
    if (!fromId || !toId) return;
    const path = findPath(fromId, toId);
    setResult(path);
    setSearched(true);
  };

  const handleReset = () => {
    setFromId('');
    setToId('');
    setResult(null);
    setSearched(false);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${result.path[0].name} to ${result.path[result.path.length - 1].name} in ${result.length} steps on Lineage Lit!`;
    if (navigator.share) {
      await navigator.share({ title: 'Six Degrees of Lineage', text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

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
            <Link href="/explore" className="hover:text-amber-400 transition">Explore</Link>
            <Link href="/six-degrees" className="text-amber-400">Six Degrees</Link>
            <Link href="/profile" className="hover:text-amber-400 transition">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            <Zap className="w-4 h-4" />
            Interactive
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Six Degrees of <span className="text-amber-400">Lineage</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Find the shortest influence path between any two creators in the literary network.
          </p>
        </div>

        {/* Picker */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800 mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">From</label>
              <select
                value={fromId}
                onChange={e => { setFromId(e.target.value); setSearched(false); }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-amber-500/50"
              >
                <option value="">Select a creator...</option>
                {creators.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">To</label>
              <select
                value={toId}
                onChange={e => { setToId(e.target.value); setSearched(false); }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-amber-500/50"
              >
                <option value="">Select a creator...</option>
                {creators.filter(c => c.id !== fromId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleFind}
              disabled={!fromId || !toId}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              Find Path
            </button>
            {searched && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        {searched && (
          <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
            {result ? (
              <div className="space-y-6">
                <PathAnimation path={result.path} />

                <div className="flex justify-center">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Result
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400 text-lg">No path found between these creators.</p>
                <p className="text-zinc-500 text-sm mt-2">They belong to separate influence networks.</p>
              </div>
            )}
          </div>
        )}

        {/* Fun stats */}
        {!searched && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="text-2xl font-bold text-amber-400">{creators.length}</div>
              <div className="text-xs text-zinc-500">Creators</div>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="text-2xl font-bold text-amber-400">
                {creators.reduce((sum, c) => sum + c.influenced.length, 0)}
              </div>
              <div className="text-xs text-zinc-500">Connections</div>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="text-2xl font-bold text-amber-400">3</div>
              <div className="text-xs text-zinc-500">Max Steps</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
