import { getDailyLineage } from '@/lib/daily';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DailyLineage() {
  const daily = getDailyLineage();

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
          Daily Lineage
        </span>
        <span className="text-xs text-zinc-500 ml-auto">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-zinc-100">
        Today&apos;s Connection
      </h3>

      {/* Chain visualization */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        {daily.chain.map((creator, i) => (
          <div key={creator.id} className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/creators/${creator.id}`}
              className="bg-zinc-900/80 rounded-lg px-3 py-2 border border-zinc-700 hover:border-amber-500/50 transition group"
            >
              <div className="font-medium text-sm text-zinc-200 group-hover:text-amber-400 transition">
                {creator.name}
              </div>
              <div className="text-[10px] text-zinc-500">{creator.years}</div>
            </Link>
            {i < daily.chain.length - 1 && (
              <ArrowRight className="w-4 h-4 text-amber-500/60 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        <Sparkles className="w-3.5 h-3.5 inline text-amber-400 mr-1" />
        {daily.narrative}
      </p>
    </div>
  );
}
