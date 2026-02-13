"use client";

import { Download } from "lucide-react";
import { downloadNetworkJSON } from "@/lib/export";
import { useCreators } from "@/lib/use-convex-data";

export default function ExportNetworkButton() {
  const creators = useCreators();
  return (
    <button
      onClick={() => downloadNetworkJSON(creators)}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition min-h-[44px]"
    >
      <Download className="w-4 h-4" />
      Export Network
    </button>
  );
}
