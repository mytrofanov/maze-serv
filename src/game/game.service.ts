import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game, GameStatus } from './game.model';
import { MazeCellService } from '../cell/cell.service';
import { UsersService } from '../users/users.service';
import { ConnectToGamePayload, CreateGamePayload } from './socket-types';
import { GameLog } from '../game-log/game-log.model';
import { PlayerType } from '../users/users.model';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game)
        private readonly gameModel: typeof Game,
        @Inject(forwardRef(() => MazeCellService))
        private readonly mazeCellService: MazeCellService,
        private readonly usersService: UsersService,
    ) {}

    async createGame(payload: CreateGamePayload): Promise<Game> {
        const { player1Id } = payload;

        const newGame = await this.gameModel.create({
            player1Id,
            status: GameStatus.WAITING_FOR_PLAYER,
        });

        await this.mazeCellService.createRandomMaze(newGame.id);

        return newGame;
    }

    async getAvailableGames(): Promise<Game[]> {
        return this.gameModel.findAll({
            where: {
                status: GameStatus.WAITING_FOR_PLAYER,
            },
        });
    }

    async findGame(gameId: number): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId, {
            include: [GameLog],
        });

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        return game;
    }

    async togglePlayer(gameId: number): Promise<Game> {
        const game = await this.findGame(gameId);

        game.currentPlayer = game.currentPlayer === PlayerType.PLAYER1 ? PlayerType.PLAYER2 : PlayerType.PLAYER1;
        await game.save();
        return game;
    }

    async setWinner(gameId: number, winner: PlayerType): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId);
        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        game.winner = winner;
        await game.save();

        return game;
    }

    async connectToGame(payload: ConnectToGamePayload): Promise<Game> {
        const { gameId, userId } = payload;
        const game = await this.gameModel.findByPk(gameId);
        const user = await this.usersService.getUserById(userId.toString());

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (game.status !== GameStatus.WAITING_FOR_PLAYER) {
            throw new ConflictException('The game is either already in progress or completed');
        }

        game.player2Id = user.id;
        game.status = GameStatus.IN_PROGRESS;

        return game.save();
    }
}
