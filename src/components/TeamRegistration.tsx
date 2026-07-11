'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Team, Participant } from '@/types';

export default function TeamRegistration() {
  const { state, addTeam, removeTeam, editTeam } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [participant1, setParticipant1] = useState('');
  const [participant2, setParticipant2] = useState('');

  const isDisabled = state.status !== 'not-started';

  const resetForm = () => {
    setTeamName('');
    setParticipant1('');
    setParticipant2('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !participant1.trim() || !participant2.trim()) return;

    const participants: [Participant, Participant] = [
      { name: participant1.trim() },
      { name: participant2.trim() },
    ];

    if (editingId) {
      editTeam(editingId, teamName.trim(), participants);
    } else {
      addTeam(teamName.trim(), participants);
    }
    resetForm();
  };

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setTeamName(team.name);
    setParticipant1(team.participants[0].name);
    setParticipant2(team.participants[1].name);
    setShowForm(true);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5 bg-[var(--bg-card-header)]/50">
        <h2 className="font-outfit text-sm font-semibold tracking-wide text-[var(--amber)]">
          Teams
        </h2>
        <span className="font-outfit text-xs font-medium text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded-full border border-[var(--border)]">{state.teams.length}/6</span>
      </div>

      <div className="p-4">
        {!isDisabled && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card-header)] px-4 py-2.5 font-outfit text-sm font-medium text-[var(--text-dim)] shadow-sm transition-all hover:bg-[var(--border)] hover:text-[var(--text)] active:scale-95"
            >
              {showForm ? 'Cancel' : '+ Add Team'}
            </button>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-4 space-y-2.5 overflow-hidden"
            >
              <div>
                <label className="mb-1.5 block font-outfit text-xs font-medium text-[var(--text-dim)]">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Team Alpha"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 font-outfit text-sm text-[var(--text)] placeholder-[var(--text-muted)] shadow-inner outline-none transition-all focus:border-[var(--amber)] focus:ring-2 focus:ring-[var(--amber)]/20"
                  maxLength={30}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block font-outfit text-xs font-medium text-[var(--text-dim)]">
                    Participant 1
                  </label>
                  <input
                    type="text"
                    value={participant1}
                    onChange={(e) => setParticipant1(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 font-outfit text-sm text-[var(--text)] placeholder-[var(--text-muted)] shadow-inner outline-none transition-all focus:border-[var(--amber)] focus:ring-2 focus:ring-[var(--amber)]/20"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-outfit text-xs font-medium text-[var(--text-dim)]">
                    Participant 2
                  </label>
                  <input
                    type="text"
                    value={participant2}
                    onChange={(e) => setParticipant2(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 font-outfit text-sm text-[var(--text)] placeholder-[var(--text-muted)] shadow-inner outline-none transition-all focus:border-[var(--amber)] focus:ring-2 focus:ring-[var(--amber)]/20"
                    maxLength={30}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-[var(--amber-bg)] to-[var(--amber)] px-4 py-3 font-outfit text-sm font-bold text-white shadow-lg shadow-[var(--amber)]/30 transition-all hover:scale-[1.02] hover:shadow-[var(--amber)]/50 active:scale-95"
              >
                {editingId ? 'Update Team' : 'Register Team'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {state.teams.length === 0 && (
            <p className="py-6 text-center font-mono text-xs text-[var(--text-muted)]">
              NO TEAMS REGISTERED
            </p>
          )}
          <AnimatePresence>
            {state.teams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-all hover:border-[var(--border-hover)] hover:shadow-md"
              >
                <div className="flex items-center gap-3 p-3.5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 font-outfit text-sm font-bold text-white shadow-inner"
                    style={{ backgroundColor: team.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-outfit text-sm font-bold text-[var(--text)]">
                      {team.name}
                    </p>
                    <p className="truncate font-outfit text-xs text-[var(--text-dim)]">
                      {team.participants[0].name} &amp; {team.participants[1].name}
                    </p>
                  </div>
                  {!isDisabled && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(team)}
                        className="rounded-lg bg-[var(--bg-input)] px-2.5 py-1.5 font-outfit text-xs font-medium text-[var(--text-dim)] shadow-sm transition-all hover:bg-[var(--border)] hover:text-[var(--text)] active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeTeam(team.id)}
                        className="rounded-lg bg-red-100/50 dark:bg-red-900/30 px-2.5 py-1.5 font-outfit text-xs font-medium text-red-600 dark:text-red-400 shadow-sm transition-all hover:bg-red-200/50 dark:hover:bg-red-900/50 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
