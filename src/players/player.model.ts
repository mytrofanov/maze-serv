import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Game } from '../game/game.model';
import { User } from '../users/users.model';

// export enum PlayerType {
//     PLAYER1 = '1',
//     PLAYER2 = '2',
// }

// @Table({ tableName: 'players' })
// export class Player extends Model {
//     @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
//     id: number;
//
//     @Column({ type: DataType.ENUM, values: Object.values(PlayerType), allowNull: false })
//     type: PlayerType;
//
//     @ForeignKey(() => User)
//     @Column({ type: DataType.INTEGER, allowNull: false })
//     userId: number;
//
//     @BelongsTo(() => User)
//     user: User;
//
//     @ForeignKey(() => Game)
//     @Column({ type: DataType.INTEGER, allowNull: true })
//     gameId: number;
//
//     @BelongsTo(() => Game)
//     game: Game;
// }
