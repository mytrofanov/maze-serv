import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
//import * as process from 'process';
import { GameModule } from './game/game.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            //TO USE sqlite:
            dialect: 'sqlite',
            storage: './database.sqlite',
            //TO USE PG-ADMIN:
            // dialect: 'postgres',
            // host: process.env.POSTGRES_HOST,
            // port: Number(process.env.POSTGRES_PORT),
            // username: process.env.POSTGRES_USER,
            // password: process.env.POSTGRES_PASSWORD,
            // database: process.env.POSTGRES_DP,
            models: [],
            autoLoadModels: true,
        }),
        GameModule,
    ],
})
export class AppModule {}
