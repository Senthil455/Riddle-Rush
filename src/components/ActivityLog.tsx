'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { cn } from '@/lib/utils';

const typeStyles: Record<string, string> = {
  info: 'border-l-4 border-l-blue-400/50 bg-blue-500/5 dark:bg-blue-900/10',
  success: 'border-l-4 border-l-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-900/10',
  warning: 'border-l-4 border-l-amber-500/50 bg-amber-500/5 dark:bg-amber-900/10',
  error: 'border-l-4 border-l-rose-500/50 bg-rose-500/5 dark:bg-rose-900/10',
  riddle: 'border-l-4 border-l-orange-500/50 bg-orange-500/5 dark:bg-orange-900/10',
  dice: 'border-l-4 border-l-purple-500/50 bg-purple-500/5 dark:bg-purple-900/10',
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5 bg-[var(--bg-card-header)]/50">
        <h2 className="font-outfit text-sm font-semibold tracking-wide text-[var(--amber)]">
          Activity Log
        </h2>
        <span className="font-outfit text-xs font-medium text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded-full border border-[var(--border)]">{state.log.length}</span>
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
              className={cn('px-4 py-2.5 rounded-r-xl', typeStyles[entry.type] || typeStyles.info)}
            >
              <span className="font-outfit text-[10px] font-medium text-[var(--text-muted)]">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>{' '}
              <span className="font-outfit text-[12px] font-medium text-[var(--text)]">
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
