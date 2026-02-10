import { getState, setState } from './persistence';
import { creators } from './data';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const dateA = new Date(a + 'T00:00:00');
  const dateB = new Date(b + 'T00:00:00');
  return Math.round((dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
}

export function recordDailyVisit(): void {
  const state = getState();
  const today = todayStr();
  const { lastVisitDate, currentStreak, longestStreak } = state.streakData;

  if (lastVisitDate === today) return; // Already visited today

  let newStreak = 1;
  if (lastVisitDate) {
    const gap = daysBetween(lastVisitDate, today);
    if (gap === 1) {
      newStreak = currentStreak + 1;
    }
    // gap > 1 means streak broken, reset to 1
  }

  setState({
    streakData: {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      lastVisitDate: today,
      streakStartDate: newStreak === 1 ? today : state.streakData.streakStartDate,
    },
  });
}

export function getStreakInfo() {
  const state = getState();
  const today = todayStr();
  const { currentStreak, longestStreak, lastVisitDate } = state.streakData;

  // Check if streak is still active (visited today or yesterday)
  let activeStreak = 0;
  if (lastVisitDate) {
    const gap = daysBetween(lastVisitDate, today);
    if (gap === 0) activeStreak = currentStreak;
    else if (gap === 1) activeStreak = currentStreak; // Still have today to extend
  }

  return {
    currentStreak: activeStreak,
    longestStreak,
    isActiveToday: lastVisitDate === today,
  };
}

export function getDiscoveryProgress() {
  const state = getState();
  const totalCreators = creators.length;
  const viewedCount = state.viewedCreators.length;
  return {
    viewed: viewedCount,
    total: totalCreators,
    percentage: Math.round((viewedCount / totalCreators) * 100),
  };
}
