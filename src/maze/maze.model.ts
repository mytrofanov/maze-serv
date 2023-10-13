import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Row } from '../row/row.model';
import { Game } from '../game';

@Table({ tableName: 'Maze', timestamps: true })
export class Maze extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Game)
    @Column({ type: DataType.INTEGER })
    gameId: number;

    @BelongsTo(() => Game)
    game: Game;

    @HasMany(() => Row)
    rows: Row[];
}
