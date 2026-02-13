"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LineageGraph from "./LineageGraph";
import { useCreators } from "@/lib/use-convex-data";

function getInitialShowHint(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem("lineage-graph-interacted");
}

export default function InteractiveGraphSection() {
  const creators = useCreators();
  const router = useRouter();
  const [showHint, setShowHint] = useState(getInitialShowHint);

  const handleCreatorClick = (creatorSlug: string) => {
    localStorage.setItem("lineage-graph-interacted", "true");
    setShowHint(false);
    router.push(`/creators/${creatorSlug}`);
  };

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800">
      <p className="text-zinc-500 text-center mb-4 text-sm">
        Hover to see connections. Click any creator to explore their lineage.
      </p>
      <LineageGraph
        creators={creators}
        onCreatorClick={handleCreatorClick}
        showHint={showHint}
        height={500}
      />
    </div>
  );
}
