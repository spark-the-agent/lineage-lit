import { CreatorScore } from "@/lib/network-analysis";
import Link from "next/link";

interface InfluenceRankingProps {
  scores: CreatorScore[];
}

export default function InfluenceRanking({ scores }: InfluenceRankingProps) {
  const maxScore = scores.length > 0 ? scores[0].score : 1;

  return (
    <div className="space-y-3">
      {scores.map((entry, i) => (
        <Link
          key={entry.creator.id}
          href={`/creators/${entry.creator.id}`}
          className="flex items-center gap-3 group"
        >
          <span
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${
              i === 0
                ? "bg-amber-500 text-zinc-900"
                : i === 1
                  ? "bg-zinc-600 text-zinc-200"
                  : i === 2
                    ? "bg-amber-700 text-zinc-200"
                    : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-zinc-200 group-hover:text-amber-400 transition truncate">
                {entry.creator.name}
              </span>
              <span className="text-xs text-zinc-500 ml-2">
                {entry.score.toFixed(1)}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                style={{ width: `${(entry.score / maxScore) * 100}%` }}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
