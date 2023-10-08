import {Table, Column, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {Player} from "../players/player.model";
import {Game} from "../game/game.model";

export enum PlayerType {
    PLAYER1 = 1,
    PLAYER2 = 2,
}
export enum Direction {
    UP = '/up',
    DOWN = '/down',
    LEFT = '/left',
    RIGHT = '/right',
}

export type Position = { x: number; y: number };

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
