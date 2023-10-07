import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Game } from '../game/game.model';
import { User } from '../users/users.model';
import { ApiProperty } from '@nestjs/swagger';

export enum PlayerType {
    PLAYER1 = '1',
    PLAYER2 = '2',
}

@Table({ tableName: 'players' })
export class Player extends Model {
    @ApiProperty({ example: '1', description: 'unique number' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: PlayerType.PLAYER1, description: 'Player type' })
    @Column({ type: DataType.ENUM, values: Object.values(PlayerType), allowNull: false })
    type: PlayerType;

    @ForeignKey(() => User)
    @ApiProperty({ example: '1', description: 'Associated user id' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Game)
    @ApiProperty({ example: '1', description: 'Associated game id' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    gameId: number;

    @BelongsTo(() => Game)
    game: Game;
}
