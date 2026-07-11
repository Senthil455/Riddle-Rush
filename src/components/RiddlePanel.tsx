'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';

const difficultyConfig = {
  easy: { label: 'Apprentice', border: 'border-[var(--gold)]/40', dot: 'bg-[var(--gold)]' },
  medium: { label: 'Adept', border: 'border-amber-500/40', dot: 'bg-amber-500' },
  hard: { label: 'Master', border: 'border-[var(--crimson)]/40', dot: 'bg-[var(--crimson)]' },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/90 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className={`w-full max-w-lg rounded-xl border-2 ${config.border} bg-[var(--bg-card)] shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[var(--gold)]/5 to-transparent pointer-events-none" />

        <div className={`flex items-center justify-between border-b ${config.border} px-5 py-3.5 bg-[var(--bg-card-header)]`}>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--gold)]">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span className="font-outfit text-sm font-bold text-[var(--text)]">{team?.name}</span>
          </div>
          <span className={`font-outfit text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded border ${config.border} bg-[var(--bg-input)]`}>
            {config.label}
          </span>
        </div>

        <div className="p-5">
          <div className="divider-rune mb-4">
            <span>the riddle</span>
          </div>

          <h3 className="mb-5 font-outfit text-base font-bold leading-relaxed text-[var(--text)]">
            {currentRiddle.question}
          </h3>

          <div className="space-y-2.5">
            {currentRiddle.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isRight = option === currentRiddle.answer;
              const reveal = showResult && (isSelected || isRight);

              let border = 'border-[var(--border)]';
              let bg = 'bg-[var(--bg-input)]';

              if (reveal) {
                if (isRight) {
                  border = 'border-[var(--emerald)]/60';
                  bg = 'bg-[var(--emerald)]/5';
                } else if (isSelected && !isRight) {
                  border = 'border-[var(--crimson)]/60';
                  bg = 'bg-[var(--crimson)]/5';
                }
              } else if (isSelected) {
                border = 'border-[var(--gold)]/60';
                bg = 'bg-[var(--gold)]/5';
              }

              return (
                <button
                  key={option}
                  onClick={() => { if (!showResult) setSelectedAnswer(option); }}
                  disabled={showResult}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium text-[var(--text)] transition-all duration-200 ${border} ${bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold ${
                      isSelected ? 'border-[var(--gold)] bg-[var(--gold)] text-white' : 'border-[var(--border)] bg-[var(--bg)] text-transparent'
                    }`}>
                      ✓
                    </span>
                    <span className="font-outfit text-sm">{option}</span>
                    {reveal && isRight && <span className="ml-auto font-outfit text-xs font-bold text-[var(--emerald)]">✦ Correct</span>}
                    {reveal && isSelected && !isRight && <span className="ml-auto font-outfit text-xs font-bold text-[var(--crimson)]">✗ Incorrect</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`mt-5 w-full rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider transition-all ${
                selectedAnswer
                  ? 'btn-gold'
                  : 'border border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)]'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`mt-5 rounded-lg border-2 p-4 text-center ${
                isCorrect
                  ? 'border-[var(--emerald)]/40 bg-[var(--emerald)]/5'
                  : 'border-[var(--crimson)]/40 bg-[var(--crimson)]/5'
              }`}
            >
              <p className={`font-outfit text-lg font-bold ${isCorrect ? 'text-[var(--emerald)]' : 'text-[var(--crimson)]'}`}>
                {isCorrect ? '✦ Correct!' : '✗ Incorrect'}
              </p>
              <p className="mt-1.5 font-outfit text-xs font-medium text-[var(--text-dim)]">
                {isCorrect ? '+10 points & +2 spaces' : '-5 points & -1 space'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
