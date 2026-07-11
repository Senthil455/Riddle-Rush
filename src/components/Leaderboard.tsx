'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';

export default function Leaderboard() {
  const { state } = useGame();

  const sorted = useMemo(() => {
    return [...state.teams].sort((a, b) => {
      if (a.position !== b.position) return b.position - a.position;
      return b.score - a.score;
    });
  }, [state.teams]);

  return (
    <div className="border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[4px_4px_0px_var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-4 py-2.5 bg-[var(--bg-card-header)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--amber)]">
          Leaderboard
        </h2>
        {state.teams.length > 0 && (
          <span className="font-mono text-[10px] text-[var(--text-muted)]">TOP {state.teams.length}</span>
        )}
      </div>

      <div className="p-4">
        {state.teams.length === 0 ? (
          <p className="py-6 text-center font-mono text-xs text-[var(--text-muted)]">NO TEAMS YET</p>
        ) : (
          <div className="space-y-2">
            {sorted.map((team, i) => (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-2 border-[var(--border)] bg-[var(--bg-card-header)]/30 p-3 transition-all hover:border-[var(--border-hover)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                    {i === 0 ? (
                      <span className="font-mono text-sm">👑</span>
                    ) : i === 1 ? (
                      <span className="font-mono text-sm">🥈</span>
                    ) : i === 2 ? (
                      <span className="font-mono text-sm">🥉</span>
                    ) : (
                      <span className="font-mono text-[11px] font-bold text-[var(--text-dim)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  <div
                    className="h-2.5 w-2.5 shrink-0 border border-[var(--border)]"
                    style={{ backgroundColor: team.color }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-outfit text-sm font-bold text-[var(--text)]">
                      {team.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                    <div className="text-center">
                      <p className="text-[var(--text-dim)]">POS</p>
                      <p className="font-bold text-[var(--text)]">{team.position + 1}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-dim)]">R</p>
                      <p className="font-bold text-[var(--text)]">{team.riddlesAttempted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-dim)]">S</p>
                      <p className="font-bold text-[var(--amber)]">{team.score}</p>
                    </div>
                  </div>

                  {state.status === 'playing' &&
                    state.teams[state.currentTeamIndex]?.id === team.id && (
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="border-2 border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-amber-400"
                      >
                        TURN
                      </motion.div>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
