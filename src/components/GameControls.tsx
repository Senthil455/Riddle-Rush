'use client';

import { useGame } from '@/lib/game-context';
import { cn } from '@/lib/utils';

export default function GameControls() {
  const { state, startGame, pauseGame, resumeGame, resetGame, endGame } = useGame();
  const { status, teams } = state;
  const hasTeams = teams.length >= 2;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5 bg-[var(--bg-card-header)]/50">
        <h2 className="font-outfit text-sm font-semibold tracking-wide text-[var(--amber)]">
          Controls
        </h2>
        {status !== 'not-started' && (
          <span className="font-outfit text-xs font-medium text-[var(--text-dim)] bg-[var(--bg)] px-2 py-0.5 rounded-full border border-[var(--border)]">
            Round {state.round}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {status === 'not-started' && (
            <button
              onClick={startGame}
              disabled={!hasTeams}
              className={cn(
                'col-span-2 rounded-xl px-4 py-3 font-outfit text-sm font-bold shadow-lg transition-all',
                hasTeams
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:scale-[1.02] hover:shadow-emerald-500/50 active:scale-95'
                  : 'border border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)] shadow-none'
              )}
            >
              Start Game
            </button>
          )}

          {status === 'playing' && (
            <button
              onClick={pauseGame}
              className="col-span-2 rounded-xl bg-gradient-to-r from-[var(--amber-bg)] to-[var(--amber)] px-4 py-3 font-outfit text-sm font-bold text-white shadow-lg shadow-[var(--amber)]/30 transition-all hover:scale-[1.02] hover:shadow-[var(--amber)]/50 active:scale-95"
            >
              Pause
            </button>
          )}

          {status === 'paused' && (
            <button
              onClick={resumeGame}
              className="col-span-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-outfit text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-emerald-500/50 active:scale-95"
            >
              Resume
            </button>
          )}

          {(status === 'playing' || status === 'paused') && (
            <button
              onClick={endGame}
              className="col-span-1 rounded-xl bg-rose-100 dark:bg-rose-900/30 px-4 py-3 font-outfit text-sm font-bold text-rose-600 dark:text-rose-400 shadow-sm transition-all hover:bg-rose-200 dark:hover:bg-rose-900/50 active:scale-95"
            >
              End
            </button>
          )}

          <button
            onClick={resetGame}
            className="col-span-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card-header)] px-4 py-3 font-outfit text-sm font-bold text-[var(--text-dim)] shadow-sm transition-all hover:bg-[var(--border)] hover:text-[var(--text)] active:scale-95"
          >
            Reset
          </button>
        </div>

        {!hasTeams && status === 'not-started' && (
          <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500/60">
            Add at least 2 teams
          </p>
        )}

        {status !== 'not-started' && (
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between font-outfit text-xs text-[var(--text-dim)]">
              <span>Round <strong className="text-[var(--text)] font-semibold">{state.round}</strong></span>
              <span>
                Turn:{' '}
                <strong className="text-[var(--amber)] font-semibold">
                  {state.teams[state.currentTeamIndex]?.name || '-'}
                </strong>
              </span>
            </div>

            {status === 'playing' && (
              <div className="space-y-1.5">
                {state.teams
                  .filter((t) => t.turnsWithoutRiddle >= 2)
                  .map((team) => (
                    <p
                      key={team.id}
                      className="rounded-lg border border-rose-500/20 bg-rose-50 dark:bg-rose-900/10 px-3 py-2 font-outfit text-xs font-medium text-rose-600 dark:text-rose-400"
                    >
                      ⚠ {team.name} — forced in {3 - team.turnsWithoutRiddle}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
