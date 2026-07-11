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
    <div className="card-scroll corner-ornament">
      <div className="card-panel-header">
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--gold)]">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.5 13.5L18 21l-6-3-6 3 2.5-7.5" />
          </svg>
          <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.15em] text-[var(--text)]">
            Honor Roll
          </h2>
        </div>
        {state.teams.length > 0 && (
          <span className="font-outfit text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg)]/50 px-2 py-0.5 rounded border border-[var(--border)]">
            {state.teams.length} listed
          </span>
        )}
      </div>

      <div className="p-4">
        {state.teams.length === 0 ? (
          <p className="py-6 text-center font-mono text-[10px] text-[var(--text-muted)]">
            No entries yet
          </p>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((team, i) => (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 transition-all hover:border-[var(--border-hover)]"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {i === 0 ? (
                    <span className="text-sm">👑</span>
                  ) : i === 1 ? (
                    <span className="text-sm">🥈</span>
                  ) : i === 2 ? (
                    <span className="text-sm">🥉</span>
                  ) : (
                    <span className="font-outfit text-[10px] font-bold text-[var(--text-dim)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/40 shadow-inner" style={{ backgroundColor: team.color }} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-outfit text-xs font-bold text-[var(--text)]">{team.name}</p>
                </div>

                <div className="flex items-center gap-3 font-outfit text-[10px]">
                  <div className="text-center">
                    <p className="text-[var(--text-muted)] uppercase font-semibold tracking-wider">Pos</p>
                    <p className="font-bold text-[var(--text)]">{team.position + 1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[var(--text-muted)] uppercase font-semibold tracking-wider">R</p>
                    <p className="font-bold text-[var(--text)]">{team.riddlesAttempted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[var(--text-muted)] uppercase font-semibold tracking-wider">Pts</p>
                    <p className="font-black text-[var(--gold)]">{team.score}</p>
                  </div>
                </div>

                {state.status === 'playing' && state.teams[state.currentTeamIndex]?.id === team.id && (
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-2 py-0.5 font-outfit text-[9px] font-bold uppercase tracking-wider text-[var(--gold)]"
                  >
                    Turn
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
