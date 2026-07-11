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
    setTeamName(''); setParticipant1(''); setParticipant2('');
    setEditingId(null); setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !participant1.trim() || !participant2.trim()) return;
    const participants: [Participant, Participant] = [
      { name: participant1.trim() }, { name: participant2.trim() },
    ];
    if (editingId) editTeam(editingId, teamName.trim(), participants);
    else addTeam(teamName.trim(), participants);
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
    <div className="card-panel corner-ornament">
      <div className="card-panel-header">
        <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
          Registry
        </h2>
        <span className="font-outfit text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg)]/50 px-2 py-0.5 rounded border border-[var(--border)]">
          {state.teams.length}/6
        </span>
      </div>

      <div className="p-4">
        {!isDisabled && (
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="btn-ghost mb-4 w-full rounded-xl px-4 py-2.5 font-outfit text-xs font-bold uppercase tracking-wider"
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
                <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                  Company / Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. The Riddle Breakers"
                  className="input-field"
                  maxLength={30}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                    Agent 1
                  </label>
                  <input
                    type="text"
                    value={participant1}
                    onChange={(e) => setParticipant1(e.target.value)}
                    placeholder="Name"
                    className="input-field"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                    Agent 2
                  </label>
                  <input
                    type="text"
                    value={participant2}
                    onChange={(e) => setParticipant2(e.target.value)}
                    placeholder="Name"
                    className="input-field"
                    maxLength={30}
                  />
                </div>
              </div>
              <button type="submit" className="btn-gold mt-2 w-full rounded-xl px-4 py-3 font-outfit text-xs font-bold uppercase tracking-wider">
                {editingId ? 'Update Registry' : 'Register Team'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {state.teams.length === 0 && (
            <p className="py-6 text-center font-mono text-[10px] text-[var(--text-muted)]">
              No teams registered yet
            </p>
          )}
          <AnimatePresence>
            {state.teams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="card-journal"
              >
                <div className="flex items-center gap-3 p-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-outfit text-sm font-bold text-white shadow-inner"
                    style={{ backgroundColor: team.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-outfit text-sm font-bold text-[var(--text)]">{team.name}</p>
                    <p className="truncate font-outfit text-[11px] text-[var(--text-dim)]">
                      {team.participants[0].name} &amp; {team.participants[1].name}
                    </p>
                  </div>
                  {!isDisabled && (
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(team)}
                        className="btn-ghost rounded-lg px-2.5 py-1.5 font-outfit text-[10px] font-bold uppercase tracking-wider"
                      >
                        Edit
                      </button>
                      <button onClick={() => removeTeam(team.id)}
                        className="btn-danger rounded-lg px-2.5 py-1.5 font-outfit text-[10px] font-bold uppercase tracking-wider"
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
