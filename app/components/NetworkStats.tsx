import { NetworkMetrics } from '@/lib/network-analysis';

interface NetworkStatsProps {
  metrics: NetworkMetrics;
}

export default function NetworkStats({ metrics }: NetworkStatsProps) {
  const stats = [
    { label: 'Nodes', value: metrics.totalNodes, description: 'Creators in network' },
    { label: 'Edges', value: metrics.totalEdges, description: 'Influence connections' },
    { label: 'Density', value: `${(metrics.density * 100).toFixed(1)}%`, description: 'Network connectivity' },
    { label: 'Avg Degree', value: metrics.averageDegree.toFixed(1), description: 'Connections per creator' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(stat => (
        <div key={stat.label} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
          <div className="text-xl sm:text-2xl font-bold text-amber-400">{stat.value}</div>
          <div className="text-xs text-zinc-300 mt-1">{stat.label}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{stat.description}</div>
        </div>
      ))}
    </div>
  );
}
