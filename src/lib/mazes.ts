import { Cell, Direction } from '../cell/cell.model';
import { PlayerType } from '../users/users.model';

export type MazeMatrixCell = {
    type: Cell;
    revealed: boolean;
    direction?: Direction;
    player?: PlayerType;
    rowY?: number;
    colX?: number;
};

const wall: MazeMatrixCell = {
    type: Cell.WALL,
    revealed: false,
    direction: undefined,
    player: undefined,
};

const path: MazeMatrixCell = {
    type: Cell.PATH,
    revealed: false,
    direction: undefined,
    player: undefined,
};

const exit: MazeMatrixCell = {
    type: Cell.EXIT,
    revealed: false,
    direction: undefined,
    player: undefined,
};

const startFirst: MazeMatrixCell = {
    type: Cell.PATH,
    revealed: true,
    direction: undefined,
    player: PlayerType.PLAYER1,
};

const startSecond: MazeMatrixCell = {
    type: Cell.PATH,
    revealed: true,
    direction: undefined,
    player: PlayerType.PLAYER2,
};

export const newMaze: MazeMatrixCell[][] = [
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [wall, startFirst, path, path, wall, startSecond, path, path, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, wall, wall],
    [wall, wall, path, path, wall, wall, path, wall, wall, wall],
    [wall, wall, wall, path, path, path, path, wall, wall, wall],
    [wall, wall, wall, path, wall, wall, path, wall, wall, wall],
    [wall, path, path, path, wall, wall, wall, wall, wall, wall],
    [wall, wall, wall, path, wall, wall, wall, wall, wall, wall],
    [exit, path, path, path, path, path, path, path, path, wall],
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
];

const newMazeA: MazeMatrixCell[][] = [
    [wall, wall, wall, exit, wall, wall, wall, wall, wall, wall],
    [wall, path, path, path, path, path, path, path, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, wall, wall],
    [wall, wall, path, path, wall, path, startSecond, path, path, wall],
    [wall, wall, wall, path, path, path, path, wall, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, path, wall],
    [wall, path, path, path, wall, wall, wall, wall, path, wall],
    [wall, wall, wall, path, wall, wall, wall, wall, path, wall],
    [wall, startFirst, path, path, path, path, path, path, path, wall],
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
];

const newMazeB: MazeMatrixCell[][] = [
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [wall, path, path, startFirst, path, path, path, path, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, wall, wall],
    [wall, wall, path, path, wall, path, path, path, path, wall],
    [wall, wall, wall, path, path, path, path, wall, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, path, exit],
    [wall, path, path, path, wall, path, path, path, path, wall],
    [wall, wall, wall, path, wall, path, wall, wall, wall, wall],
    [wall, startSecond, path, path, path, path, path, path, path, wall],
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
];

const newMazeC: MazeMatrixCell[][] = [
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [wall, path, path, startFirst, path, path, path, path, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, wall, wall],
    [wall, path, path, path, wall, path, path, startSecond, path, wall],
    [wall, wall, wall, path, path, path, path, wall, path, wall],
    [wall, wall, wall, path, wall, wall, wall, wall, path, wall],
    [wall, path, path, path, wall, path, path, path, path, wall],
    [wall, wall, wall, path, wall, path, wall, wall, wall, wall],
    [wall, path, path, path, path, path, path, path, path, wall],
    [wall, wall, wall, wall, wall, wall, exit, wall, wall, wall],
];

const newMazeD: MazeMatrixCell[][] = [
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [wall, path, path, path, path, path, path, path, path, wall],
    [wall, wall, wall, path, wall, wall, path, wall, wall, wall],
    [exit, path, path, path, wall, path, path, startSecond, path, wall],
    [wall, wall, wall, path, path, path, path, wall, path, wall],
    [wall, wall, wall, path, wall, wall, wall, wall, path, wall],
    [wall, path, path, path, wall, path, path, path, path, wall],
    [wall, path, wall, wall, wall, path, wall, wall, wall, wall],
    [wall, path, path, startFirst, path, path, path, path, path, wall],
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
];

export const Mazes = [newMaze, newMazeA, newMazeB, newMazeC, newMazeD];
