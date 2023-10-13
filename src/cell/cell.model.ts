import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { PlayerType } from '../users';
import { Row } from '../row';

export enum Cell {
    WALL = 'WALL',
    PATH = 'PATH',
    EXIT = 'EXIT',
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

@Table({ tableName: 'MazeCell', timestamps: true })
export class MazeCell extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.INTEGER })
    colX: number;

    @Column({ type: DataType.STRING, values: Object.values(Cell) })
    type: string;

    @Column({ type: DataType.BOOLEAN })
    revealed: boolean;

    @Column({ type: DataType.ENUM, values: Object.values(Direction), allowNull: true })
    direction?: Direction;

    @Column({ type: DataType.ENUM, values: Object.values(PlayerType), allowNull: true })
    player?: PlayerType;

    @ForeignKey(() => Row)
    @Column({ type: DataType.INTEGER })
    rowId: number;

    @BelongsTo(() => Row)
    row: Row;
}
