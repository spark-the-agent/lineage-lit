'use client';

import { useEffect, useRef, useState } from 'react';
import { usePersistence } from './PersistenceProvider';
import { Sparkles } from 'lucide-react';

interface CreatorViewTrackerProps {
  creatorId: string;
}

export default function CreatorViewTracker({ creatorId }: CreatorViewTrackerProps) {
  const { state, recordCreatorView } = usePersistence();
  const [showDiscovery, setShowDiscovery] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const alreadyViewed = state.viewedCreators.some(v => v.id === creatorId);
    if (!alreadyViewed) {
      recordCreatorView(creatorId);
      timerRef.current = setTimeout(() => {
        setShowDiscovery(true);
        timerRef.current = setTimeout(() => setShowDiscovery(false), 3000);
      }, 0);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [creatorId, recordCreatorView, state.viewedCreators]);

  if (!showDiscovery) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-pulse">
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-900 rounded-lg shadow-lg font-medium text-sm">
        <Sparkles className="w-4 h-4" />
        New Discovery!
      </div>
    </div>
  );
}
