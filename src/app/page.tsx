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
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-card)]/80 text-sm backdrop-blur-md border border-[var(--border)] transition-all hover:bg-[var(--bg-card-header)] active:scale-95 shadow-sm"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? '☀' : '☾'}
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
        <div className="bg-mesh fixed inset-0 z-0" />

        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg)]/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-bg)] to-[var(--amber)] text-xl font-black tracking-tight text-white shadow-lg shadow-[var(--amber)]/20">
                RR
              </div>
              <div>
                <h1 className="font-outfit text-2xl font-bold tracking-tight text-[var(--text)]">
                  Riddle Rush
                </h1>
                <p className="font-outfit text-xs font-medium text-[var(--text-dim)]">
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

        <footer className="relative z-10 mt-12 border-t border-[var(--border)] py-8 text-center backdrop-blur-sm">
          <p className="font-outfit text-sm font-medium text-[var(--text-muted)]">
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
