'use client';

import { useState } from 'react';
import { Share2, Link2, Twitter, Facebook, Check, X } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
}

export default function ShareButton({ title, description = '', url }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `Check out ${title} on Lineage Lit - ${description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Share Lineage</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-400 text-sm mb-6">
              Share &ldquo;{title}&rdquo; with your network
            </p>

            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>

              {/* Twitter */}
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-lg hover:bg-[#1DA1F2]/30 transition"
              >
                <Twitter className="w-4 h-4" />
                Share on Twitter
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4267B2]/20 text-[#4267B2] rounded-lg hover:bg-[#4267B2]/30 transition"
              >
                <Facebook className="w-4 h-4" />
                Share on Facebook
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
