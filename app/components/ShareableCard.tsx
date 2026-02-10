'use client';

import { useRef, useCallback, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { renderDNACard, CardData } from '@/lib/card-renderer';
import { downloadBlob } from '@/lib/export';

interface ShareableCardProps {
  data: CardData;
  onClose: () => void;
}

export default function ShareableCard({ data, onClose }: ShareableCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  const renderCard = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas || rendered) return;
    canvasRef.current = canvas;
    renderDNACard(canvas, data);
    setRendered(true);
  }, [data, rendered]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.username}-reading-dna.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      if (navigator.share) {
        try {
          const file = new File([blob], `${data.username}-reading-dna.png`, { type: 'image/png' });
          await navigator.share({
            title: `${data.displayName}'s Reading DNA`,
            text: `Check out my Reading DNA on Lineage Lit!`,
            files: [file],
          });
          return;
        } catch {
          // fall through to copy
        }
      }

      // Fallback: copy text
      const text = `My Reading DNA: ${data.readingDNA.literaryDNA.join(', ')} | ${data.readingDNA.totalBooks} books | ${data.readingDNA.influenceScore}% influence score`;
      await navigator.clipboard.writeText(text);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 rounded-2xl p-6 max-w-2xl w-full border border-zinc-700 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-zinc-100">Your Reading DNA Card</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Canvas preview */}
        <div className="rounded-lg overflow-hidden border border-zinc-700 mb-4">
          <canvas
            ref={renderCard}
            className="w-full"
            style={{ aspectRatio: '1200/630' }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-zinc-900 font-medium rounded-lg hover:bg-amber-400 transition"
          >
            <Download className="w-4 h-4" />
            Download Card
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
