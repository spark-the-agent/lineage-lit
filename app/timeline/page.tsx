import { Network, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import TimelineVisualization from '@/app/components/TimelineVisualization';
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer } from '@/app/components/MobileNav';
import { DesktopNav } from '@/app/components/MobileNav';

export const metadata: Metadata = {
  title: 'Timeline - Lineage Lit',
  description: 'Visualize literary influence across time. See how creators span generations from 1897 to today.',
};

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Timeline" />
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-7 h-7 text-amber-400" />
            Literary Timeline
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Visualize influence chains across generations. Bars span each creator&apos;s active years, dots mark notable works.
          </p>
        </div>

        <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800">
          <TimelineVisualization />
        </div>
      </main>

      <MobileBottomSpacer />
    </div>
  );
}
