import { Model, Column, DataType, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { GameLog } from '../game-log';
import { PlayerType, User } from '../users';
import { Maze } from '../maze/maze.model';

export enum GameStatus {
    WAITING_FOR_PLAYER = 'WAITING_FOR_PLAYER',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CONNECTION_ERROR = 'CONNECTION_ERROR',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    WELCOME_SCREEN = 'WELCOME_SCREEN',
}

@Table({ tableName: 'game' })
export class Game extends Model {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    player1Id: number;

    @BelongsTo(() => User)
    player1: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    player2Id?: number;

    @BelongsTo(() => User)
    player2: User;

    @Column({
        type: DataType.ENUM,
        values: Object.values(PlayerType),
        allowNull: false,
        defaultValue: PlayerType.PLAYER1,
    })
    currentPlayer: PlayerType;

    @Column({
        type: DataType.ENUM,
        values: Object.values(PlayerType),
        allowNull: true,
    })
    winner: PlayerType;

    @Column(DataType.ENUM(...Object.values(GameStatus)))
    status: GameStatus;

    @ForeignKey(() => Maze)
    @Column(DataType.INTEGER)
    mazeId: number;

    @BelongsTo(() => Maze)
    maze: Maze;

    @HasMany(() => GameLog)
    logs: GameLog[];
}
