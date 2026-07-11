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
            className="fixed left-1/2 top-4 z-40 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 border-2 border-rose-500/60 bg-rose-900/80 px-5 py-3 shadow-[6px_6px_0px_var(--shadow-strong)]">
              <span className="font-mono text-lg text-rose-300">⚡</span>
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-wider text-rose-200">
                  FORCED RIDDLE
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-300/60">
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
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400/60"
            >
              ⚡ {team.name}: {3 - team.turnsWithoutRiddle} turn(s) until forced
            </p>
          ))}
        </div>
      )}
    </>
  );
}
