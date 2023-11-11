import './game.css'
import { useSocket } from '../../components/Socket';
//import { useEffect, useState } from "react"
import React, { useRef, useEffect, useState } from 'react';

export default function Game() {


	const socket =  useSocket();

	if (!socket)
		throw new Error('React game: socket problem');//check

	type Game = {
		playerLeft: { name: string, score: number, paddlePosition: number },
		playerRight: { name: string, score: number, paddlePosition: number },
		ball: {x: number, y: number, dx: number, dy: number}
	};

	const [gameState, setGameState] = useState(null);

	const [playerSide, setPlayerSide] = useState(null); //cote du joueur

	//const ballRef = useRef({});
	const ballRef = useRef({ x: 400 , y: 100 , dx: 0, dy: 0 });

	useEffect( () => {

		if (!socket)
			return;

		const gameStartHandler = (gameGivenState: Game, playerGivenSide: string) => {
			setGameState(gameGivenState);
			setPlayerSide(playerGivenSide);
			console.log('-------GAMESTATETETETEE----------');
			console.log(gameState);

			ballRef.current.x = gameGivenState.ball.x;
			ballRef.current.y = gameGivenState.ball.y;
			ballRef.current.dx = gameGivenState.ball.dx;
			ballRef.current.dy = gameGivenState.ball.dy;
		};

		const gameRefreshHandler = (gameGivenState: Game) => {
			setGameState(gameGivenState);
		};

		socket.emit('find_game', 'lalala');
		socket.on('game_start', gameStartHandler);
		socket.on('game_refresh', gameRefreshHandler);

		// FAUT IL IMPLEMENTER SOCKER OFF ?
		//return () => {
		//		socket.off('game', messageHandler);
		//};

	}, [socket]);


	const [lastMoveTime, setLastMoveTime] = useState(0);
	const moveDelay = 30; // délai en millisecondes

	///////////// CAPTURE KEYBOARD /////////////
		useEffect(() => {


			const handleKeyDown = (event) => {

				let currentTime = Date.now();
				if (currentTime != 0 && currentTime - lastMoveTime < moveDelay)
					return;

				let blindSpotSizeRatio = 19; //ratio sur la taille du petit coin inateignable par le paddle

				if ((event.keyCode === 87 || event.keyCode === 38)) {

					if (playerSide === 'player_left' && gameState.playerLeft.paddlePosition < (hheight / blindSpotSizeRatio))
						return;
					if (playerSide === 'player_right' && gameState.playerRight.paddlePosition < (hheight / blindSpotSizeRatio))
						return;

					setLastMoveTime(currentTime);
					socket.emit('paddle_move', 'UP');
				}

				if ((event.keyCode === 83 || event.keyCode === 40)) { // 'W' key
					if (playerSide === 'player_left' && (gameState.playerLeft.paddlePosition  + paddleHeight) > hheight - (hheight / blindSpotSizeRatio))
						return;
					if (playerSide === 'player_right' && (gameState.playerRight.paddlePosition + paddleHeight) > hheight - (hheight / blindSpotSizeRatio))
						return;

					setLastMoveTime(currentTime);
					socket.emit('paddle_move', 'DOWN');
				}
			};

			if (!gameState || !socket)
			{
				console.log('deplacement du paddle impossible, gameState = null ou !socket');
				return;//security
			}
			window.addEventListener('keydown', handleKeyDown);

			return () => {
				window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
			};
		}, [gameState, lastMoveTime]); //est ce qu on peut vraiment ne rien mettre dans le tableau

	/////////////////////////////////////////////////////////////////

		// FIXEX VALUES :
	let wwidth = 800;
	let hheight = 600;
	let paddleHeight = 80;
	let paddleWidth = 10;
	let ballRadius = 10;
	/////////////////////////


		// DYNAMIC VALUES :
	let ballDx = 0;
	let ballDy = 0;

	let minSpeedBall = 6;
	let maxSpeedBall = 11;

	//const ballRef = useRef(null);
	//const ballRef = useRef({ x: gameState.ball.x , y: gameState.ball.y , dx: ballDx, dy: ballDy });

	//const ballRef = useRef(null);

	// INITIALIZE BALL TRAJECTOIRE

	//useEffect( () => {
		//	//set angle et vitesse de depart
		//	changeBallAngle(toRadians(0));
		//	changeBallSpeed(0);
		//}, []);
	//////////////////////////////////////////////

		const canvasRef = useRef(null);


	let leftPaddle = { x: 35, width: paddleWidth, height: paddleHeight, dy: 0 };
	let rightPaddle = { x: wwidth - 40, width: paddleWidth, height: paddleHeight, dy: 0 };

	let border_top = { x: 0, y: 0, width: wwidth, height: 3};
	let border_bot = { x: 0, y: hheight - 3, width: wwidth, height: 3};
	let border_left = { x: 0, y: 0, width: 3, height: hheight};
	let border_right = { x: wwidth - 3, y: 0, width: 3, height: hheight};

	useEffect(() => {

		if (!gameState)
		{
			console.log('UPDATE: NO GAME STATE');
			return;
		}
		//const canvas = canvasRef.current;
		const context = canvasRef.current.getContext('2d');

		let animation_id;

		const update = () => {

			const ballX = ballRef.current.x;
			const ballY = ballRef.current.y;

			//// CONTACT AVEC PADDLES /////////////////////////////

				//if (ballRef.current.y + ballRadius <= gameState.playerLeft.paddlePosition

					// PADDLE GAUCHE //
					//balle dans la zone du paddle en y :
					if ( (ballY - ballRadius <= gameState.playerLeft.paddlePosition + paddleHeight) //balle au dessus de la partie basse du paddle
						&& (ballY + ballRadius >= gameState.playerLeft.paddlePosition) ) //balle au dessous de la partie haute du paddle
					//balle dans la zone du paddle en x :
					if (ballX - ballRadius <= leftPaddle.x + leftPaddle.width
						&& ballX + ballRadius >= leftPaddle.x)
					{
						ballRef.current.dx *= -1;
						//definir le nouvel angle :

						// le centre vertical du paddle
						let centre_paddle_Y = gameState.playerLeft.paddlePosition + (leftPaddle.height / 2);
						let distance_ball_paddle_Y;
						//variable  pour savoir si la balle tape au dessus ou dessous du centre du paddle :
						let quadrant = 1; //pour au dessus

						if (ballY > centre_paddle_Y)
						{
							distance_ball_paddle_Y = ballY - centre_paddle_Y;
							quadrant = 0; // la balle tape au dessous du centre
						}
						else
							distance_ball_paddle_Y = centre_paddle_Y - ballY;

						// L'angle_impact prendra une valeur de 0 si la balle tape au centre du paddle, jusqu a 1 si la balle tape totalement dans un coin, a partir de cela on va a la fois pouvoir determiner l' angle dans lequel la balle repartira mais aussi son acceleration

						let angle_impact = distance_ball_paddle_Y / (leftPaddle.height / 2);
						angle_impact *= 0.80; //pour ramener le maximum a 1 a la place de 1.2, plus simple 

						//on envoi une valeur entre 0 et 80 degres ( 0 < angle_impact < 1 )
						if (angle_impact > 0.3)
						{
							if (quadrant === 0)
								changeBallAngle(toRadians(angle_impact * 70));
							else
								changeBallAngle(toRadians(360 - (angle_impact * 70)));
						}

						//console.log('angle{', angle_impact, '}'); //enfait angle_impact va jusqu a 1.2

						if (angle_impact > 0.5)
						{
							let ratioAcceleration = (angle_impact - 0.5) * 2; //ratioAcceleration entre 0.5 et 1;
							//ratioAcceleration = (ratioAcceleration - 0.5) * 2; //on passe ratioAcceleration entre 0 et 1;
							//console.log('ratio[', ratioAcceleration, ']');
							changeBallSpeed(getBallSpeed() + 0.1 + (ratioAcceleration * 0.3) ); //fine tuning
							//on augmente systematiquement de 0.1 si l impact est > 0.5, et on augmente encore de 0 a 0.2 en plus en fonction de l angle
						}
						//changeBallAngle(toRadians(80));

						//console.log('New speed : ', getBallSpeed());

					}

					// PADDLE DROIT //
					if ( (ballY - ballRadius <= gameState.playerRight.paddlePosition + paddleHeight)
						&& (ballY + ballRadius >= gameState.playerRight.paddlePosition))
					if ( (ballX + ballRadius >= rightPaddle.x)
						&& (ballX - ballRadius <= rightPaddle.x + rightPaddle.width) )
					{
						ballRef.current.dx *= -1;
						//definir le nouvel angle :

						// le centre vertical du paddle
						let centre_paddle_Y = gameState.playerRight.paddlePosition + (rightPaddle.height / 2);
						let distance_ball_paddle_Y;
						//variable  pour savoir si la balle tape au dessus ou dessous du centre du paddle :
						let quadrant = 1; //pour au dessus

						if (ballY > centre_paddle_Y)
						{
							distance_ball_paddle_Y = ballY - centre_paddle_Y;
							quadrant = 0; // la balle tape au dessous du centre
						}
						else
							distance_ball_paddle_Y = centre_paddle_Y - ballY;

						// L'angle_impact prendra une valeur de 0 si la balle tape au centre du paddle, jusqu a 1 si la balle tape totalement dans un coin, a partir de cela on va a la fois pouvoir determiner l' angle dans lequel la balle repartira mais aussi son acceleration

						let angle_impact = distance_ball_paddle_Y / (rightPaddle.height / 2);
						angle_impact *= 0.80; //pour ramener le maximum a 1 a la place de 1.2, plus simple 

						let inversion = 180;
						//on envoi une valeur entre 0 et 80 degres ( 0 < angle_impact < 1 )
						if (angle_impact > 0.3)
						{
							if (quadrant === 0)
								changeBallAngle(toRadians(90 + angle_impact * 70));
							else
								changeBallAngle(toRadians(180 + (angle_impact * 70))) ;
						}

						//console.log('angle{', angle_impact, '}'); //enfait angle_impact va jusqu a 1.2

						if (angle_impact > 0.5)
						{
							let ratioAcceleration = (angle_impact - 0.5) * 2; //ratioAcceleration entre 0.5 et 1;
							//ratioAcceleration = (ratioAcceleration - 0.5) * 2; //on passe ratioAcceleration entre 0 et 1;
							//console.log('ratio[', ratioAcceleration, ']');
							changeBallSpeed(getBallSpeed() + 0.1 + (ratioAcceleration * 0.3) ); //fine tuning
							//on augmente systematiquement de 0.1 si l impact est > 0.5, et on augmente encore de 0 a 0.2 en plus en fonction de l angle
						}
						//changeBallAngle(toRadians(80));

						//console.log('New speed : ', getBallSpeed());
					}

					//// CONTACT AVEC BORDS //////////////////////////////
					//let for_test = wwidth / 2 + 160;

					//newDx = -newDx;

					// COLLISION BORDS HAUT / BAS
					if (ballY > canvasRef.current.height - 10 || ballY <= 10)
					ballRef.current.dy *= -1;
					//newDy = -newDy;
					///////////////////////////////////////////////////////

					let for_test = 0;
					//// COLLISIONS BORDS DROITE / GAUCHE et reset position balle
					if (ballX > canvasRef.current.width - 10 - for_test || ballX <= 10)
					{
						//ballRef.current.dx *= -1;
						ballRef.current.y = hheight / 2;
						changeBallSpeed(0); //fine tuning
						if (ballX > canvasRef.current.width - 10 - for_test)
						{
							ballRef.current.x = wwidth / 2 - 150;
							changeBallAngle(toRadians(0));
						}
						else
						{
							ballRef.current.x = wwidth / 2 + 150;
							changeBallAngle(toRadians(180));
						}
					}
			else
			{
				ballRef.current.x += ballRef.current.dx;
				ballRef.current.y += ballRef.current.dy;
			}

			// Clear canvasRef.current
			context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

			// Draw Ball
			context.beginPath();
			context.arc(ballRef.current.x, ballRef.current.y, ballRadius, 0, Math.PI * 2);
			context.fill();

			// Draw Paddles
			context.fillStyle = 'blue';

			if (playerSide === 'player_left')
			{
				context.fillRect(leftPaddle.x, gameState.playerLeft.paddlePosition, leftPaddle.width, leftPaddle.height);
				context.fillStyle = 'black';
				context.fillRect(rightPaddle.x, gameState.playerRight.paddlePosition, rightPaddle.width, rightPaddle.height);
			}
			else
			{
				context.fillRect(rightPaddle.x, gameState.playerRight.paddlePosition, rightPaddle.width, rightPaddle.height);
				context.fillStyle = 'black';
				context.fillRect(leftPaddle.x, gameState.playerLeft.paddlePosition, leftPaddle.width, leftPaddle.height);
			}


			//context.fillRect(rightPaddle.x, gameState.playerRight.paddlePosition, 1, 100);
			//context.fillRect(rightPaddle.x, gameState.playerRight.paddlePosition, 100, 1);

			context.fillRect(border_top.x, border_top.y, border_top.width, border_top.height);
			context.fillRect(border_bot.x, border_bot.y, border_bot.width, border_bot.height);
			context.fillRect(border_left.x, border_left.y, border_left.width, border_left.height);
			context.fillRect(border_right.x, border_left.y, border_left.width, border_left.height);

			//aide a la visualisation
			//context.fillRect(ballX - 250, ballY, 500, 1);
			//context.fillRect(leftPaddle.x, gameState.playerLeft.paddlePosition, 20, 1);
			//context.fillRect(leftPaddle.x, gameState.playerLeft.paddlePosition + paddleHeight, 20, 1);

			// Next frame
			animation_id = requestAnimationFrame(update);
		}

		animation_id = requestAnimationFrame(update);

		return () => {
			cancelAnimationFrame(animation_id);
		}

	}, [gameState]);

			const changeBallSpeed = (newSpeed) => {

				// fine tuning
				newSpeed = (newSpeed * (maxSpeedBall - minSpeedBall)) + minSpeedBall;
				if (newSpeed > maxSpeedBall)
					newSpeed = maxSpeedBall;

				const currentDx = ballRef.current.dx;
				const currentDy = ballRef.current.dy;

				const currentAngle = Math.atan2(currentDy, currentDx);

				ballRef.current.dx = newSpeed * Math.cos(currentAngle);
				ballRef.current.dy = newSpeed * Math.sin(currentAngle);
			}

			const getBallSpeed = () => {
				const currentDx = ballRef.current.dx;
				const currentDy = ballRef.current.dy;
				let rawSpeed = Math.sqrt(currentDx * currentDx + currentDy * currentDy);

				let speed_finetuned = (rawSpeed - minSpeedBall) / ( maxSpeedBall - minSpeedBall);

				return speed_finetuned;
			}
			const changeBallAngle = (theta) => {
				const currentDx = ballRef.current.dx;
				const currentDy = ballRef.current.dy;
				const currentSpeed = Math.sqrt(currentDx * currentDx + currentDy * currentDy);

				ballRef.current.dx = currentSpeed * Math.cos(theta);
				ballRef.current.dy = currentSpeed * Math.sin(theta);
			}

			function toRadians(degrees) {
				return degrees * (Math.PI / 180);
			}

			return (

				<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
				<canvas ref={canvasRef} width={wwidth} height={hheight} />
				{playerSide && <p>X</p>}
				</div>
			);
}

//export default Pong;


