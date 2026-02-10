import { Creator } from '@/lib/data';
import Link from 'next/link';

interface ClusterViewProps {
  clusters: { name: string; members: Creator[]; era: string }[];
}

const eraColors: Record<string, string> = {
  'Pre-Modern': 'border-indigo-500/30 bg-indigo-500/5',
  'Modernist': 'border-amber-500/30 bg-amber-500/5',
  'Mid-Century': 'border-emerald-500/30 bg-emerald-500/5',
  'Late 20th Century': 'border-pink-500/30 bg-pink-500/5',
  'Contemporary': 'border-cyan-500/30 bg-cyan-500/5',
};

export default function ClusterView({ clusters }: ClusterViewProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clusters.map((cluster, i) => (
        <div
          key={i}
          className={`rounded-xl p-4 border ${eraColors[cluster.era] || 'border-zinc-700 bg-zinc-800/30'}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-zinc-200">{cluster.name}</h4>
            <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
              {cluster.era}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cluster.members.map(member => (
              <Link
                key={member.id}
                href={`/creators/${member.id}`}
                className="text-xs px-2.5 py-1 bg-zinc-800/50 rounded-lg text-zinc-300 hover:text-amber-400 transition"
              >
                {member.name}
              </Link>
            ))}
          </div>
          <div className="text-[10px] text-zinc-500 mt-2">
            {cluster.members.length} creator{cluster.members.length !== 1 ? 's' : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
