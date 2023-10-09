import { Direction, Position } from '../cell/cell.model';

export const newPosition = (direction: Direction, startPosition: Position) => {
    let newX = startPosition.x;
    let newY = startPosition.y;

    if (direction === Direction.UP) {
        newY -= 1;
    }
    if (direction === Direction.DOWN) {
        newY += 1;
    }
    if (direction === Direction.LEFT) {
        newX -= 1;
    }
    if (direction === Direction.RIGHT) {
        newX += 1;
    }
    return { x: newX, y: newY };
};
