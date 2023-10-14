import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game, GameStatus } from './game.model';
import { ConnectToGamePayload } from './socket-types';
import { PlayerType, User, UsersService } from '../users';
import { CreateGameDto } from './dtos';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game)
        private readonly gameModel: typeof Game,
        private readonly usersService: UsersService,
    ) {}

    async createGame(payload: CreateGameDto): Promise<Game> {
        const { player1Id } = payload;
        const player1 = await this.usersService.updateUser(player1Id, { type: PlayerType.PLAYER1 });
        return await this.gameModel.create({
            player1Id: player1.id,
            player1: player1,
            status: GameStatus.WAITING_FOR_PLAYER,
            winner: null,
        });
    }

    async updateGame(gameId: number, payload: Partial<Game>): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId);
        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        return game.update(payload);
    }

    async getAvailableGames(): Promise<Game[]> {
        return this.gameModel.findAll({
            where: {
                status: GameStatus.WAITING_FOR_PLAYER,
            },
            include: [
                {
                    model: User,
                    as: 'player1',
                },
            ],
            order: [['id', 'DESC']],
        });
    }

    async findGame(gameId: number): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId, {
            include: [
                {
                    model: User,
                    as: 'player1',
                },
                {
                    model: User,
                    as: 'player2',
                },
            ],
        });

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        return game;
    }

    async togglePlayer(gameId: number): Promise<Game> {
        const game = await this.findGame(gameId);
        if (game.winner) {
            console.log('GAME IS OVER!');
            return game;
        }
        game.currentPlayer = game.currentPlayer === PlayerType.PLAYER1 ? PlayerType.PLAYER2 : PlayerType.PLAYER1;
        await game.save();
        return game;
    }

    async exitGame(gameId: number, playerId: number): Promise<Game> {
        const game = await this.findGame(gameId);

        if (!game.winner) {
            game.player1Id === playerId ? (game.winner = PlayerType.PLAYER2) : (game.winner = PlayerType.PLAYER1);
        }
        game.status = GameStatus.COMPLETED;
        await game.save();
        return game;
    }

    async setWinner(gameId: number, currentPlayer: PlayerType): Promise<Game> {
        const game = await this.findGame(gameId);
        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        await this.updateGame(game.id, {
            winner: currentPlayer,
        });

        return await this.findGame(game.id);
    }

    async setLooser(gameId: number, looserId: number): Promise<Game> {
        const game = await this.findGame(gameId);
        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
        const isPlayer1Loozer = game.player1Id == looserId;
        await this.updateGame(game.id, {
            winner: isPlayer1Loozer ? PlayerType.PLAYER2 : PlayerType.PLAYER1,
        });

        return await this.findGame(game.id);
    }

    async connectToGame(payload: ConnectToGamePayload): Promise<Game> {
        const { gameId, userId } = payload;

        const player2 = await this.usersService.updateUser(userId, { type: PlayerType.PLAYER2 });

        if (!player2) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        await this.gameModel.update(
            { player2Id: player2.id, status: GameStatus.IN_PROGRESS },
            { where: { id: gameId } },
        );

        const updatedGame = await this.gameModel.findByPk(gameId, {
            include: [
                { model: User, as: 'player1' },
                { model: User, as: 'player2' },
            ],
        });

        if (!updatedGame) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        return updatedGame;
    }
}
