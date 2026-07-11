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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5 bg-[var(--bg-card-header)]/50">
        <h2 className="font-outfit text-sm font-semibold tracking-wide text-[var(--amber)]">
          Leaderboard
        </h2>
        {state.teams.length > 0 && (
          <span className="font-outfit text-xs font-medium text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded-full border border-[var(--border)]">Top {state.teams.length}</span>
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
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm p-3.5 transition-all hover:border-[var(--border-hover)] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                    {i === 0 ? (
                      <span className="text-lg">👑</span>
                    ) : i === 1 ? (
                      <span className="text-lg">🥈</span>
                    ) : i === 2 ? (
                      <span className="text-lg">🥉</span>
                    ) : (
                      <span className="font-outfit text-sm font-bold text-[var(--text-dim)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  <div
                    className="h-3 w-3 shrink-0 rounded-full border border-white/40 shadow-inner"
                    style={{ backgroundColor: team.color }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-outfit text-sm font-bold text-[var(--text)]">
                      {team.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 font-outfit text-xs">
                    <div className="text-center">
                      <p className="text-[var(--text-dim)] text-[10px] uppercase font-semibold tracking-wide">Pos</p>
                      <p className="font-bold text-[var(--text)]">{team.position + 1}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-dim)] text-[10px] uppercase font-semibold tracking-wide">R</p>
                      <p className="font-bold text-[var(--text)]">{team.riddlesAttempted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-dim)] text-[10px] uppercase font-semibold tracking-wide">Score</p>
                      <p className="font-black text-[var(--amber)]">{team.score}</p>
                    </div>
                  </div>

                  {state.status === 'playing' &&
                    state.teams[state.currentTeamIndex]?.id === team.id && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-outfit text-[10px] font-bold uppercase tracking-wider text-amber-500"
                      >
                        Turn
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
