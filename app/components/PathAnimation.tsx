"use client";

import { Creator } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PathAnimationProps {
  path: Creator[];
}

export default function PathAnimation({ path }: PathAnimationProps) {
  if (path.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Animated chain */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {path.map((creator, i) => (
          <div
            key={creator.slug}
            className="flex items-center gap-2 sm:gap-3"
            style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.3}s both` }}
          >
            <Link href={`/creators/${creator.slug}`} className="relative group">
              <div className="bg-zinc-900 rounded-xl px-4 py-3 border-2 border-amber-500/50 group-hover:border-amber-400 transition shadow-lg shadow-amber-500/10">
                <div className="font-semibold text-amber-400 text-sm sm:text-base">
                  {creator.name}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500">
                  {creator.years}
                </div>
              </div>
              {/* Glow effect */}
              <div
                className="absolute inset-0 bg-amber-500/20 rounded-xl blur-xl -z-10"
                style={{
                  animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            </Link>
            {i < path.length - 1 && (
              <div
                className="text-amber-500"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${i * 0.3 + 0.15}s both`,
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result summary */}
      <div className="text-center">
        <p className="text-lg font-semibold text-zinc-200">
          <span className="text-amber-400">{path[0].name}</span> to{" "}
          <span className="text-amber-400">{path[path.length - 1].name}</span>{" "}
          in{" "}
          <span className="text-amber-400">
            {path.length - 1} step{path.length - 1 !== 1 ? "s" : ""}
          </span>
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
