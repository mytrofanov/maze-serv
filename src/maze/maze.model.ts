import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { MazeCell } from '../cell/cell.model';

@Table({ tableName: 'Maze', timestamps: true })
export class Maze extends Model {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.TEXT })
    mazeData: string;

    get maze(): MazeCell[][] {
        return JSON.parse(this.mazeData);
    }

    set maze(value: MazeCell[][]) {
        this.mazeData = JSON.stringify(value);
    }
}

// const exampleMazes = [newMaze, newMazeA, newMazeB, ...];
//
// const randomMazeData = exampleMazes[Math.floor(Math.random() * exampleMazes.length)];
//
// const newMazeInstance = new Maze();
// newMazeInstance.maze = randomMazeData;
// await newMazeInstance.save();
