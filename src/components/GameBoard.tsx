'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { BOARD_CELLS } from '@/data/board';
import { BoardCellType } from '@/types';
import { cn } from '@/lib/utils';

const cellStyles: Record<BoardCellType, { bg: string; border: string; text: string; label: string }> = {
  start: {
    bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    border: 'border-emerald-300/50 shadow-emerald-500/30',
    text: 'text-white drop-shadow-sm',
    label: 'START',
  },
  regular: {
    bg: 'bg-[var(--bg-input)]',
    border: 'border-[var(--border)] shadow-sm hover:shadow-md',
    text: 'text-[var(--text-muted)]',
    label: '',
  },
  'riddle-easy': {
    bg: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40',
    border: 'border-amber-300/50 dark:border-amber-700/50 shadow-amber-500/10',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'EASY',
  },
  'riddle-medium': {
    bg: 'bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-900/40 dark:to-orange-800/40',
    border: 'border-orange-400/50 dark:border-orange-700/50 shadow-orange-500/20',
    text: 'text-orange-800 dark:text-orange-200',
    label: 'MED',
  },
  'riddle-hard': {
    bg: 'bg-gradient-to-br from-rose-200 to-rose-300 dark:from-rose-900/40 dark:to-rose-800/40',
    border: 'border-rose-400/50 dark:border-rose-700/50 shadow-rose-500/20',
    text: 'text-rose-800 dark:text-rose-200',
    label: 'HARD',
  },
  end: {
    bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    border: 'border-indigo-400/50 shadow-indigo-500/30',
    text: 'text-white drop-shadow-sm',
    label: 'END',
  },
};

function BoardCellView({ cellIndex }: { cellIndex: number }) {
  const { state } = useGame();
  const cell = BOARD_CELLS[cellIndex];
  if (!cell) return null;

  const style = cellStyles[cell.type];
  const teamsHere = state.teams.filter((t) => t.position === cellIndex);
  const isRiddle = cell.type === 'riddle-easy' || cell.type === 'riddle-medium' || cell.type === 'riddle-hard';
  const isSpecial = cell.type === 'start' || cell.type === 'end';
  const isStart = cell.type === 'start';

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center border transition-all duration-300 rounded-xl',
        style.bg,
        style.border,
        isSpecial ? 'col-span-2 row-span-2 shadow-lg' : 'shadow-sm hover:scale-[1.02] hover:shadow-md hover:z-10',
        isRiddle ? 'shadow-md' : ''
      )}
      style={{ minHeight: isSpecial ? '72px' : '52px', minWidth: isSpecial ? '68px' : '48px' }}
    >
      <div className="flex flex-col items-center gap-0">
        {isStart && (
          <span className={cn('font-mono text-[9px] font-black tracking-wider', style.text)}>
            {cell.label}
          </span>
        )}
        {!isStart && !isRiddle && !isSpecial && (
          <span className={cn('font-mono text-[8px] font-bold', style.text)}>
            {cell.label}
          </span>
        )}
        {isRiddle && (
          <>
            <span className={cn('text-[10px]', style.text)}>●</span>
            <span className={cn('font-mono text-[6px] font-bold uppercase tracking-[0.1em]', style.text)}>
              {style.label}
            </span>
          </>
        )}
        {cell.type === 'end' && (
          <span className={cn('font-mono text-[9px] font-black tracking-wider', style.text)}>
            {cell.label}
          </span>
        )}
      </div>

      {teamsHere.length > 0 && (
        <div className="absolute -bottom-2.5 flex gap-0.5">
          {teamsHere.map((team) => (
              <motion.div
                key={team.id}
                initial={{ scale: 0, y: -8 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="h-3 w-3 rounded-full border border-white/60 shadow-sm"
                style={{ backgroundColor: team.color }}
                title={team.name}
              />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GameBoard() {
  const rows = useMemo(() => {
    const totalCells = BOARD_CELLS.length;
    const COLS = 7;
    const rows: number[][] = [];
    let i = 0;
    while (i < totalCells) {
      const row = [];
      for (let j = 0; j < COLS && i < totalCells; j++) {
        row.push(i);
        i++;
      }
      if (rows.length % 2 === 1) {
        row.reverse();
      }
      rows.push(row);
    }
    return rows;
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5 bg-[var(--bg-card-header)]/50">
        <h2 className="font-outfit text-sm font-semibold tracking-wide text-[var(--amber)]">
          Game Board
        </h2>
        <span className="font-outfit text-xs font-medium text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded-full border border-[var(--border)]">{BOARD_CELLS.length} cells</span>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex flex-col gap-1">
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((cellIndex) => (
                  <BoardCellView key={cellIndex} cellIndex={cellIndex} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
