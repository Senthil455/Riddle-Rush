'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { cn } from '@/lib/utils';

const typeStyles: Record<string, string> = {
  info: 'border-l-[3px] border-l-blue-500/40',
  success: 'border-l-[3px] border-l-[var(--emerald)]/50',
  warning: 'border-l-[3px] border-l-[var(--gold)]/50',
  error: 'border-l-[3px] border-l-[var(--crimson)]/50',
  riddle: 'border-l-[3px] border-l-[var(--gold)]/50',
  dice: 'border-l-[3px] border-l-[var(--violet)]/40',
};

export default function ActivityLog() {
  const { state } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [state.log]);

  return (
    <div className="card-panel">
      <div className="card-panel-header">
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--gold)]">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.15em] text-[var(--text)]">
            Chronicle
          </h2>
        </div>
        <span className="font-outfit text-[10px] font-medium text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border)]">
          {state.log.length}
        </span>
      </div>

      <div ref={containerRef} className="max-h-48 space-y-1 overflow-y-auto p-3">
        {state.log.length === 0 && (
          <p className="py-6 text-center font-mono text-[10px] text-[var(--text-muted)]">
            No entries yet
          </p>
        )}
        <AnimatePresence initial={false}>
          {state.log.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn('px-3 py-2 rounded-r-lg', typeStyles[entry.type] || typeStyles.info)}
            >
              <span className="font-outfit text-[9px] font-medium text-[var(--text-muted)]">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                })}
              </span>{' '}
              <span className="font-outfit text-[11px] font-medium text-[var(--text)]">
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
