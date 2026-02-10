'use client';

import { useMemo } from 'react';
import { Target, Check } from 'lucide-react';
import { getWeeklyChallenge, getChallengeProgress } from '@/lib/challenges';
import { usePersistence } from './PersistenceProvider';

export default function WeeklyChallenge() {
  const { state } = usePersistence();

  const challenge = useMemo(() => getWeeklyChallenge(), []);
  const progress = useMemo(
    () => getChallengeProgress(challenge),
    // Re-evaluate when state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [challenge, state.viewedCreators, state.savedCreators]
  );

  const isComplete = progress.current >= progress.target;

  return (
    <div className={`rounded-xl p-4 border ${
      isComplete
        ? 'bg-emerald-500/10 border-emerald-500/20'
        : 'bg-zinc-900/50 border-zinc-800'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{challenge.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Weekly Challenge
            </span>
          </div>
          <h4 className="text-sm font-semibold text-zinc-200 mb-0.5">{challenge.title}</h4>
          <p className="text-xs text-zinc-400 mb-3">{challenge.description}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500 whitespace-nowrap">
              {isComplete ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3" />
                  Done!
                </span>
              ) : (
                `${progress.current}/${progress.target}`
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
