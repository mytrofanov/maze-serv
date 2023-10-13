import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

import { Maze } from '../maze/maze.model';
import { MazeCell } from '../cell/cell.model';

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

    @Column({ type: DataType.BOOLEAN })
    player1onRow: boolean;

    @Column({ type: DataType.BOOLEAN })
    player2onRow: boolean;

    @HasMany(() => MazeCell)
    cells: MazeCell[];
}
