'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { BOARD_CELLS } from '@/data/board';
import { BoardCellType } from '@/types';
import { cn } from '@/lib/utils';

const cellStyles: Record<BoardCellType, { css: string; label: string }> = {
  start: { css: 'cell-start text-white drop-shadow-sm', label: 'START' },
  regular: { css: 'cell-regular text-[var(--text-muted)]', label: '' },
  'riddle-easy': { css: 'cell-easy text-[var(--gold)]', label: '?' },
  'riddle-medium': { css: 'cell-medium text-amber-600 dark:text-amber-400', label: '??' },
  'riddle-hard': { css: 'cell-hard text-[var(--crimson)]', label: '?!' },
  end: { css: 'cell-end text-white drop-shadow-sm', label: 'END' },
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
        'relative flex flex-col items-center justify-center border-2 transition-all duration-300',
        isSpecial ? 'col-span-2 row-span-2 rounded-xl' : 'rounded-lg',
        style.css,
        isSpecial ? 'shadow-lg' : 'shadow-sm hover:shadow-md hover:z-10',
      )}
      style={{ minHeight: isSpecial ? '72px' : '48px', minWidth: isSpecial ? '68px' : '44px' }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {isStart && (
          <span className="font-mono text-[9px] font-black tracking-wider">{cell.label}</span>
        )}
        {!isStart && !isRiddle && !isSpecial && (
          <span className={cn('font-mono text-[8px] font-bold opacity-60', style.css)}>
            {cell.label}
          </span>
        )}
        {isRiddle && (
          <>
            <span className="text-sm font-bold opacity-80">{style.label}</span>
            <span className="font-mono text-[6px] font-bold uppercase tracking-[0.15em] opacity-60">
              {cell.type === 'riddle-easy' ? 'easy' : cell.type === 'riddle-medium' ? 'med' : 'hard'}
            </span>
          </>
        )}
        {cell.type === 'end' && (
          <span className="font-mono text-[9px] font-black tracking-wider">{cell.label}</span>
        )}
      </div>

      {teamsHere.length > 0 && (
        <div className="absolute -bottom-2 flex gap-0.5">
          {teamsHere.map((team) => (
            <motion.div
              key={team.id}
              initial={{ scale: 0, y: -8 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="h-2.5 w-2.5 rounded-full border border-white/70 shadow-md"
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
      if (rows.length % 2 === 1) row.reverse();
      rows.push(row);
    }
    return rows;
  }, []);

  return (
    <div className="card-scroll corner-ornament">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--gold)]">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.15em] text-[var(--text)]">
            Expedition Map
          </h2>
        </div>
        <span className="font-outfit text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg)]/50 px-2 py-0.5 rounded border border-[var(--border)]">
          {BOARD_CELLS.length} hexes
        </span>
      </div>

      <div className="p-3">
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
