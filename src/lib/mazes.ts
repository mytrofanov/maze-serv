import { PlayerType } from '../players/player.model';
import { Direction } from '../cell/cell.model';

export enum Cell {
    WALL = 1,
    PATH = 0,
    EXIT = -1,
}

export type MazeCell = {
    type: Cell;
    revealed: boolean;
    direction?: Direction;
    player?: PlayerType;
};

const wall: MazeCell = {
    type: Cell.WALL,
    revealed: false,
    direction: undefined,
    player: undefined,
};

const path: MazeCell = {
    type: Cell.PATH,
    revealed: false,
    direction: undefined,
    player: undefined,
};

const exit: MazeCell = {
    type: Cell.EXIT,
    revealed: false,
    direction: undefined,
    player: undefined,
};

const startFirst: MazeCell = {
    type: Cell.PATH,
    revealed: true,
    direction: undefined,
    player: PlayerType.PLAYER1,
};

const startSecond: MazeCell = {
    type: Cell.PATH,
    revealed: true,
    direction: undefined,
    player: PlayerType.PLAYER2,
};

export const newMaze: MazeCell[][] = [
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

const newMazeA: MazeCell[][] = [
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

const newMazeB: MazeCell[][] = [
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

const newMazeC: MazeCell[][] = [
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

const newMazeD: MazeCell[][] = [
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
