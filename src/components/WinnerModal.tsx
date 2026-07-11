'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';

export default function WinnerModal() {
  const { state, resetGame } = useGame();

  const winner = useMemo(() => {
    if (state.status !== 'ended' || state.teams.length === 0) return null;
    return [...state.teams].sort((a, b) => {
      if (a.position !== b.position) return b.position - a.position;
      return b.score - a.score;
    })[0];
  }, [state.status, state.teams]);

  if (state.status !== 'ended' || !winner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          className="w-full max-w-md border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[8px_8px_0px_var(--shadow)]"
        >
          <div className="border-b-2 border-amber-500/40 bg-amber-500/10 px-6 py-4 text-center">
            <motion.span
              animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="block text-5xl"
            >
              🏆
            </motion.span>
            <h2 className="mt-2 font-mono text-sm font-black uppercase tracking-[0.15em] text-[var(--amber)]">
              CHAMPION CROWNED
            </h2>
          </div>

          <div className="p-6 text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-3 border-2 border-amber-500/30 bg-amber-500/10 px-6 py-3 shadow-[4px_4px_0px_var(--shadow-strong)]">
              <div
                className="h-4 w-4 border border-[var(--border)]"
                style={{ backgroundColor: winner.color }}
              />
              <span className="font-outfit text-xl font-black text-[var(--amber)]">
                {winner.name}
              </span>
            </div>

            <p className="mb-6 font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
              Final Standings
            </p>

            <div className="mb-6 space-y-2">
              {[...state.teams]
                .sort((a, b) => {
                  if (a.position !== b.position) return b.position - a.position;
                  return b.score - a.score;
                })
                .map((team, i) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between border-2 border-[var(--border)] bg-[var(--bg-card-header)]/30 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[var(--text-dim)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div
                        className="h-2.5 w-2.5 border border-[var(--border)]"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-outfit text-sm font-bold text-[var(--text)]">
                        {team.name}
                      </span>
                    </div>
                    <div className="flex gap-4 font-mono text-[10px] text-[var(--text-dim)]">
                      <span>
                        POS{' '}
                        <strong className="text-[var(--text)]">{team.position + 1}</strong>
                      </span>
                      <span>
                        S{' '}
                        <strong className="text-[var(--amber)]">{team.score}</strong>
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={resetGame}
              className="w-full border-2 border-amber-500 bg-[var(--amber-bg)] px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_rgba(245,158,11,0.4)] transition-all hover:brightness-110 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              NEW GAME
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
