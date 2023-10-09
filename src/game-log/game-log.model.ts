import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Player, PlayerType } from '../players/player.model';
import { Game } from '../game/game.model';
import { Direction, Position } from '../cell/cell.model';

@Table({ tableName: 'GameLog', timestamps: true })
export class GameLog extends Model {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.INTEGER })
    playerType: PlayerType;

    @ForeignKey(() => Player)
    @Column({ type: DataType.INTEGER, allowNull: false })
    playerId: number;

    @BelongsTo(() => Player)
    player: Player;

    @Column({ type: DataType.STRING, allowNull: true })
    direction: Direction | null;

    @Column({ type: DataType.STRING })
    message: string;

    @Column({ type: DataType.JSON, allowNull: true })
    position: Position | null;

    @ForeignKey(() => Game)
    @Column
    gameId: number;

    @BelongsTo(() => Game)
    game: Game;

    @Column({ type: DataType.DATE })
    created: Date;
}
