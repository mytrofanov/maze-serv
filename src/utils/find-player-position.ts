import { MazeCell, PlayerType } from '../game';

export const findPlayerPosition = (maze: MazeCell[][], player: PlayerType): { x: number; y: number } | null => {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x].player === player) {
                return { x, y };
            }
        }
    }
    return null;
};
