import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttribute {
    userName: string;
}

export enum PlayerType {
    PLAYER1 = '1',
    PLAYER2 = '2',
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttribute> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    userName: string;

    @Column({
        type: DataType.ENUM,
        values: Object.values(PlayerType),
        allowNull: false,
        defaultValue: PlayerType.PLAYER1,
    })
    type: PlayerType;
}
