import { Cell, Direction } from '../cell/cell.model';
import { PlayerType } from '../users/users.model';

export type MazeArrCell = {
    type: Cell;
    revealed: boolean;
    direction?: Direction;
    player?: PlayerType;
    rowY?: number;
    colX?: number;
    gameId?: number;
};

export function flattenMaze(maze: MazeArrCell[][], gameId: number): MazeArrCell[] {
    const flatMaze: MazeArrCell[] = [];

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            flatMaze.push({
                ...maze[y][x],
                rowY: y,
                colX: x,
                gameId: gameId,
            });
        }
    }

    return flatMaze;
}

export function unflattenMaze(flatMaze: MazeArrCell[]): MazeArrCell[][] {
    const maze: MazeArrCell[][] = [];

    for (const cell of flatMaze) {
        if (!maze[cell.rowY!]) {
            maze[cell.rowY!] = [];
        }
        maze[cell.rowY!][cell.colX!] = cell;
    }

    return maze;
}
