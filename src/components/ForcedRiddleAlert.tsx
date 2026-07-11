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

  const forcedTeam = teams.find(
    (t) => t.turnsWithoutRiddle >= 3 && status === 'playing'
  );

  const teamsAtRisk = teams.filter(
    (t) => t.turnsWithoutRiddle >= 2 && t.turnsWithoutRiddle < 3
  );

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
            <div className="flex items-center gap-4 rounded-2xl border border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/90 backdrop-blur-md px-6 py-4 shadow-xl shadow-rose-500/10">
              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/50 text-xl shadow-inner">⚡</span>
              <div>
                <p className="font-outfit text-sm font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  Forced Riddle
                </p>
                <p className="font-outfit text-xs font-medium text-rose-500/80 dark:text-rose-400/80">
                  {forcedTeam.name} must attempt a riddle
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {teamsAtRisk.length > 0 && status === 'playing' && (
        <div className="space-y-1 px-4">
          {teamsAtRisk.map((team) => (
            <p
              key={team.id}
              className="font-outfit text-xs font-semibold uppercase tracking-wider text-amber-500/80 dark:text-amber-400/80 drop-shadow-sm"
            >
              ⚡ {team.name}: {3 - team.turnsWithoutRiddle} turn(s) until forced
            </p>
          ))}
        </div>
      )}
    </>
  );
}
