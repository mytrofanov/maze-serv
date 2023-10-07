import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttribute {
    userName: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttribute> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    userName: string;
}
