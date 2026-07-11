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
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border)] bg-[var(--bg-card)] text-sm transition-all hover:bg-[var(--bg-card-header)] active:translate-x-[1px] active:translate-y-[1px]"
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
        <div className="bg-noise fixed inset-0 z-0" />

        <header className="relative z-10 border-b-2 border-[var(--border)] bg-[var(--bg)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-[var(--amber)] bg-[var(--amber-bg)] text-base font-black tracking-tight text-black shadow-[3px_3px_0px_var(--shadow-strong)]">
                RR
              </div>
              <div>
                <h1 className="font-outfit text-xl font-black tracking-tight text-[var(--amber)]">
                  RIDDLE RUSH
                </h1>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-dim)]">
                  JUDGE DASHBOARD
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

        <footer className="relative z-10 border-t-2 border-[var(--border)] py-6 text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            RIDDLE RUSH &middot; JUDGE DASHBOARD &middot; {new Date().getFullYear()}
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
