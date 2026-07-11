'use client';

import { useState, useEffect } from 'react';
import { GameProvider } from '@/lib/game-context';
import TeamRegistration from '@/components/TeamRegistration';
import GameBoard from '@/components/GameBoard';
import VirtualDice from '@/components/VirtualDice';
import RiddlePanel from '@/components/RiddlePanel';
import Leaderboard from '@/components/Leaderboard';
import GameControls from '@/components/GameControls';
import ActivityLog from '@/components/ActivityLog';
import ForcedRiddleAlert from '@/components/ForcedRiddleAlert';
import WinnerModal from '@/components/WinnerModal';

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card-header)] text-sm transition-all hover:border-[var(--border-hover)] active:scale-95"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--gold)]">
          <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-dim)]">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function DashboardContent() {
  return (
    <>
      <ForcedRiddleAlert />
      <RiddlePanel />
      <WinnerModal />

      <div className="relative min-h-screen">
        <div className="bg-texture" />
        <div className="bg-atmosphere" />

        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--gold-bg)] to-[var(--gold)] text-base font-bold tracking-tight text-white shadow-lg shadow-[var(--gold)]/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="font-outfit text-xl font-bold tracking-tight text-[var(--text)]">
                  Riddle Rush
                </h1>
                <p className="font-outfit text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)]">
                  Judge Dashboard
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="space-y-5 lg:col-span-12 xl:col-span-3">
              <TeamRegistration />
              <GameControls />
            </div>

            <div className="lg:col-span-12 xl:col-span-6">
              <GameBoard />
            </div>

            <div className="space-y-5 lg:col-span-12 xl:col-span-3">
              <div className="grid grid-cols-2 gap-5 xl:grid-cols-1">
                <VirtualDice />
                <Leaderboard />
              </div>
              <ActivityLog />
            </div>
          </div>
        </main>

        <footer className="relative z-10 mt-12 border-t border-[var(--border)] py-6 text-center">
          <div className="divider-rune px-4 max-w-xs mx-auto mb-4">
            <span>✧ end of record ✧</span>
          </div>
          <p className="font-outfit text-xs font-medium text-[var(--text-muted)]">
            Riddle Rush &middot; Judge Dashboard &middot; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <DashboardContent />
    </GameProvider>
  );
}
