"use client";

import { useMemo } from "react";
import type { Creator } from "@/lib/data";
import { useCreators } from "@/lib/use-convex-data";
import { getMovementClusters } from "@/lib/network-analysis";
import Link from "next/link";

const TIMELINE_START = 1895;
const TIMELINE_END = 2025;
const TIMELINE_RANGE = TIMELINE_END - TIMELINE_START;

const clusterColors: Record<string, string> = {
  "Pre-Modern": "#6366f1",
  Modernist: "#f59e0b",
  "Mid-Century": "#10b981",
  "Late 20th Century": "#ec4899",
  Contemporary: "#06b6d4",
};

function parseYears(years: string): { start: number; end: number } {
  if (years.startsWith("b.")) {
    const start = parseInt(years.slice(3));
    return { start, end: 2025 };
  }
  const parts = years.split("-");
  return {
    start: parseInt(parts[0]),
    end: parts[1] ? parseInt(parts[1]) : 2025,
  };
}

export default function TimelineVisualization() {
  const creators = useCreators();
  const clusters = useMemo(() => getMovementClusters(creators), [creators]);

  const creatorClusterMap = useMemo(() => {
    const map = new Map<string, string>();
    clusters.forEach((cluster) => {
      cluster.members.forEach((member) => {
        map.set(member.slug, cluster.era);
      });
    });
    return map;
  }, [clusters]);

  // Sort creators by birth year
  const sortedCreators = useMemo(
    () =>
      [...creators].sort(
        (a, b) => parseYears(a.years).start - parseYears(b.years).start,
      ),
    [creators],
  );

  const decades = useMemo(() => {
    const d = [];
    for (let year = 1900; year <= 2020; year += 20) d.push(year);
    return d;
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(clusterColors).map(([era, color]) => (
            <div
              key={era}
              className="flex items-center gap-1.5 text-xs text-zinc-400"
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              {era}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <svg
          viewBox={`0 0 900 ${sortedCreators.length * 70 + 80}`}
          className="w-full"
        >
          {/* Decade markers */}
          {decades.map((year) => {
            const x = ((year - TIMELINE_START) / TIMELINE_RANGE) * 800 + 50;
            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={30}
                  x2={x}
                  y2={sortedCreators.length * 70 + 50}
                  stroke="#3f3f46"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={x}
                  y={20}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="11"
                >
                  {year}
                </text>
              </g>
            );
          })}

          {/* Creator bars */}
          {sortedCreators.map((creator, i) => {
            const y = i * 70 + 50;
            const { start, end } = parseYears(creator.years);
            const x1 = ((start - TIMELINE_START) / TIMELINE_RANGE) * 800 + 50;
            const x2 = ((end - TIMELINE_START) / TIMELINE_RANGE) * 800 + 50;
            const era = creatorClusterMap.get(creator.slug) || "Mid-Century";
            const color = clusterColors[era] || "#f59e0b";

            return (
              <g key={creator.slug}>
                {/* Creator bar */}
                <rect
                  x={x1}
                  y={y}
                  width={Math.max(x2 - x1, 4)}
                  height={30}
                  rx={4}
                  fill={color}
                  opacity={0.3}
                />
                <rect
                  x={x1}
                  y={y}
                  width={Math.max(x2 - x1, 4)}
                  height={30}
                  rx={4}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                />

                {/* Creator name */}
                <text
                  x={x1 - 5}
                  y={y + 20}
                  textAnchor="end"
                  fill="#e4e4e7"
                  fontSize="12"
                  fontWeight="500"
                >
                  {creator.name.split(" ").pop()}
                </text>

                {/* Works as dots */}
                {creator.works.map((work) => {
                  const wx =
                    ((work.year - TIMELINE_START) / TIMELINE_RANGE) * 800 + 50;
                  return (
                    <g key={work.slug}>
                      <circle cx={wx} cy={y + 15} r={4} fill={color} />
                      <title>
                        {work.title} ({work.year})
                      </title>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Influence arrows */}
          {creators.map((creator) => {
            const fromIdx = sortedCreators.findIndex(
              (c) => c.slug === creator.slug,
            );
            const fromY = fromIdx * 70 + 65;
            const { end: fromEnd } = parseYears(creator.years);
            const fromX =
              ((fromEnd - TIMELINE_START) / TIMELINE_RANGE) * 800 + 50;

            return creator.influenced.map((targetId) => {
              const toIdx = sortedCreators.findIndex(
                (c) => c.slug === targetId,
              );
              const target = creators.find((c) => c.slug === targetId);
              if (!target || toIdx < 0) return null;
              const toY = toIdx * 70 + 50;
              const { start: toStart } = parseYears(target.years);
              const toX =
                ((toStart - TIMELINE_START) / TIMELINE_RANGE) * 800 + 50;

              return (
                <line
                  key={`${creator.slug}-${targetId}`}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  strokeDasharray="3,3"
                  markerEnd="url(#arrowhead)"
                />
              );
            });
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="6"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="#f59e0b" opacity="0.6" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
