import { BoardCell, BoardCellType } from '@/types';

const ROW_SIZE = 7;
const TOTAL_CELLS = ROW_SIZE * ROW_SIZE - 1; // 48 cells, skipping center

function generateBoard(): BoardCell[] {
  const cells: BoardCell[] = [];
  const riddlePositions = new Set<number>();

  const easyPositions = [3, 9, 15, 22, 29, 35, 41];
  const mediumPositions = [6, 12, 19, 26, 33, 39, 44];
  const hardPositions = [17, 24, 31, 38, 46];

  easyPositions.forEach((p) => riddlePositions.add(p));
  mediumPositions.forEach((p) => riddlePositions.add(p));
  hardPositions.forEach((p) => riddlePositions.add(p));

  for (let i = 0; i < TOTAL_CELLS; i++) {
    let type: BoardCellType = 'regular';
    let label = `${i + 1}`;
    let description: string | undefined;

    if (i === 0) {
      type = 'start';
      label = 'START';
    } else if (i === TOTAL_CELLS - 1) {
      type = 'end';
      label = 'END';
    } else if (easyPositions.includes(i)) {
      type = 'riddle-easy';
      label = `E${i}`;
      description = 'Easy Riddle';
    } else if (mediumPositions.includes(i)) {
      type = 'riddle-medium';
      label = `M${i}`;
      description = 'Medium Riddle';
    } else if (hardPositions.includes(i)) {
      type = 'riddle-hard';
      label = `H${i}`;
      description = 'Hard Riddle';
    }

    cells.push({ id: i, type, label, description });
  }

  return cells;
}

export const BOARD_CELLS = generateBoard();

export const TEAM_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#22C55E', // green
  '#F59E0B', // amber
  '#A855F7', // purple
  '#EC4899', // pink
];

export const TOTAL_CELLS_COUNT = TOTAL_CELLS;

// Calculate 2D grid position for a cell index (snake pattern)
export function getCellPosition(cellIndex: number): { row: number; col: number } {
  const totalRows = ROW_SIZE;
  const totalCols = ROW_SIZE;

  if (cellIndex >= TOTAL_CELLS) {
    return { row: totalRows - 1, col: totalCols - 1 };
  }

  // Determine which "row segment" this cell is in
  // We snake: left-to-right on even rows, right-to-left on odd rows
  const row = Math.floor(cellIndex / totalCols);
  const colInRow = cellIndex % totalCols;
  const col = row % 2 === 0 ? colInRow : totalCols - 1 - colInRow;

  return { row, col };
}
