import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType } from 'sequelize-typescript';

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
    playerId: PlayerType;

    @Column({ type: DataType.STRING })
    playerAvatar: string;

    @Column({ type: DataType.STRING, allowNull: true })
    direction: Direction | null;

    @Column({ type: DataType.STRING })
    message: string;

    @Column({ type: DataType.JSON, allowNull: true })
    position: Position | null;

    @Column({ type: DataType.DATE })
    created: Date;
}
