'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Riddle } from '@/types';

const difficultyConfig = {
  easy: { label: 'EASY', border: 'border-amber-500/50', dot: 'bg-amber-400' },
  medium: { label: 'MEDIUM', border: 'border-orange-500/50', dot: 'bg-orange-400' },
  hard: { label: 'HARD', border: 'border-rose-500/50', dot: 'bg-rose-400' },
};

export default function RiddlePanel() {
  const { state, getRandomRiddle, handleRiddleResult } = useGame();
  const { riddleModal } = state;
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (riddleModal.open && riddleModal.cellType) {
      const riddle = getRandomRiddle(riddleModal.cellType);
      setCurrentRiddle(riddle || null);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [riddleModal.open, riddleModal.cellType, getRandomRiddle]);

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
        className={`w-full max-w-lg border-2 ${config.border} bg-[var(--bg-card)] shadow-[8px_8px_0px_var(--shadow-strong)]`}
      >
        <div className={`flex items-center justify-between border-b-2 ${config.border} px-5 py-3 bg-[var(--bg-card-header)]`}>
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 ${config.dot}`} />
            <span className="font-outfit text-sm font-bold text-[var(--text)]">{team?.name}</span>
          </div>
          <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-dim)]`}>
            {config.label}
          </span>
        </div>

        <div className="p-5">
          <h3 className="mb-6 font-outfit text-lg font-bold leading-relaxed text-[var(--text)]">
            {currentRiddle.question}
          </h3>

          <div className="space-y-2.5">
            {currentRiddle.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isRight = option === currentRiddle.answer;
              const reveal = showResult && (isSelected || isRight);

              let border = 'border-[var(--border)] hover:border-[var(--border-hover)]';
              let bg = 'bg-[var(--bg-card-header)]/50 hover:bg-[var(--bg-card-header)]';

              if (reveal) {
                if (isRight) {
                  border = 'border-emerald-500/70';
                  bg = 'bg-emerald-900/30';
                } else if (isSelected && !isRight) {
                  border = 'border-rose-500/70';
                  bg = 'bg-rose-900/30';
                }
              } else if (isSelected) {
                border = 'border-amber-500/70';
                bg = 'bg-amber-500/10';
              }

              return (
                <button
                  key={option}
                  onClick={() => {
                    if (!showResult) setSelectedAnswer(option);
                  }}
                  disabled={showResult}
                  className={`w-full border-2 px-4 py-3 text-left text-sm font-medium text-[var(--text)] transition-all ${border} ${bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 text-[10px] font-bold ${
                      isSelected ? 'border-amber-500 text-amber-400' : 'border-[var(--border)] text-[var(--text-muted)]'
                    }`}>
                      {isSelected ? '●' : '○'}
                    </span>
                    {option}
                    {reveal && isRight && <span className="ml-auto font-mono text-xs text-emerald-400">✓</span>}
                    {reveal && isSelected && !isRight && (
                      <span className="ml-auto font-mono text-xs text-rose-400">✗</span>
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
              className={`mt-5 w-full border-2 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider transition-all ${
                selectedAnswer
                  ? 'border-amber-500 bg-[var(--amber-bg)] text-black shadow-[4px_4px_0px_rgba(245,158,11,0.4)] hover:brightness-110 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                  : 'border-[var(--border)] bg-[var(--bg-card-header)] text-[var(--text-muted)]'
              }`}
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 border-2 border-[var(--border)] bg-[var(--bg-card-header)] p-4 text-center"
            >
              <p className={`font-mono text-lg font-black uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
                {isCorrect ? '+10 PTS & +2 SPACES' : '-5 PTS & -1 SPACE'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
