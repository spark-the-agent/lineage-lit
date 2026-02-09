'use client';

import { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { saveCreator, unsaveCreator, isCreatorSaved } from '@/lib/social';

interface SaveCreatorButtonProps {
  creatorId: string;
}

export default function SaveCreatorButton({ creatorId }: SaveCreatorButtonProps) {
  const [isSaved, setIsSaved] = useState(() => isCreatorSaved(creatorId));
  const [showFeedback, setShowFeedback] = useState(false);

  const handleClick = () => {
    if (isSaved) {
      unsaveCreator(creatorId);
      setIsSaved(false);
    } else {
      saveCreator(creatorId);
      setIsSaved(true);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        isSaved 
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      }`}
    >
      {isSaved ? (
        <>
          <Check className="w-4 h-4" />
          {showFeedback ? 'Saved!' : 'Saved'}
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Save
        </>
      )}
    </button>
  );
}
