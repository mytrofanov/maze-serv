import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

import { Maze } from '../maze';
import { MazeCell } from '../cell';
import { PlayerType } from '../users/users.model';

@Table({ tableName: 'Row', timestamps: true })
export class Row extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.INTEGER })
    rowY: number;

    @ForeignKey(() => Maze)
    @Column({ type: DataType.INTEGER })
    mazeId: number;

    @BelongsTo(() => Maze)
    maze: Maze;

    @Column({ type: DataType.ENUM, values: Object.values(PlayerType), allowNull: true })
    player?: PlayerType;

    @HasMany(() => MazeCell)
    cells: MazeCell[];
}