import { PlayerType } from '../users';
import { MazeMatrixCell } from '../lib/mazes';

export const checkCellsForPlayer = (cells: MazeMatrixCell[], player: PlayerType): boolean => {
    return cells.some(cell => cell.player === player);
};
