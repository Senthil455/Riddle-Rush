'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';

export default function ForcedRiddleAlert() {
  const { state, openRiddle } = useGame();
  const { teams, currentTeamIndex, status, turnPhase } = state;

  useEffect(() => {
    if (status !== 'playing' || turnPhase !== 'waiting') return;
    const currentTeam = teams[currentTeamIndex];
    if (currentTeam && currentTeam.turnsWithoutRiddle >= 3) {
      const timer = setTimeout(() => {
        openRiddle(currentTeam.id, 'riddle-medium');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentTeamIndex, status, turnPhase, teams, openRiddle]);

  const forcedTeam = teams.find((t) => t.turnsWithoutRiddle >= 3 && status === 'playing');
  const teamsAtRisk = teams.filter((t) => t.turnsWithoutRiddle >= 2 && t.turnsWithoutRiddle < 3);

  return (
    <>
      <AnimatePresence>
        {forcedTeam && (
          <motion.div
            key="forced-riddle"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed left-1/2 top-6 z-40 -translate-x-1/2"
          >
            <div className="flex items-center gap-4 rounded-xl border-2 border-[var(--crimson)]/30 bg-[var(--bg-card)] shadow-xl shadow-[var(--crimson)]/10 px-5 py-3.5">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[var(--crimson)]/10 text-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--crimson)]">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <p className="font-outfit text-xs font-bold uppercase tracking-wider text-[var(--crimson)]">
                  Forced Riddle
                </p>
                <p className="font-outfit text-[11px] font-medium text-[var(--text-dim)]">
                  {forcedTeam.name} must attempt a riddle
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {teamsAtRisk.length > 0 && status === 'playing' && (
        <div className="fixed left-1/2 top-24 z-30 -translate-x-1/2 space-y-1">
          {teamsAtRisk.map((team) => (
            <div
              key={team.id}
              className="rounded-lg border border-[var(--gold)]/20 bg-[var(--bg-card)]/80 backdrop-blur px-4 py-2 shadow-lg"
            >
              <p className="font-outfit text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                ⚡ {team.name}: {3 - team.turnsWithoutRiddle} turn(s) until forced
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
