export type Participant = {
  name: string;
};

export type Team = {
  id: string;
  name: string;
  participants: [Participant, Participant];
  position: number;
  score: number;
  riddlesAttempted: number;
  riddlesCorrect: number;
  turnsWithoutRiddle: number;
  color: string;
};

export type BoardCellType = 'start' | 'regular' | 'riddle-easy' | 'riddle-medium' | 'riddle-hard' | 'end';

export type BoardCell = {
  id: number;
  type: BoardCellType;
  label: string;
  description?: string;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Riddle = {
  id: string;
  question: string;
  answer: string;
  options: string[];
  difficulty: Difficulty;
};

export type GameStatus = 'not-started' | 'playing' | 'paused' | 'ended';

export type DiceResult = {
  value: number;
  isRolling: boolean;
};

export type LogEntry = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'riddle' | 'dice';
  timestamp: Date;
};

export type TurnPhase = 'waiting' | 'rolling' | 'riddle' | 'done';

export type GameState = {
  status: GameStatus;
  teams: Team[];
  currentTeamIndex: number;
  round: number;
  dice: DiceResult;
  log: LogEntry[];
  forcedRiddleTeamId: string | null;
  riddleModal: {
    open: boolean;
    teamId: string | null;
    cellType: BoardCellType | null;
    riddle: Riddle | null;
  };
  turnPhase: TurnPhase;
};
