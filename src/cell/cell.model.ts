//import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType, Index } from 'sequelize-typescript';

export enum Cell {
    WALL = 1,
    PATH = 0,
    EXIT = -1,
}

export enum Direction {
    UP = '/up',
    DOWN = '/down',
    LEFT = '/left',
    RIGHT = '/right',
}

export enum PlayerType {
    PLAYER1 = 1,
    PLAYER2 = 2,
}

export type MazeCell = {
    type: Cell;
    revealed: boolean;
    direction?: Direction;
    player?: PlayerType;
};

// @Table({ tableName: 'MazeCell', timestamps: true })
// export class MazeCell extends Model {
//     @PrimaryKey
//     @AutoIncrement
//     @Unique
//     @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
//     id: number;
//
//     @Column({ type: DataType.ENUM, values: Object.values(Cell) })
//     type: Cell;
//
//     @Column({ type: DataType.BOOLEAN })
//     revealed: boolean;
//
//     @Column({ type: DataType.ENUM, values: Object.values(Direction), allowNull: true })
//     direction?: Direction;
//
//     @Column({ type: DataType.ENUM, values: Object.values(PlayerType), allowNull: true })
//     player?: PlayerType;
// }
