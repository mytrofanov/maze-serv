// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Game, GameStatus } from '../game/game.model';
// import { Player, PlayerType } from './player.model';
//
// @Injectable()
// export class PlayerService {
//     constructor(
//         @InjectModel(Game)
//         private readonly gameModel: typeof Game,
//         @InjectModel(Player)
//         private readonly playerModel: typeof Player,
//     ) {}
//
//     async createPlayer(userId: number, type: PlayerType): Promise<Player> {
//         const player = await this.playerModel.create({
//             userId: userId,
//             type: type,
//         });
//
//         return player;
//     }
//
//     async addPlayerToGame(userId: number, gameId: number): Promise<Game> {
//         const game = await this.gameModel.findByPk(gameId);
//
//         if (!game) {
//             throw new NotFoundException(`Game with ID ${gameId} not found`);
//         }
//
//         if (game.status === GameStatus.WAITING_FOR_PLAYER) {
//             const player2 = await this.playerModel.create({
//                 userId: userId,
//                 type: PlayerType.PLAYER2,
//                 gameId: game.id,
//             });
//
//             game.player2Id = player2.id;
//             game.status = GameStatus.IN_PROGRESS;
//             await game.save();
//
//             return game;
//         } else {
//             throw new BadRequestException('The selected game is not available to join or is already in progress.');
//         }
//     }
// }
