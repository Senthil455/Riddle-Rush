'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';

const difficultyConfig = {
  easy: { label: 'EASY', border: 'border-amber-500/50', dot: 'bg-amber-400' },
  medium: { label: 'MEDIUM', border: 'border-orange-500/50', dot: 'bg-orange-400' },
  hard: { label: 'HARD', border: 'border-rose-500/50', dot: 'bg-rose-400' },
};

export default function RiddlePanel() {
  const { state, handleRiddleResult } = useGame();
  const { riddleModal } = state;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentRiddle = riddleModal.riddle;

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !currentRiddle || !riddleModal.teamId) return;
    const correct = selectedAnswer === currentRiddle.answer;
    setShowResult(true);

    setTimeout(() => {
      handleRiddleResult(riddleModal.teamId!, correct);
    }, 1200);
  }, [selectedAnswer, currentRiddle, riddleModal.teamId, handleRiddleResult]);

  if (!riddleModal.open || !currentRiddle) return null;

  const team = state.teams.find((t) => t.id === riddleModal.teamId);
  const config = difficultyConfig[currentRiddle.difficulty];
  const isCorrect = selectedAnswer === currentRiddle.answer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        className={`w-full max-w-lg rounded-2xl border ${config.border} bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl`}
      >
        <div className={`flex items-center justify-between border-b ${config.border} px-6 py-4 bg-[var(--bg-card-header)]/80`}>
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full shadow-inner ${config.dot}`} />
            <span className="font-outfit text-base font-bold text-[var(--text)]">{team?.name}</span>
          </div>
          <span className={`font-outfit text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] bg-[var(--bg-input)] px-3 py-1 rounded-full shadow-sm border ${config.border}`}>
            {config.label}
          </span>
        </div>

        <div className="p-5">
          <h3 className="mb-6 font-outfit text-lg font-bold leading-relaxed text-[var(--text)]">
            {currentRiddle.question}
          </h3>

          <div className="space-y-3">
            {currentRiddle.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isRight = option === currentRiddle.answer;
              const reveal = showResult && (isSelected || isRight);

              let border = 'border-[var(--border)] hover:border-[var(--border-hover)] hover:shadow-md';
              let bg = 'bg-[var(--bg-input)] hover:bg-[var(--bg-card-header)]';

              if (reveal) {
                if (isRight) {
                  border = 'border-emerald-500/70 shadow-emerald-500/20';
                  bg = 'bg-emerald-50 dark:bg-emerald-900/30';
                } else if (isSelected && !isRight) {
                  border = 'border-rose-500/70 shadow-rose-500/20';
                  bg = 'bg-rose-50 dark:bg-rose-900/30';
                }
              } else if (isSelected) {
                border = 'border-amber-500/70 shadow-amber-500/20 ring-2 ring-amber-500/20';
                bg = 'bg-amber-50 dark:bg-amber-900/20';
              }

              return (
                <button
                  key={option}
                  onClick={() => {
                    if (!showResult) setSelectedAnswer(option);
                  }}
                  disabled={showResult}
                  className={`w-full rounded-xl border px-5 py-3.5 text-left text-sm font-medium text-[var(--text)] shadow-sm transition-all duration-200 ${border} ${bg}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border shadow-inner text-[10px] font-bold ${
                      isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-[var(--border)] bg-[var(--bg)] text-transparent'
                    }`}>
                      ✓
                    </span>
                    <span className="font-outfit">{option}</span>
                    {reveal && isRight && <span className="ml-auto font-outfit text-sm font-bold text-emerald-500">Correct</span>}
                    {reveal && isSelected && !isRight && (
                      <span className="ml-auto font-outfit text-sm font-bold text-rose-500">Incorrect</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`mt-6 w-full rounded-xl px-4 py-3.5 font-outfit text-sm font-bold shadow-lg transition-all ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-[var(--amber-bg)] to-[var(--amber)] text-white shadow-[var(--amber)]/30 hover:scale-[1.02] hover:shadow-[var(--amber)]/50 active:scale-95'
                  : 'border border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)] shadow-none'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`mt-6 rounded-xl border p-5 text-center shadow-lg ${isCorrect ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/20 shadow-emerald-500/10' : 'border-rose-500/50 bg-rose-50 dark:bg-rose-900/20 shadow-rose-500/10'}`}
            >
              <p className={`font-outfit text-xl font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="mt-2 font-outfit text-sm font-medium text-[var(--text-dim)]">
                {isCorrect ? '+10 Points & +2 Spaces' : '-5 Points & -1 Space'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
