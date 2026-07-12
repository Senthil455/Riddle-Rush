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

const FACE_VALUES = [1, 6, 3, 4, 2, 5];

const faceTransforms = [
  'translateZ(50px)',
  'rotateY(180deg) translateZ(50px)',
  'rotateY(-90deg) translateZ(50px)',
  'rotateY(90deg) translateZ(50px)',
  'rotateX(-90deg) translateZ(50px)',
  'rotateX(90deg) translateZ(50px)',
];

const targetRotations: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 90, y: 0 },
  3: { x: 0, y: 90 },
  4: { x: 0, y: -90 },
  5: { x: -90, y: 0 },
  6: { x: 0, y: 180 },
};

function DiceFace({ value, transform }: { value: number; transform: string }) {
  const dots = diceDots[value] || diceDots[1];
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform, backfaceVisibility: 'hidden' }}
    >
      <div className="relative h-full w-full rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-xl border border-white/5">
        <div className="absolute inset-1 rounded-lg border border-black/20 bg-black/30">
          {dots.map(([cx, cy], i) => (
            <div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-100 -translate-x-1/2 -translate-y-1/2 shadow-inner"
              style={{ left: `${cx}%`, top: `${cy}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RollingCube() {
  return (
    <motion.div
      className="relative h-full w-full"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ rotateX: 0, rotateY: 0 }}
      animate={{ rotateX: 1080, rotateY: 1080 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {faceTransforms.map((t, i) => (
        <DiceFace key={i} value={FACE_VALUES[i]} transform={t} />
      ))}
    </motion.div>
  );
}

function ResultCube({ value }: { value: number }) {
  const target = targetRotations[value] || targetRotations[1];
  return (
    <motion.div
      className="relative h-full w-full"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ rotateX: target.x + 180, rotateY: target.y + 180, y: -40, opacity: 0 }}
      animate={{ rotateX: target.x, rotateY: target.y, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.8 }}
    >
      {faceTransforms.map((t, i) => (
        <DiceFace key={i} value={FACE_VALUES[i]} transform={t} />
      ))}
    </motion.div>
  );
}

export default function VirtualDice() {
  const { state, rollDice, nextTurn } = useGame();
  const { dice, status, currentTeamIndex, teams, turnPhase } = state;
  const currentTeam = teams[currentTeamIndex];
  const canRoll = status === 'playing' && turnPhase === 'waiting' && teams.length > 0;
  const canNext = status === 'playing' && turnPhase === 'done' && !dice.isRolling;

  return (
    <div className="dice-tray corner-ornament">
      <div className="card-panel-header">
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--gold)]">
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
          </svg>
          <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.15em] text-[var(--text)]">
            Fate Roll
          </h2>
        </div>
        {teams.length > 0 && currentTeam && (
          <span className="font-outfit text-[10px] font-medium text-[var(--text-dim)] px-2 py-0.5 rounded border border-[var(--border)]">
            {currentTeam.name}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-5 p-5">
        <div className="flex h-[90px] w-[90px] items-center justify-center" style={{ perspective: '800px' }}>
          <AnimatePresence mode="wait">
            {dice.isRolling ? (
              <RollingCube key="rolling" />
            ) : (
              <ResultCube key={`face-${dice.value}`} value={dice.value} />
            )}
          </AnimatePresence>
        </div>

        {!dice.isRolling && turnPhase !== 'waiting' && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="font-mono text-3xl font-black text-[var(--gold)]"
          >
            {dice.value}
          </motion.p>
        )}

        {turnPhase === 'waiting' && (
          <button
            onClick={rollDice}
            disabled={!canRoll}
            className={`w-full rounded-lg px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider transition-all ${
              canRoll
                ? 'btn-gold'
                : 'border border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)]'
            }`}
          >
            {dice.isRolling ? 'Rolling...' : 'Cast Dice'}
          </button>
        )}

        {canNext && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => nextTurn()}
            className="btn-emerald w-full rounded-lg px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider"
          >
            Next Turn →
          </motion.button>
        )}
      </div>
    </div>
  );
}
