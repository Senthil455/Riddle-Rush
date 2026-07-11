'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { cn } from '@/lib/utils';

const typeStyles: Record<string, string> = {
  info: 'border-l-2 border-l-[var(--border)] bg-[var(--bg-card-header)]/30',
  success: 'border-l-2 border-l-emerald-500/50 bg-emerald-900/20',
  warning: 'border-l-2 border-l-amber-500/50 bg-amber-900/20',
  error: 'border-l-2 border-l-rose-500/50 bg-rose-900/20',
  riddle: 'border-l-2 border-l-orange-500/50 bg-orange-900/20',
  dice: 'border-l-2 border-l-amber-500/50 bg-amber-900/20',
};

export default function ActivityLog() {
  const { state } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [state.log]);

  return (
    <div className="border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[4px_4px_0px_var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-4 py-2.5 bg-[var(--bg-card-header)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--amber)]">
          Activity Log
        </h2>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">{state.log.length}</span>
      </div>

      <div ref={containerRef} className="max-h-52 space-y-1.5 overflow-y-auto p-4">
        {state.log.length === 0 && (
          <p className="py-6 text-center font-mono text-xs text-[var(--text-muted)]">NO ACTIVITY</p>
        )}
        <AnimatePresence initial={false}>
          {state.log.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn('px-3 py-2', typeStyles[entry.type] || typeStyles.info)}
            >
              <span className="font-mono text-[9px] text-[var(--text-muted)]">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>{' '}
              <span className="font-mono text-[11px] font-medium text-[var(--text)]">
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
