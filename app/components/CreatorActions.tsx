"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import ShareButton from "./ShareButton";
import SaveCreatorButton from "./SaveCreatorButton";
import CitationModal from "./CitationModal";
import { getCreatorById } from "@/lib/data";

interface CreatorActionsProps {
  creatorId: string;
  creatorName: string;
}

export default function CreatorActions({
  creatorId,
  creatorName,
}: CreatorActionsProps) {
  const [showCitation, setShowCitation] = useState(false);
  const creator = getCreatorById(creatorId);

  return (
    <>
      <div className="flex gap-2">
        <SaveCreatorButton creatorId={creatorId} />
        <button
          onClick={() => setShowCitation(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 rounded-full text-xs text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition min-h-[32px]"
        >
          <FileText className="w-3.5 h-3.5" />
          Cite
        </button>
        <ShareButton
          title={creatorName}
          description={`Explore the creative lineage of ${creatorName} on Lineage Lit`}
        />
      </div>
      {showCitation && creator && (
        <CitationModal
          creator={creator}
          onClose={() => setShowCitation(false)}
        />
      )}
    </>
  );
}
