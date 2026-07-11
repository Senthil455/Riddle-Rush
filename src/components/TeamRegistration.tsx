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
    <div className="border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[4px_4px_0px_var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-4 py-2.5 bg-[var(--bg-card-header)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--amber)]">
          Teams
        </h2>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">{state.teams.length}/6</span>
      </div>

      <div className="p-4">
        {!isDisabled && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mb-3 w-full border-2 border-[var(--border)] bg-[var(--bg-card-header)] px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] shadow-[2px_2px_0px_var(--shadow)] transition-all hover:border-[var(--border-hover)] hover:text-[var(--text)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {showForm ? '— CANCEL' : '+ ADD TEAM'}
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
                <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                  Team name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Team Alpha"
                  className="w-full border-2 border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-outfit text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--amber)]"
                  maxLength={30}
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                    P1
                  </label>
                  <input
                    type="text"
                    value={participant1}
                    onChange={(e) => setParticipant1(e.target.value)}
                    placeholder="Name"
                    className="w-full border-2 border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-outfit text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--amber)]"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                    P2
                  </label>
                  <input
                    type="text"
                    value={participant2}
                    onChange={(e) => setParticipant2(e.target.value)}
                    placeholder="Name"
                    className="w-full border-2 border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-outfit text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--amber)]"
                    maxLength={30}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full border-2 border-[var(--amber)] bg-[var(--amber-bg)] px-3 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_var(--shadow-strong)] transition-all hover:brightness-110 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                {editingId ? 'Update' : 'Register'}
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
                className="border-2 border-[var(--border)] bg-[var(--bg-card-header)]/50 transition-all hover:border-[var(--border-hover)]"
              >
                <div className="flex items-center gap-3 p-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-white/20 font-mono text-sm font-bold text-white shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                    style={{ backgroundColor: team.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-outfit text-sm font-bold text-[var(--text)]">
                      {team.name}
                    </p>
                    <p className="truncate font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
                      {team.participants[0].name} &amp; {team.participants[1].name}
                    </p>
                  </div>
                  {!isDisabled && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(team)}
                        className="border-2 border-[var(--border)] bg-[var(--bg-card-header)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] transition-all hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeTeam(team.id)}
                        className="border-2 border-red-800/40 bg-red-900/20 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-red-400/60 transition-all hover:bg-red-800/40 hover:text-red-300"
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
