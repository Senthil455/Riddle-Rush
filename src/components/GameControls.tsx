'use client';

import { useGame } from '@/lib/game-context';
import { cn } from '@/lib/utils';

export default function GameControls() {
  const { state, startGame, pauseGame, resumeGame, resetGame, endGame } = useGame();
  const { status, teams } = state;
  const hasTeams = teams.length >= 2;

  return (
    <div className="border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[4px_4px_0px_var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-4 py-2.5 bg-[var(--bg-card-header)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--amber)]">
          Controls
        </h2>
        {status !== 'not-started' && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
            R{state.round}
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
                'col-span-2 border-2 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider transition-all',
                hasTeams
                  ? 'border-emerald-500 bg-emerald-600 text-white shadow-[4px_4px_0px_rgba(16,185,129,0.4)] hover:bg-emerald-500 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                  : 'border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)]'
              )}
            >
              START GAME
            </button>
          )}

          {status === 'playing' && (
            <button
              onClick={pauseGame}
              className="col-span-2 border-2 border-amber-500 bg-[var(--amber-bg)] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_rgba(245,158,11,0.4)] transition-all hover:brightness-110 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              PAUSE
            </button>
          )}

          {status === 'paused' && (
            <button
              onClick={resumeGame}
              className="col-span-2 border-2 border-emerald-500 bg-emerald-600 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-500 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              RESUME
            </button>
          )}

          {(status === 'playing' || status === 'paused') && (
            <button
              onClick={endGame}
              className="col-span-1 border-2 border-red-800/40 bg-red-900/30 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-red-400/80 transition-all hover:bg-red-800/40 hover:text-red-300 active:translate-x-[2px] active:translate-y-[2px]"
            >
              END
            </button>
          )}

          <button
            onClick={resetGame}
            className="col-span-1 border-2 border-[var(--border)] bg-[var(--bg-card-header)] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] transition-all hover:border-[var(--border-hover)] hover:text-[var(--text)] active:translate-x-[2px] active:translate-y-[2px]"
          >
            RESET
          </button>
        </div>

        {!hasTeams && status === 'not-started' && (
          <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500/60">
            Add at least 2 teams
          </p>
        )}

        {status !== 'not-started' && (
          <div className="mt-3 space-y-2 border-t-2 border-[var(--border)] pt-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-dim)]">
              <span>ROUND <strong className="text-[var(--text)]">{state.round}</strong></span>
              <span>
                TURN{' '}
                <strong className="text-[var(--amber)]">
                  {state.teams[state.currentTeamIndex]?.name || '-'}
                </strong>
              </span>
            </div>

            {status === 'playing' && (
              <div className="space-y-1">
                {state.teams
                  .filter((t) => t.turnsWithoutRiddle >= 2)
                  .map((team) => (
                    <p
                      key={team.id}
                      className="border-2 border-rose-800/30 bg-rose-900/20 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-400/70"
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
