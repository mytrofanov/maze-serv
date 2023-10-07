import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Maze } from '../maze/maze.model';
import { Player } from '../players/player.model';
import { GameLog } from '../game-log/game-log.model';

@Table({ tableName: 'games' })
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
    @Column({ type: DataType.INTEGER, allowNull: false })
    player2Id: number;

    @BelongsTo(() => Player)
    player2: Player;

    @ForeignKey(() => GameLog)
    @Column({ type: DataType.INTEGER })
    gameLogId: number;

    @BelongsTo(() => GameLog)
    gameLog: GameLog;

    @Column(DataType.ENUM('waiting_for_player', 'in_progress', 'completed', 'connection_error'))
    status: string;
}
