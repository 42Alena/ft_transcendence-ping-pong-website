//HTML elements
const canva : any = document.getElementById("gameCanva");
const ctx = canva.getContext('2d');

const gameP : any = document.getElementById('gamePage');
const chatP : any = document.getElementById('chatPage');
const leadP : any = document.getElementById('leaderboardPage');
const welcP : any = document.getElementById('welcomePage');
const playerTypeButton : any = document.getElementById('playerType');
const playerModeButton : any = document.getElementById('playerMode');
const matchTypeButton : any = document.getElementById('matchType');

function display(text: string) : void
{
	console.log(`${text}`);
	if (text == "game")
	{
		chatP.style.display = "none";
		leadP.style.display = "none";
		welcP.style.display = "none";
		gameP.style.display = "flex";
	}
	if (text == "chat")
	{
		gameP.style.display = "none";
		leadP.style.display = "none";
		welcP.style.display = "none";
		chatP.style.display = "block";
	}
	else if (text == "leaderboard")
	{
		gameP.style.display = "none";
		chatP.style.display = "none";
		welcP.style.display = "none";
		leadP.style.display = "block";
	}
}

function setSettingPlayerType(button : string)
{
	console.log(`${button}`);
	playerTypeButton.style.display = "none";
	playerModeButton.style.display = "flex";
}

function setSettingPlayerMode(button : string)
{
	console.log(`${button}`);
	playerModeButton.style.display = "none";
	matchTypeButton.style.display = "flex";
}

function setSettingMatchType(button : string)
{
	console.log(`${button}`);
	matchTypeButton.style.display = "none";
	canva.style.display = "block";
	startGame();
}

//Game
class Paddle {
	width: number;
	lenght: number;
	color: string;
	v: number; //only fixed property?
	x : number;
	y : number;

	constructor() {
	this.lenght = 16;
	this.width = this.lenght / 4;
	this.color = "white";
	this.v = 7;
	this.x = 0;
	this.y = 0;
	};

	positionPaddle(x : number, y : number) {
		this.x = x;
		this.y = y;
	}

	drawPaddle () {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.lenght);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
}

class Ball {
	lenght: number;
	deltaX : number;
	deltaY : number;
	color : string;
	x : number;
	y : number;

	constructor () {
		this.lenght = 4;
		this.deltaX = 2;
		this.deltaY = -2;
		this.color = "white";
		this.x = 0;
		this.y = 0;
	}

	drawBall() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.lenght, this.lenght);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}

	positionBall(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
}

function startGame() : void {

	chatP.style.display = "none";
	leadP.style.display = "none";
	welcP.style.display = "none";
	gameP.style.display = "flex";

	// let dpi = window.devicePixelRatio;
	// canva.width = canva.width*dpi;
    // canva.height = canva.height*dpi;
    // ctx.scale(dpi, dpi);
	let leftPaddle : Paddle = new Paddle();
	let rightPaddle : Paddle = new Paddle();
	let ball : Ball = new Ball();
	ctx.clearRect(0, 0, canva.width, canva.height);
	leftPaddle.positionPaddle(0, canva.height / 2 - leftPaddle.lenght / 2);
	rightPaddle.positionPaddle(canva.width - rightPaddle.width, canva.height / 2 - leftPaddle.lenght / 2);
	ball.positionBall(canva.width / 2, canva.height / 2);
	leftPaddle.drawPaddle();
	rightPaddle.drawPaddle();
	ball.drawBall();

}
