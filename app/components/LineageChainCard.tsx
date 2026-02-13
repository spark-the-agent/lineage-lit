"use client";

import { useState } from "react";
import { Zap, Share2 } from "lucide-react";
import { useCreatorLookup } from "@/lib/use-convex-data";
import { findPath } from "@/lib/path-finder";
import CreatorPicker from "./CreatorPicker";

interface LineageChainCardProps {
  fromCreatorSlug: string;
}

export default function LineageChainCard({
  fromCreatorSlug,
}: LineageChainCardProps) {
  const getCreatorBySlug = useCreatorLookup();
  const [targetSlug, setTargetSlug] = useState("");

  const result = targetSlug ? findPath(fromCreatorSlug, targetSlug) : null;
  const fromCreator = getCreatorBySlug(fromCreatorSlug);

  const handleShare = async () => {
    if (!result) return;
    const names = result.path.map((c) => c.name).join(" → ");
    const text = `${names} — ${result.length} degrees of literary influence!`;
    if (navigator.share) {
      await navigator.share({ title: "Literary Connection", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        Find a Connection
      </h4>

      <CreatorPicker
        value={targetSlug}
        onChange={setTargetSlug}
        excludeSlug={fromCreatorSlug}
        label={`Connect ${fromCreator?.name?.split(" ").pop() || ""} to`}
      />

      {result && (
        <div className="mt-3">
          {/* SVG chain */}
          <svg viewBox="0 0 400 60" className="w-full h-auto">
            {result.path.map((creator, i) => {
              const x = (i / (result.path.length - 1)) * 340 + 30;
              return (
                <g key={creator.slug}>
                  {i < result.path.length - 1 && (
                    <line
                      x1={x + 12}
                      y1={30}
                      x2={((i + 1) / (result.path.length - 1)) * 340 + 30 - 12}
                      y2={30}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={30}
                    r="12"
                    fill="#18181b"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={55}
                    textAnchor="middle"
                    fill="#d4d4d8"
                    fontSize="9"
                  >
                    {creator.name.split(" ").pop()}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-500">
              {result.length} degree{result.length !== 1 ? "s" : ""} of
              separation
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>
          </div>
        </div>
      )}

      {targetSlug && !result && (
        <p className="mt-3 text-xs text-zinc-500">No connection found.</p>
      )}
    </div>
  );
}
