import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Maze } from '../maze/maze.model';
import { Player, PlayerType } from '../players/player.model';

export enum GameStatus {
    WAITING_FOR_PLAYER = 'WAITING_FOR_PLAYER',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CONNECTION_ERROR = 'connection_error',
}

@Table({ tableName: 'game' })
export class Game extends Model {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Maze)
    @Column
    mazeId: number;

    @BelongsTo(() => Maze)
    maze: Maze;

    @ForeignKey(() => Player)
    @Column({ type: DataType.INTEGER, allowNull: false })
    player1Id: number;

    @BelongsTo(() => Player)
    player1: Player;

    @ForeignKey(() => Player)
    @Column({ type: DataType.INTEGER, allowNull: true })
    player2Id?: number;

    @BelongsTo(() => Player)
    player2: Player;

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
}
