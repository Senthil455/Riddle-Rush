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

  return (
    <AnimatePresence>
      {state.status === 'ended' && winner && (
        <motion.div
          key="winner-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 p-4"
        >
          <motion.div
            key="winner-modal"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 px-6 py-6 text-center">
            <motion.span
              animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="block text-6xl drop-shadow-md"
            >
              🏆
            </motion.span>
            <h2 className="mt-3 font-outfit text-lg font-black uppercase tracking-widest text-[var(--amber)] drop-shadow-sm">
              Champion Crowned
            </h2>
          </div>

          <div className="p-6 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 px-6 py-3 shadow-md shadow-amber-500/10">
              <div
                className="h-4 w-4 rounded-full border border-white/40 shadow-inner"
                style={{ backgroundColor: winner.color }}
              />
              <span className="font-outfit text-2xl font-black text-[var(--amber)]">
                {winner.name}
              </span>
            </div>

            <p className="mb-4 font-outfit text-xs font-bold uppercase tracking-widest text-[var(--text-dim)]">
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
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card-header)]/50 px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-outfit text-sm font-bold text-[var(--text-dim)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div
                        className="h-3 w-3 rounded-full border border-white/40 shadow-inner"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-outfit text-sm font-bold text-[var(--text)]">
                        {team.name}
                      </span>
                    </div>
                    <div className="flex gap-4 font-outfit text-xs text-[var(--text-dim)] font-medium">
                      <span>
                        Pos:{' '}
                        <strong className="text-[var(--text)]">{team.position + 1}</strong>
                      </span>
                      <span>
                        Score:{' '}
                        <strong className="text-[var(--amber)]">{team.score}</strong>
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={resetGame}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[var(--amber-bg)] to-[var(--amber)] px-4 py-3.5 font-outfit text-sm font-bold text-white shadow-lg shadow-[var(--amber)]/30 transition-all hover:scale-[1.02] hover:shadow-[var(--amber)]/50 active:scale-95"
            >
              Start New Game
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
  );
}
