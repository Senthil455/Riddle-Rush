'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { GameState, Team, LogEntry, BoardCellType, Participant, TurnPhase } from '@/types';
import { BOARD_CELLS, TOTAL_CELLS_COUNT, TEAM_COLORS } from '@/data/board';
import { RIDDLES } from '@/data/riddles';
import { generateId } from '@/lib/utils';

const initialState: GameState = {
  status: 'not-started',
  teams: [],
  currentTeamIndex: 0,
  round: 0,
  dice: { value: 1, isRolling: false },
  log: [],
  forcedRiddleTeamId: null,
        riddleModal: { open: false, teamId: null, cellType: null, riddle: null },
  turnPhase: 'waiting',
};

type Action =
  | { type: 'ADD_TEAM'; payload: { name: string; participants: [Participant, Participant] } }
  | { type: 'REMOVE_TEAM'; payload: string }
  | { type: 'EDIT_TEAM'; payload: { id: string; name: string; participants: [Participant, Participant] } }
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'END_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'DICE_RESULT'; payload: number }
  | { type: 'MOVE_TEAM'; payload: { teamId: string; newPosition: number } }
  | { type: 'NEXT_TURN' }
  | { type: 'OPEN_RIDDLE'; payload: { teamId: string; cellType: BoardCellType } }
  | { type: 'CLOSE_RIDDLE' }
  | { type: 'RIDDLE_RESULT'; payload: { teamId: string; correct: boolean } }
  | { type: 'SET_FORCED_RIDDLE'; payload: string | null }
  | { type: 'ADD_LOG'; payload: LogEntry }
  | { type: 'SET_TURN_PHASE'; payload: TurnPhase };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'ADD_TEAM': {
      if (state.teams.length >= 6) return state;
      const color = TEAM_COLORS[state.teams.length];
      const newTeam: Team = {
        id: generateId(),
        name: action.payload.name,
        participants: action.payload.participants,
        position: 0,
        score: 0,
        riddlesAttempted: 0,
        riddlesCorrect: 0,
        turnsWithoutRiddle: 0,
        color,
      };
      return { ...state, teams: [...state.teams, newTeam] };
    }
    case 'REMOVE_TEAM':
      return { ...state, teams: state.teams.filter((t) => t.id !== action.payload) };
    case 'EDIT_TEAM': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.id
            ? { ...t, name: action.payload.name, participants: action.payload.participants }
            : t
        ),
      };
    }
    case 'START_GAME':
      return {
        ...initialState,
        status: 'playing',
        teams: state.teams.map((t) => ({
          ...t,
          position: 0,
          score: 0,
          riddlesAttempted: 0,
          riddlesCorrect: 0,
          turnsWithoutRiddle: 0,
        })),
        round: 1,
        turnPhase: 'waiting',
        log: [
          { id: generateId(), message: 'Game started!', type: 'info', timestamp: new Date() },
        ],
      };
    case 'PAUSE_GAME':
      return { ...state, status: 'paused' };
    case 'RESUME_GAME':
      return { ...state, status: 'playing' };
    case 'RESET_GAME':
      return { ...initialState };
    case 'END_GAME':
      return { ...state, status: 'ended' };
    case 'ROLL_DICE':
      return {
        ...state,
        dice: { ...state.dice, isRolling: true },
        turnPhase: 'rolling',
      };
    case 'DICE_RESULT': {
      return {
        ...state,
        dice: { value: action.payload, isRolling: false },
      };
    }
    case 'MOVE_TEAM':
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? { ...t, position: Math.min(action.payload.newPosition, TOTAL_CELLS_COUNT - 1) }
            : t
        ),
      };
    case 'NEXT_TURN': {
      const nextIndex = (state.currentTeamIndex + 1) % state.teams.length;
      const newRound = nextIndex === 0 ? state.round + 1 : state.round;
      const updatedTeams = state.teams.map((t, i) => {
        if (i === state.currentTeamIndex) {
          const cell = BOARD_CELLS[t.position];
          const isRiddleCell =
            cell?.type === 'riddle-easy' ||
            cell?.type === 'riddle-medium' ||
            cell?.type === 'riddle-hard';
          return {
            ...t,
            turnsWithoutRiddle: isRiddleCell ? 0 : t.turnsWithoutRiddle + 1,
          };
        }
        return t;
      });
      return {
        ...state,
        currentTeamIndex: nextIndex,
        round: newRound,
        teams: updatedTeams,
        turnPhase: 'waiting',
        forcedRiddleTeamId: null,
      };
    }
    case 'OPEN_RIDDLE': {
      let difficulty: 'easy' | 'medium' | 'hard';
      if (action.payload.cellType === 'riddle-easy') difficulty = 'easy';
      else if (action.payload.cellType === 'riddle-medium') difficulty = 'medium';
      else difficulty = 'hard';
      const pool = RIDDLES.filter((r) => r.difficulty === difficulty);
      const riddle = pool[Math.floor(Math.random() * pool.length)] || null;
      return {
        ...state,
        riddleModal: { open: true, teamId: action.payload.teamId, cellType: action.payload.cellType, riddle },
        turnPhase: 'riddle',
      };
    }
    case 'CLOSE_RIDDLE':
      return {
        ...state,
  riddleModal: { open: false, teamId: null, cellType: null, riddle: null },
      };
    case 'RIDDLE_RESULT': {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (!team) return state;
      const bonus = action.payload.correct ? 2 : -1;
      const newPosition = Math.max(0, Math.min(team.position + bonus, TOTAL_CELLS_COUNT - 1));
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
                ...t,
                position: newPosition,
                score: action.payload.correct ? t.score + 10 : t.score - 5,
                riddlesAttempted: t.riddlesAttempted + 1,
                riddlesCorrect: action.payload.correct
                  ? t.riddlesCorrect + 1
                  : t.riddlesCorrect,
                turnsWithoutRiddle: 0,
              }
            : t
        ),
        turnPhase: 'done',
      };
    }
    case 'SET_FORCED_RIDDLE':
      return { ...state, forcedRiddleTeamId: action.payload };
    case 'ADD_LOG':
      return { ...state, log: [action.payload, ...state.log].slice(0, 50) };
    case 'SET_TURN_PHASE':
      return { ...state, turnPhase: action.payload };
    default:
      return state;
  }
}

