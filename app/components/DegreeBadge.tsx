'use client';

import { useMemo } from 'react';
import { usePersistence } from './PersistenceProvider';
import { findPath } from '@/lib/path-finder';

interface DegreeBadgeProps {
  creatorId: string;
}

export default function DegreeBadge({ creatorId }: DegreeBadgeProps) {
  const { state } = usePersistence();

  const degree = useMemo(() => {
    if (state.savedCreators.length === 0) return null;
    if (state.savedCreators.includes(creatorId)) return 0;

    let minDegree = Infinity;
    for (const savedId of state.savedCreators) {
      const result = findPath(savedId, creatorId);
      if (result && result.length < minDegree) {
        minDegree = result.length;
      }
    }
    return minDegree === Infinity ? null : minDegree;
  }, [creatorId, state.savedCreators]);

  if (degree === null || degree === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
      {degree}°
    </span>
  );
}
