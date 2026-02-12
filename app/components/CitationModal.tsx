"use client";

import { useState } from "react";
import { X, Copy, Check, FileText } from "lucide-react";
import { Creator, Work } from "@/lib/data";
import {
  generateCitation,
  CitationFormat,
  formatLabels,
} from "@/lib/citations";

interface CitationModalProps {
  creator: Creator;
  work?: Work;
  onClose: () => void;
}

export default function CitationModal({
  creator,
  work,
  onClose,
}: CitationModalProps) {
  const [format, setFormat] = useState<CitationFormat>("apa");
  const [copied, setCopied] = useState(false);

  const citation = generateCitation({ creator, work }, { format });

  // Strip HTML tags for plain text copy
  const plainCitation = citation.replace(/<\/?i>/g, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = plainCitation;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl p-6 max-w-lg w-full border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Cite {work ? `"${work.title}"` : creator.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Format picker */}
        <div className="flex gap-2 mb-4">
          {(Object.keys(formatLabels) as CitationFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                format === f
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {formatLabels[f].name}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-500 mb-3">
          {formatLabels[format].description}
        </p>

        {/* Citation output */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 mb-4">
          <p
            className="text-sm text-zinc-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: citation }}
          />
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-zinc-900 rounded-lg font-medium hover:bg-amber-400 transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Citation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
