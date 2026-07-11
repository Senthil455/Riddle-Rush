'use client';

import { useGame } from '@/lib/game-context';

export default function GameControls() {
  const { state, startGame, pauseGame, resumeGame, resetGame, endGame } = useGame();
  const { status, teams } = state;
  const hasTeams = teams.length >= 2;

  return (
    <div className="card-panel corner-ornament">
      <div className="card-panel-header">
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--gold)]">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.15em] text-[var(--text)]">
            Control Panel
          </h2>
        </div>
        {status !== 'not-started' && (
          <span className="font-outfit text-[10px] font-medium text-[var(--text-dim)] bg-[var(--bg)]/50 px-2 py-0.5 rounded border border-[var(--border)]">
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
              className={`col-span-2 rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider transition-all ${
                hasTeams
                  ? 'btn-emerald'
                  : 'border border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)]'
              }`}
            >
              Commence Expedition
            </button>
          )}

          {status === 'playing' && (
            <button
              onClick={pauseGame}
              className="btn-gold col-span-2 rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider"
            >
              Pause
            </button>
          )}

          {status === 'paused' && (
            <button
              onClick={resumeGame}
              className="btn-emerald col-span-2 rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider"
            >
              Resume
            </button>
          )}

          {(status === 'playing' || status === 'paused') && (
            <button
              onClick={endGame}
              className="btn-danger col-span-1 rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider"
            >
              Conclude
            </button>
          )}

          <button
            onClick={resetGame}
            className="btn-ghost col-span-1 rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider"
          >
            Reset
          </button>
        </div>

        {!hasTeams && status === 'not-started' && (
          <p className="mt-3 text-center font-outfit text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]/60">
            Register at least 2 teams to begin
          </p>
        )}

        {status !== 'not-started' && (
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
            <div className="divider-rune">
              <span>session status</span>
            </div>
            <div className="flex items-center justify-between font-outfit text-xs text-[var(--text-dim)]">
              <span>Round <strong className="text-[var(--text)] font-semibold">{state.round}</strong></span>
              <span>
                Turn:{' '}
                <strong className="text-[var(--gold)] font-semibold">
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
                      className="rounded-lg border border-[var(--crimson)]/20 bg-[var(--crimson)]/5 px-3 py-2 font-outfit text-[11px] font-medium text-[var(--crimson)]"
                    >
                      ⚡ {team.name} — forced in {3 - team.turnsWithoutRiddle}
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
