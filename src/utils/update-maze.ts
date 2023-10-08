import {Direction, MazeCell, PlayerType} from "../lib/mazes";
import {Position} from "../game-log/game-log.model";

export const updateMazeCell = (
    maze: MazeCell[][],
    currentPosition: Position,
    revealed: boolean,
    prevPosition?: Position,
    direction?: Direction,
    player?: PlayerType,
): MazeCell[][] => {
    if (maze[currentPosition.y][currentPosition.x].player) {
        console.log('Two players on one cell is not allowed');
        return maze;
    }
    const updatedMaze = maze.map(row => [...row]);

    if (updatedMaze[currentPosition.y] && updatedMaze[currentPosition.y][currentPosition.x]) {
        updatedMaze[currentPosition.y][currentPosition.x] = {
            ...updatedMaze[currentPosition.y][currentPosition.x],
            revealed,
            direction,
            player,
        };
    }
    if (prevPosition) {
        updatedMaze[prevPosition.y][prevPosition.x] = {
            ...updatedMaze[prevPosition.y][prevPosition.x],
            player: undefined,
        };
    }

    return updatedMaze;
};
