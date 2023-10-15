import { PlayerType } from '../users/users.model';
import { MazeMatrixCell } from '../lib/mazes';

export const checkCellsForPlayer = (cells: MazeMatrixCell[], player: PlayerType): boolean => {
    return cells.some(cell => cell.player === player);
};
