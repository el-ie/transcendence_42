import './game.css'
import { useSocket } from '../../components/Socket';
//import { useEffect, useState } from "react"
import React, { useRef, useEffect, useState } from 'react';

export default function Game() {


    const socket =  useSocket();


	type Game = {
		player1: { score: number, paddlePosition: number },
		player2: { score: number, paddlePosition: number },
		ball: {x: number, y: number}
	};

	const gameState: Game = useRef();

	const leftPaddleY = useRef(300);

	//const rightPaddleY = useState(300);

	useEffect( () => {

		//console.log('socket = ', socket);

        const gameHandler = (gameGivenState: Game) => {
			console.log('MESSAGE RECU :');
			console.log(gameGivenState);
			//gameState = gameGivenState;
			gameState.current = gameGivenState;
			console.log('gameState ====');
			console.log(gameState);
		};



		if (socket)
		{
			//console.log('LE SOCKET EST ON');
			socket.emit('find_game', 'lalala');

			socket.on('game_start', gameHandler);
		}

		//const gameHandler = (message: any) => {
			//	console.log('gameHandler: ', message);
			//};
		//
			//socket.on('message', gameHandler);
		////
			//return () => {
			//	if (socket)
			//		socket.off('game', messageHandler);
			//	};

	}, [socket]);

	useEffect(() => {
		const handleKeyDown = (event) => {

			if (event.keyCode === 87) { // 'W' key
				if (leftPaddle.y > (paddleHeight / 2)) 
				{
					if (socket)
						socket.emit('paddle_up', 'coucou');
					else
						console.log('NO FUCKING SOCKET');
					console.log('CARMANAA');
				}
				//setLeftPaddleY((prevY) => prevY - paddleStep); 
			}

			//if (event.keyCode === 83) { // 'S' key
				//	if (leftPaddle.y + leftPaddle.height < hheight - (paddleHeight / 2)) 
					//		setLeftPaddleY((prevY) => prevY + paddleStep);
				//}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
		};
	}, [leftPaddleY.current]);

	/////////////////////////////////////////////////////////////////

		//const [leftPaddleY, setLeftPaddleY] = useState(300);

	const [rightPaddleY, setRightPaddleY] = useState(300);

	//const [ball, setBall] = useState({ x: 320, y: 240, radius: 10, dx: 1, dy: 0 });

	//let ball = { x: 320, y: 240, radius: 10, dx: -3, dy: 0 };

	//epaisseur totale du canva
	let wwidth = 800;
	//hauteur totale du canva
	let hheight = 600;
	//hauteur paddle
	let paddleHeight = 80;
	//epaisseur paddle
	let paddleWidth = 10;
	//radius de la balle
	let ballRadius = 10;
	//pas mouvement paddle
	let paddleStep = 25;

	// vitesse vertivale de la balle
	let ballDx = 3;
	//vitesse horizontale
	let ballDy = 0;

	//ratio de vitesse de la balle, 3 = lent, 7 = plutot rapide
	let minSpeedBall = 6;
	let maxSpeedBall = 13;

	//////////////////////////////////////////////

		//const ballRef = useRef({ x: wwidth / 2 - 100, y: 30 , radius: 10, dx: ballDx, dy: ballDy });
	////const ballRef = useRef({ x: wwidth / 2, y: hheight / 2, radius: 10, dx: ballDx, dy: ballDy });
	//
		////set angle et vitesse de depart
	//useEffect( () => {
		//	changeBallAngle(toRadians(70 + 45));
		//	changeBallSpeed(0.1);
		//	console.log('ball speed = ', getBallSpeed());
		//
			//}, []);
	/////////////////////////////////////////

		const ballRef = useRef({ x: wwidth / 2, y: hheight / 2 , radius: 10, dx: ballDx, dy: ballDy });
	//const ballRef = useRef({ x: wwidth / 2, y: hheight / 2, radius: 10, dx: ballDx, dy: ballDy });

	//set angle et vitesse de depart
	useEffect( () => {
		changeBallAngle(toRadians(0));
		changeBallSpeed(0);
		//console.log('ball speed = ', getBallSpeed());

	}, []);
	//////////////////////////////////////////////

		const canvasRef = useRef(null);

	//Fonction qui permet de donner un angle donne a la basse sans changer la vitesse
	// attention se base sur un debut d'angle a l'est et non au nord !
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

	//newSpeed doit etre entre 0 pour la vitesse la plus basse et 1 pour la plus haute
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


	let leftPaddle = { x: 35, y: leftPaddleY.current, width: paddleWidth, height: paddleHeight, dy: 0 };

	let rightPaddle = { x: wwidth - 40, y: rightPaddleY, width: paddleWidth, height: paddleHeight, dy: 0 };

	let border_top = { x: 0, y: 0, width: wwidth, height: 3};
	let border_bot = { x: 0, y: hheight - 3, width: wwidth, height: 3};
	let border_left = { x: 0, y: 0, width: 3, height: hheight};
	let border_right = { x: wwidth - 3, y: 0, width: 3, height: hheight};


	////////////////////// On va tenter de changer ca par un event du back
	//useEffect(() => {
		//	const handleKeyDown = (event) => {
			//
				//		if (event.keyCode === 87) { // 'W' key
					//			if (leftPaddle.y > (paddleHeight / 2)) 
						//				setLeftPaddleY((prevY) => prevY - paddleStep); 
					//		}
			//
				//		if (event.keyCode === 83) { // 'S' key
					//			if (leftPaddle.y + leftPaddle.height < hheight - (paddleHeight / 2)) 
						//				setLeftPaddleY((prevY) => prevY + paddleStep);
					//		}
			//	};
		//	window.addEventListener('keydown', handleKeyDown);
		//
			//	return () => {
				//		window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
				//	};
		//}, [leftPaddleY]);

	useEffect(() => {
		const handleKeyDown = (event) => {

			if (event.keyCode === 38) { // 'W' key
				if (rightPaddle.y > (paddleHeight / 2)) 
					setRightPaddleY((prevY) => prevY - paddleStep); 
			}

			if (event.keyCode === 40) { // 'S' key
				if (rightPaddle.y + rightPaddle.height < hheight - (paddleHeight / 2)) 
					setRightPaddleY((prevY) => prevY + paddleStep);
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
		};
	}, [rightPaddleY]);



	useEffect(() => {

		const canvas = canvasRef.current;
		if (!canvas)
			return; //gpt
		const context = canvas.getContext('2d');

		let animation_id;


		const update = () => {

			const ballX = ballRef.current.x;
			const ballY = ballRef.current.y;

			//// CONTACT AVEC PADDLES /////////////////////////////

				//if (ballRef.current.y + ballRadius <= leftPaddle.y

					// PADDLE GAUCHE //
					//balle dans la zone du paddle en y :
					if ( (ballY - ballRadius <= leftPaddle.y + paddleHeight) //balle au dessus de la partie basse du paddle
						&& (ballY + ballRadius >= leftPaddle.y) ) //balle au dessous de la partie haute du paddle
					//balle dans la zone du paddle en x :
					if (ballX - ballRadius <= leftPaddle.x + leftPaddle.width
						&& ballX + ballRadius >= leftPaddle.x)
					{
						ballRef.current.dx *= -1;
						//definir le nouvel angle :

						// le centre vertical du paddle
						let centre_paddle_Y = leftPaddle.y + (leftPaddle.height / 2);
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
					if ( (ballY - ballRadius <= rightPaddle.y + paddleHeight)
						&& (ballY + ballRadius >= rightPaddle.y))
					if ( (ballX + ballRadius >= rightPaddle.x)
						&& (ballX - ballRadius <= rightPaddle.x + rightPaddle.width) )
					{
						ballRef.current.dx *= -1;
						//definir le nouvel angle :

						// le centre vertical du paddle
						let centre_paddle_Y = rightPaddle.y + (rightPaddle.height / 2);
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

					if (ballY > canvas.height - 10 || ballY <= 10)
					ballRef.current.dy *= -1;
					//newDy = -newDy;
					///////////////////////////////////////////////////////

					let for_test = 0;
					// ACTUALISATION VALEURS
					if (ballX > canvas.width - 10 - for_test || ballX <= 10)
					{
						//ballRef.current.dx *= -1;
						ballRef.current.y = hheight / 2;
						changeBallSpeed(0); //fine tuning
						if (ballX > canvas.width - 10 - for_test)
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

			// Clear canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Draw Ball
			context.beginPath();
			context.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
			context.fill();

			// Draw Paddles
			context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

			context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

			//context.fillRect(rightPaddle.x, rightPaddle.y, 1, 100);
			//context.fillRect(rightPaddle.x, rightPaddle.y, 100, 1);

			context.fillRect(border_top.x, border_top.y, border_top.width, border_top.height);
			context.fillRect(border_bot.x, border_bot.y, border_bot.width, border_bot.height);
			context.fillRect(border_left.x, border_left.y, border_left.width, border_left.height);
			context.fillRect(border_right.x, border_left.y, border_left.width, border_left.height);

			//aide a la visualisation
			//context.fillRect(ballX - 250, ballY, 500, 1);
			//context.fillRect(leftPaddle.x, leftPaddle.y, 20, 1);
			//context.fillRect(leftPaddle.x, leftPaddle.y + paddleHeight, 20, 1);

			// Next frame
			animation_id = requestAnimationFrame(update);
		}

		animation_id = requestAnimationFrame(update);


		return () => {
			cancelAnimationFrame(animation_id);
		}

	}, [leftPaddleY.current, rightPaddleY]);

			return (
				<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
				<canvas ref={canvasRef} width={wwidth} height={hheight} />
				</div>
			);
}

//export default Pong;


