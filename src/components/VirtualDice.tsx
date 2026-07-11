'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';

const diceDots: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [25, 75], [75, 25], [75, 75]],
  5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
  6: [[25, 25], [25, 75], [50, 25], [50, 75], [75, 25], [75, 75]],
};

function DiceFace({ value }: { value: number }) {
  const dots = diceDots[value] || diceDots[1];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="4" width="92" height="92" rx="0" ry="0" fill="#e8e0f0" stroke="#1a0a2e" strokeWidth="3" />
      <rect x="8" y="8" width="84" height="84" rx="0" ry="0" fill="#f5f0fa" stroke="none" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#1a0a2e" />
      ))}
    </svg>
  );
}

export default function VirtualDice() {
  const { state, rollDice, nextTurn } = useGame();
  const { dice, status, currentTeamIndex, teams, turnPhase } = state;
  const currentTeam = teams[currentTeamIndex];
  const canRoll = status === 'playing' && turnPhase === 'waiting' && teams.length > 0;
  const canNext = status === 'playing' && turnPhase === 'done' && !dice.isRolling;

  return (
    <div className="border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[4px_4px_0px_var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-4 py-2.5 bg-[var(--bg-card-header)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--amber)]">
          Dice
        </h2>
        {teams.length > 0 && currentTeam && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
            {currentTeam.name}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 p-5">
        <div className="h-28 w-28 shadow-[4px_4px_0px_var(--shadow-strong)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={dice.isRolling ? 'rolling' : `face-${dice.value}`}
              initial={dice.isRolling ? { rotate: 0 } : { rotate: 360, scale: 0.5 }}
              animate={
                dice.isRolling
                  ? {
                      rotate: [0, 90, 180, 270, 360],
                      scale: [1, 1.15, 0.85, 1.1, 1],
                    }
                  : { rotate: 0, scale: 1 }
              }
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: dice.isRolling ? 0.7 : 0.35, ease: 'easeOut' }}
              className="h-full w-full"
            >
              <DiceFace value={dice.isRolling ? 1 : dice.value} />
            </motion.div>
          </AnimatePresence>
        </div>

        {!dice.isRolling && turnPhase !== 'waiting' && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="font-mono text-4xl font-black text-[var(--amber)]"
          >
            {dice.value}
          </motion.p>
        )}

        {turnPhase === 'waiting' && (
          <button
            onClick={rollDice}
            disabled={!canRoll}
            className={`w-full border-2 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider transition-all ${
              canRoll
                ? 'border-amber-500 bg-[var(--amber-bg)] text-black shadow-[4px_4px_0px_rgba(245,158,11,0.4)] hover:brightness-110 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                : 'border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)]'
            }`}
          >
            {dice.isRolling ? 'ROLLING...' : 'ROLL DICE'}
          </button>
        )}

        {canNext && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => nextTurn()}
            className="w-full border-2 border-emerald-500 bg-emerald-600 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-500 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            NEXT TURN →
          </motion.button>
        )}
      </div>
    </div>
  );
}
