import { ModuleRef } from '@nestjs/core';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: {
	origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	credentials: true,
} })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private moduleRef: ModuleRef, private prismaService: PrismaService){}
	@WebSocketServer()
	server: Server;

	private connectedClients = new Map<string, Socket>();

	handleConnection(client: Socket) {

		//elie shit to delete
		//console.log('socket emise:', client.handshake.query.username);
		//console.log('map =', this.connectedClients);
		//for (let clientId of this.connectedClients.keys()) {
		//   console.log('----', clientId);
		//}

		//this.connectedClients.forEach((value, key) => {
		//	console.log('value = ', value);
		//});


		const username = client.handshake.query.username as string;
		this.connectedClients.set(username, client);
	}

	handleDisconnect(client: Socket) {
		for (const [userLogin, socket] of this.connectedClients) {
			if (socket === client) {
				this.connectedClients.delete(userLogin);
				break;
			}
		}
	}

	sendEvent(username: string, eventName: string, data: any) {
		const socket = this.connectedClients.get(username);
		if (socket)
			socket.emit(eventName, data);
	}

	//a changer: dans les messages il ne faut pas stocker senderLogin mais senderUsername, car il ne change pas.(pour les blocked)

	@SubscribeMessage('message')
	async handleMessage(client: Socket, payload: any) {
		const channelService = this.moduleRef.get(ChannelService, {strict: false});
		const userService = this.moduleRef.get(UserService, {strict: false});
		const channelId = await channelService.getIdByName(payload.channelName);
		const userId = await userService.getIdByLogin(payload.senderLogin);
		try {
			const chanco = await this.prismaService.channelConnection.findFirstOrThrow({
				where :{
					userId,
					channelId,
				}
			})
			if (chanco.muted < (Math.floor(new Date().getTime() / 1000)))
				{
					console.log ("user " + payload.senderLogin + " is no muted until " + chanco.muted + '/' + Math.floor(new Date().getTime() / 1000));
					const messageservice = this.moduleRef.get(MessageService, { strict: false });
					const message = await messageservice.createMessage(payload.content, payload.senderLogin, payload.channelName);
					console.log('jenvoie le message');
					payload.userList.map((user: any) => {
						this.connectedClients.get(user.username).emit('message', message);
					})
				}
				else {
					console.log("userid " + chanco.userId + " is muted on chan " + chanco.channelId);
				}
		}
		catch (error) {
			console.log("erroooooor");
			throw (error);
		}
	}

	///////////////////////////// GAME ///////////////////////////////
	//pour l instant je met le code ici puis par la sutie je verrai comment bien repartir le code pour faire ca propre

	//private connectedClients = new Map<string, Socket>();

	private matchmakingQueue: string[] = [];

	private activeGames: [string, string, Game][] = [];

	@SubscribeMessage('find_game')
	async handleLaunchGame(client: Socket, payload: any) {

		console.log('--------find game--------');
		let username = client.handshake.query.username;

		if (typeof username != 'string')
			return; //gerer erreur

		//check si l username existe dans la database ?

		//check si l username est deja dans la matchmakingQueue
		for (const player of this.matchmakingQueue) {
			if (player == username)
				return;
		}
		//check si l username est deja dans un activeGames 
		for (const game of this.activeGames) {
			if (game[0] === username || game[1] === username)
				return;
		}

		this.matchmakingQueue.push(username);

		//console.log(username, ' added : ', this.matchmakingQueue);

		if (this.matchmakingQueue.length == 2)
			{
				console.log('GAME IS READY');

				const playerLeft = this.matchmakingQueue.shift();
				const playerRight = this.matchmakingQueue.shift();
				// check is player != undefined ?

				//utile?
				const gameState = this.initializeGameState(playerLeft, playerRight);
				this.activeGames.push([playerLeft, playerRight, gameState]);

				//console.log('actives games :');
				//console.log(this.activeGames);

				this.manageGame(playerLeft, playerRight, gameState);
			}

	}


	manageGame(playerLeft: string, playerRight: string, gameState: Game) {

		//console.log('----- connectedClients : -------');
		//console.log(this.connectedClients);
		const sPlayer1 = this.connectedClients.get(playerLeft);
		const sPlayer2 = this.connectedClients.get(playerRight);
		//this.connectedClients.get(username).emit('game', 'salut  c est moi');

		//ATTENTION C EST ARRIVE PLUSIEURS FOIS!!!!!!!!
		if (sPlayer1 === undefined || sPlayer2 === undefined)
			{
				console.log('socket manageGame erreur le socket recupere est undefined for :');
				if (sPlayer1 === undefined)
					console.log('PLAYER1');
				if (sPlayer2 === undefined)
					console.log('PLAYER2');
				return;
			}

			//sPlayer1.emit('game_start', { gameState ,opponent: playerRight });
			sPlayer1.emit('game_start', gameState, 'player_left');
			sPlayer2.emit('game_start', gameState, 'player_right');

			//this.server.to(this.connectedClients(playerRight)).emit('game_start', { opponent: playerRight, gameState });
			//this.server.to(playerRight).emit('game_start', { opponent: playerLeft, gameState });


			//this.testPaddleMove();

	}


	@SubscribeMessage('paddle_move')
	async testPaddleMove(client: Socket, payload: any) {

		console.log('----- LISTEN paddle up ---------');

		//securite obligee pour utiliser username comme argument plus tard en temps que String
		//let username : String;
		//if (typeof client.handshake.query.username === String)
		if (Array.isArray(client.handshake.query.username)) {
			console.log('Erreur paddle up');
			return;
		}
		let username : string = client.handshake.query.username ;
		//else {
		//	console.log('Error paddle up username type');
		//	return;
		//}

		let gameState : Game = null;

		let playerSide : string = this.getPlayerSide(username);


		for (const [playerLeft, playerRight, game] of this.activeGames) {
			{
				console.log(`Player Left: ${playerLeft}, Player Right: ${playerRight}, Game: ${game}`);
				if (username === playerLeft || username === playerRight)
					{
						//if (username === playerLeft)
						//	playerSide = 'LEFT';
						//if (username === playerRight)
						//	playerSide = 'RIGHT';
						gameState = game;
						break; //check
					}
			}
		}

		if (!gameState) {
			console.log('suscribe paddle_move : player not in an active game');
			return;
		}

		let paddleStep = 20;

		if (payload === 'UP') {
			if (playerSide === 'LEFT')
				{
					gameState.playerLeft.paddlePosition -= 20; console.log('LEFT');
				}
				else if (playerSide === 'RIGHT')
					{
						gameState.playerRight.paddlePosition -= 20;
						console.log('RIGHTTTTTTTTTTT');
					}
					else
						throw new Error('paddle_mode');
		}

		if (payload === 'DOWN') {
			if (playerSide === 'LEFT')
				gameState.playerLeft.paddlePosition += 20;
			else if (playerSide === 'RIGHT')
				gameState.playerRight.paddlePosition += 20;
			else
				throw new Error('paddle_mode');
		}

		console.log(username, ' === ', this.getOpponent(username));
		//console.log(this.connectedClients.get(this.getOpponent(username)));

		this.connectedClients.get(username).emit('game_refresh', gameState);
		this.connectedClients.get(this.getOpponent(username)).emit('game_refresh', gameState);
	}

	getOpponent(player: string) : string
	{

		for (const [playerLeft, playerRight, game] of this.activeGames) {
			if (player === playerLeft)
				return playerRight;
			if (player === playerRight)
				return playerLeft;
		}
		console.log('Error getOpponent no opponent');
		return null;
	}

	getPlayerSide(player: string) : string
	{

		for (const [playerLeft, playerRight, game] of this.activeGames) {
			if (player === playerLeft)
				return 'LEFT';
			if (player === playerRight)
				return 'RIGHT';
		}
		console.log('Error getPlayerSide');
		return null;
	}

	initializeGameState(playerL: string, playerR: string) : Game {
		// Initialiser l'état de jeu, par exemple avec des positions de départ
		return ({
			playerLeft: { name: playerL, score: 0, paddlePosition: 300 },
			playerRight: { name: playerR, score: 0, paddlePosition: 300 },
			ball: { x: 500, y: 500 },
			// autres éléments d'état nécessaires
		});
	}

	//@SubscribeMessage('game')
	//async handleGame(client: Socket, payload: any) {
	//
	//	//console.log('payload = ', payload);
	//
	//	console.log('--------game--------');
	//	let username = client.handshake.query.username;
	//
	//	if (typeof username != 'string')
	//		return; //gerer erreur
	//
	//	this.connectedClients.get(username).emit('game', 'salut  c est moi');
	//
	//	//this.connectedClients.forEach((value, key) => {
	//	//	value.emit('game', 'salut les bg');
	//	//	//console.log('value = ', value);
	//	//});
	//	//this.connectedClients.get('eamar').emit('game', 'salut les bg');
	//}
}

type Game = {
	playerLeft: { name: string, score: number, paddlePosition: number },
	playerRight: { name: string, score: number, paddlePosition: number },
	ball: {x: number, y: number}
};
//getOpponentUsername(playerLeft: string)
//{
// for (const player_iter of this.activeGames) {
//  if (player_iter[0] === playerLeft)
//	  return player_iter[1];
// }
// return null; // ou autre?
//}