type GameContextType = {
  state: GameState;
  addTeam: (name: string, participants: [Participant, Participant]) => void;
  removeTeam: (id: string) => void;
  editTeam: (id: string, name: string, participants: [Participant, Participant]) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  endGame: () => void;
  rollDice: () => void;
  nextTurn: () => void;
  openRiddle: (teamId: string, cellType: BoardCellType) => void;
  closeRiddle: () => void;
  handleRiddleResult: (teamId: string, correct: boolean) => void;
  addLog: (message: string, type: LogEntry['type']) => void;
  getCurrentTeam: () => Team | undefined;
  getTeamById: (id: string) => Team | undefined;
  checkForcedRiddle: () => string | null;
  setTurnPhase: (phase: TurnPhase) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const addTeam = useCallback((name: string, participants: [Participant, Participant]) => {
    dispatch({ type: 'ADD_TEAM', payload: { name, participants } });
  }, []);

  const removeTeam = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TEAM', payload: id });
  }, []);

  const editTeam = useCallback((id: string, name: string, participants: [Participant, Participant]) => {
    dispatch({ type: 'EDIT_TEAM', payload: { id, name, participants } });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
    dispatch({
      type: 'ADD_LOG',
      payload: { id: generateId(), message: 'Game ended!', type: 'info', timestamp: new Date() },
    });
  }, []);

  const rollDice = useCallback(() => {
    dispatch({ type: 'ROLL_DICE' });
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      dispatch({ type: 'DICE_RESULT', payload: value });
      const team = stateRef.current.teams[stateRef.current.currentTeamIndex];
      if (team) {
        const newPosition = Math.min(team.position + value, TOTAL_CELLS_COUNT - 1);
        dispatch({ type: 'MOVE_TEAM', payload: { teamId: team.id, newPosition } });
        dispatch({
          type: 'ADD_LOG',
          payload: {
            id: generateId(),
            message: `${team.name} rolled a ${value} and moved to position ${newPosition + 1}`,
            type: 'dice',
            timestamp: new Date(),
          },
        });
        const cell = BOARD_CELLS[newPosition];
        if (cell?.type === 'end') {
          setTimeout(() => {
            dispatch({ type: 'END_GAME' });
            dispatch({
              type: 'ADD_LOG',
              payload: {
                id: generateId(),
                message: `🏆 ${team.name} has reached the end and won the game!`,
                type: 'success',
                timestamp: new Date(),
              },
            });
          }, 600);
        } else if (
          cell?.type === 'riddle-easy' ||
          cell?.type === 'riddle-medium' ||
          cell?.type === 'riddle-hard'
        ) {
          setTimeout(() => {
            dispatch({ type: 'OPEN_RIDDLE', payload: { teamId: team.id, cellType: cell.type } });
          }, 600);
        } else {
          setTimeout(() => {
            dispatch({ type: 'SET_TURN_PHASE', payload: 'done' });
          }, 600);
        }
      }
    }, 800);
  }, []);

  const nextTurn = useCallback(() => {
    dispatch({ type: 'NEXT_TURN' });
    const nextTeam = stateRef.current.teams[(stateRef.current.currentTeamIndex + 1) % stateRef.current.teams.length];
    if (nextTeam) {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          id: generateId(),
          message: `--- ${nextTeam.name}'s turn ---`,
          type: 'info',
          timestamp: new Date(),
        },
      });
    }
  }, []);

  const openRiddle = useCallback((teamId: string, cellType: BoardCellType) => {
    dispatch({ type: 'OPEN_RIDDLE', payload: { teamId, cellType } });
  }, []);

  const closeRiddle = useCallback(() => {
    dispatch({ type: 'CLOSE_RIDDLE' });
  }, []);

  const handleRiddleResult = useCallback(
    (teamId: string, correct: boolean) => {
      dispatch({ type: 'RIDDLE_RESULT', payload: { teamId, correct } });
      const team = stateRef.current.teams.find((t) => t.id === teamId);
      if (team) {
        const bonus = correct ? 2 : -1;
        const newPos = Math.max(0, Math.min(team.position + bonus, TOTAL_CELLS_COUNT - 1));
        dispatch({
          type: 'ADD_LOG',
          payload: {
            id: generateId(),
            message: correct
              ? `${team.name} answered correctly! +10 points (moved ${bonus}+ spaces)`
              : `${team.name} answered incorrectly! -5 points (moved ${bonus} space)`,
            type: correct ? 'success' : 'error',
            timestamp: new Date(),
          },
        });
        if (BOARD_CELLS[newPos]?.type === 'end') {
          setTimeout(() => {
            dispatch({ type: 'END_GAME' });
            dispatch({
              type: 'ADD_LOG',
              payload: {
                id: generateId(),
                message: `🏆 ${team.name} has reached the end and won the game!`,
                type: 'success',
                timestamp: new Date(),
              },
            });
          }, 1200);
        }
      }
      dispatch({ type: 'CLOSE_RIDDLE' });
    },
    []
  );

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    dispatch({
      type: 'ADD_LOG',
      payload: { id: generateId(), message, type, timestamp: new Date() },
    });
  }, []);

  const getCurrentTeam = useCallback(() => {
    return stateRef.current.teams[stateRef.current.currentTeamIndex];
  }, []);

  const getTeamById = useCallback((id: string) => {
    return stateRef.current.teams.find((t) => t.id === id);
  }, []);

  const checkForcedRiddle = useCallback(() => {
    const team = stateRef.current.teams.find(
      (t) => t.turnsWithoutRiddle >= 3 && stateRef.current.currentTeamIndex === stateRef.current.teams.indexOf(t)
    );
    if (team) {
      dispatch({ type: 'SET_FORCED_RIDDLE', payload: team.id });
      return team.id;
    }
    return null;
  }, []);

  const setTurnPhase = useCallback((phase: TurnPhase) => {
    dispatch({ type: 'SET_TURN_PHASE', payload: phase });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        addTeam,
        removeTeam,
        editTeam,
        startGame,
        pauseGame,
        resumeGame,
        resetGame,
        endGame,
        rollDice,
        nextTurn,
        openRiddle,
        closeRiddle,
        handleRiddleResult,
        addLog,
        getCurrentTeam,
        getTeamById,
        checkForcedRiddle,
        setTurnPhase,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
