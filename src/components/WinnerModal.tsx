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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/90 p-4"
        >
          <motion.div
            key="winner-modal"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            className="w-full max-w-md rounded-lg border-2 border-[var(--gold)]/30 bg-[var(--bg-card)] shadow-2xl overflow-hidden"
          >
            <div className="relative border-b-2 border-[var(--gold)]/20 bg-gradient-to-b from-[var(--gold)]/10 to-transparent px-6 py-8 text-center">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--gold)]/20" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--gold)]/20" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--gold)]/20" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--gold)]/20" />
              </div>
              <motion.span
                animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="block text-5xl drop-shadow-md"
              >
                🏆
              </motion.span>
              <h2 className="mt-3 font-outfit text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                Champion Crowned
              </h2>
              <div className="divider-rune mt-3 max-w-[180px] mx-auto" />
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-5 inline-flex items-center gap-3 rounded-lg border-2 border-[var(--gold)]/20 bg-[var(--gold)]/5 px-5 py-2.5">
                <div
                  className="h-3.5 w-3.5 rounded-full border border-white/40 shadow-inner"
                  style={{ backgroundColor: winner.color }}
                />
                <span className="font-outfit text-lg font-black text-[var(--gold)]">
                  {winner.name}
                </span>
              </div>

              <div className="divider-rune mb-4">
                <span>final standings</span>
              </div>

              <div className="mb-5 space-y-1.5">
                {[...state.teams]
                  .sort((a, b) => {
                    if (a.position !== b.position) return b.position - a.position;
                    return b.score - a.score;
                  })
                  .map((team, i) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-card-header)]/50 px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-outfit text-xs font-bold text-[var(--text-dim)] w-5 text-right">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div
                          className="h-2.5 w-2.5 rounded-full border border-white/40 shadow-inner"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-outfit text-xs font-bold text-[var(--text)]">
                          {team.name}
                        </span>
                      </div>
                      <div className="flex gap-4 font-outfit text-[10px] text-[var(--text-dim)] font-medium">
                        <span>Pos: <strong className="text-[var(--text)]">{team.position + 1}</strong></span>
                        <span>Score: <strong className="text-[var(--gold)]">{team.score}</strong></span>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                onClick={resetGame}
                className="btn-gold mt-4 w-full rounded-lg px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider"
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
