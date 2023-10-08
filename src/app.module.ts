import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path';
import { SequelizeModule } from "@nestjs/sequelize";
import { GameGateway } from './game/game.gateway';
import * as process from 'process';
import {UsersModule} from "./users/users.module";
import {GameModule} from "./game/game.module";
import {MazeModule} from "./maze/maze.module";

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `${process.env.NODE_ENV}.env`
  }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve( __dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DP,
      models: [],
      autoLoadModels: true,
    }),
      UsersModule,
      GameModule,
      MazeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
