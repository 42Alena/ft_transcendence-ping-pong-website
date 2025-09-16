//draw on canva

const canvas : any = document.getElementById('canva'); //always define type, can be not any?
const ctx = canvas.getContext('2d');

let upPressedPlayer1 : boolean = false;
let downPressedPlayer1 : boolean = false;
let upPressedPlayer2 : boolean = false;
let downPressedPlayer2 : boolean = false;
let enterKeyPressed : boolean = false;
let pauseKeyPressed : boolean = false;
let paddleWidth : number = 6;
let paddleHeight : number = 50;
let player1 : number = 0;
let player2 : number = canvas.height - paddleHeight;
let ballX : number = canvas.width / 2;
let ballY : number = canvas.height / 2;
let ballR : number = 5;
let dx : number = 2;
let dy : number = -2;
let intervalId : number;

function drawPlayer1() : void
{

	ctx.beginPath();
	ctx.rect(0, player1, paddleWidth, paddleHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawPlayer2() : void
{

	ctx.beginPath();
	ctx.rect(canvas.width - paddleWidth, player2, paddleWidth, paddleHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawBall() : void
{
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function draw() : void {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPlayer1();
	drawPlayer2();
	if (upPressedPlayer1 && player1 > 0) {
		player1 -= 7;
	}
	else if (downPressedPlayer1 && player1 < canvas.height - paddleHeight) {
		player1 += 7;
	}

	if (upPressedPlayer2 && player2 > 0) {
		player2 -= 7;
	}
	if (downPressedPlayer2 && player2 < canvas.height - paddleHeight) {
		player2 += 7;
	}

	if (ballX + dx < ballR)
	{
		if (ballY > player1 && ballY < player1 + paddleHeight)
			dx = -dx;
		else {
			ballX = canvas.width / 2;
			ballY = canvas.height / 2;
		}
	}
	else if (ballX + dx > canvas.width - ballR)
	{
		if (ballY > player2 && ballY < player2 + paddleHeight)
			dx = -dx;
		else {
			ballX = canvas.width / 2;
			ballY = canvas.height / 2;
		}
	}
	if (ballY + dy < ballR)
		dy = -dy;
	else if (ballY + dy > canvas.height - ballR)
		dy = -dy;
	ballX += dx;
	ballY += dy;
}

//events game
document.addEventListener("keydown", (event) => {


		if (event.key == "Enter")
		{
			if (enterKeyPressed == false) {
				enterKeyPressed = true;
				pauseKeyPressed = false;
				startGame();
			}
		}
		else if (event.key == "p")
		{
			if (pauseKeyPressed == false)
			{
				pauseKeyPressed = true;
				enterKeyPressed = false;
				pauseGame();
			}
		}
		if (event.key == "w")
			upPressedPlayer1 = true;
		else if (event.key == "s")
			downPressedPlayer1 = true;
		
		if (event.key == "i")
			upPressedPlayer2 = true;
		else if (event.key == "k")
			downPressedPlayer2 = true;

});

document.addEventListener("keyup", (event) => {
	if (event.key == "w")
		upPressedPlayer1 = false;
	else if (event.key == "s")
		downPressedPlayer1 = false;
	
	if (event.key == "i")
		upPressedPlayer2 = false;
	else if (event.key == "k")
		downPressedPlayer2 = false;
});

//functions
function startGame() : void {
	intervalId = setInterval(draw, 20);
}

function pauseGame() : void {
	clearInterval(intervalId);
}