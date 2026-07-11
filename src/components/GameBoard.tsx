'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { BOARD_CELLS } from '@/data/board';
import { BoardCellType } from '@/types';
import { cn } from '@/lib/utils';

const cellStyles: Record<BoardCellType, { bg: string; border: string; text: string; label: string }> = {
  start: {
    bg: 'bg-emerald-700',
    border: 'border-emerald-500',
    text: 'text-white',
    label: 'START',
  },
  regular: {
    bg: 'bg-[var(--bg-input)]',
    border: 'border-[var(--border)]',
    text: 'text-[var(--text-muted)]',
    label: '',
  },
  'riddle-easy': {
    bg: 'bg-amber-200 dark:bg-amber-900/30',
    border: 'border-amber-500',
    text: 'text-amber-800 dark:text-amber-300',
    label: 'EASY',
  },
  'riddle-medium': {
    bg: 'bg-orange-200 dark:bg-orange-900/30',
    border: 'border-orange-500',
    text: 'text-orange-800 dark:text-orange-300',
    label: 'MED',
  },
  'riddle-hard': {
    bg: 'bg-rose-200 dark:bg-rose-900/30',
    border: 'border-rose-500',
    text: 'text-rose-800 dark:text-rose-300',
    label: 'HARD',
  },
  end: {
    bg: 'bg-amber-600',
    border: 'border-amber-400',
    text: 'text-white',
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
        'relative flex flex-col items-center justify-center border-2 transition-all',
        style.bg,
        style.border,
        isSpecial ? 'col-span-2 row-span-2' : '',
        isRiddle ? 'shadow-[2px_2px_0px_var(--shadow)]' : '',
        isStart ? 'shadow-[3px_3px_0px_var(--shadow-strong)]' : ''
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
              className="h-3 w-3 border border-white/40 shadow-[1px_1px_0px_rgba(0,0,0,0.4)]"
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
    <div className="border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[4px_4px_0px_var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-4 py-2.5 bg-[var(--bg-card-header)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--amber)]">
          Game Board
        </h2>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">{BOARD_CELLS.length} cells</span>
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
