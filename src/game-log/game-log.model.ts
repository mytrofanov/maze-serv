import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Game } from '../game/game.model';
import { Direction } from '../cell/cell.model';
import { PlayerType, User } from '../users/users.model';

@Table({ tableName: 'GameLog', timestamps: true })
export class GameLog extends Model {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.INTEGER })
    playerType: PlayerType;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    playerId: number;

    @BelongsTo(() => User)
    user: User;

    @Column({ type: DataType.STRING, allowNull: true })
    direction: Direction | null;

    @Column({ type: DataType.STRING })
    message: string;

    @Column({ type: DataType.JSONB, allowNull: true })
    mazeState: any;

    @Column({ type: DataType.INTEGER })
    rowY: number;

    @Column({ type: DataType.INTEGER })
    colX: number;

    @ForeignKey(() => Game)
    @Column
    gameId: number;

    @BelongsTo(() => Game)
    game: Game;
}
