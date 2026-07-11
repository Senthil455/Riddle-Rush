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
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 },
};

function DiceFace({ value, transform }: { value: number; transform: string }) {
  const dots = diceDots[value] || diceDots[1];
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform, backfaceVisibility: 'hidden' }}
    >
      <div className="relative h-full w-full bg-[#f5f0fa]">
        <div className="absolute inset-[3px] border-2 border-[#1a0a2e]">
          {dots.map(([cx, cy], i) => (
            <div
              key={i}
              className="absolute h-[15px] w-[15px] rounded-full bg-[#1a0a2e] -translate-x-1/2 -translate-y-1/2"
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
      initial={{
        rotateX: target.x + 180,
        rotateY: target.y + 180,
        y: -40,
        opacity: 0,
      }}
      animate={{
        rotateX: target.x,
        rotateY: target.y,
        y: 0,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 18,
        mass: 0.8,
      }}
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
        <div
          className="flex h-[100px] w-[100px] items-center justify-center shadow-[4px_4px_0px_var(--shadow-strong)]"
          style={{ perspective: '400px' }}
        >
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
