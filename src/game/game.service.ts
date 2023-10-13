import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
        await this.usersService.updateUser(player1Id, { type: PlayerType.PLAYER1 });
        return await this.gameModel.create({
            player1Id,
            status: GameStatus.WAITING_FOR_PLAYER,
            winner: null,
        });
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
                    attributes: ['userName'],
                },
            ],
            order: [['id', 'DESC']],
        });
    }

    async findGame(gameId: number): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId);

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

    async exitGame(gameId: number, playerId: number): Promise<Game> {
        const game = await this.findGame(gameId);

        if (!game.winner) {
            game.player1Id === playerId ? (game.winner = PlayerType.PLAYER2) : (game.winner = PlayerType.PLAYER1);
        }
        game.status = GameStatus.COMPLETED;
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
        const user = await this.usersService.getUserById(userId);

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (game.status !== GameStatus.WAITING_FOR_PLAYER) {
            throw new ConflictException('The game is either already in progress or completed');
        }
        await this.usersService.updateUser(user.id, { type: PlayerType.PLAYER2 });

        game.player2Id = user.id;
        game.status = GameStatus.IN_PROGRESS;

        return game.save();
    }
}
