import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PlayerType } from '../players/player.model';
import { Game } from '../game/game.model';

export enum Cell {
    WALL = '1',
    PATH = '0',
    EXIT = '-1',
}

export enum Direction {
    UP = '/up',
    DOWN = '/down',
    LEFT = '/left',
    RIGHT = '/right',
}

export type Position = {
    x: number;
    y: number;
};

export type MazeCellType = {
    gameId: number;
    position: Position;
    type: Cell;
    revealed: boolean;
    direction?: Direction;
    player?: PlayerType;
};

@Table({ tableName: 'MazeCell', timestamps: true })
export class MazeCell extends Model {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Game)
    @Column({ type: DataType.INTEGER })
    gameId: number;

    @BelongsTo(() => Game)
    game: Game;

    @Column({ type: DataType.JSON })
    position: Position;

    @Column({ type: DataType.ENUM, values: Object.values(Cell) })
    type: Cell;

    @Column({ type: DataType.BOOLEAN })
    revealed: boolean;

    @Column({ type: DataType.ENUM, values: Object.values(Direction), allowNull: true })
    direction?: Direction;

    @Column({ type: DataType.ENUM, values: Object.values(PlayerType), allowNull: true })
    player?: PlayerType;
}
