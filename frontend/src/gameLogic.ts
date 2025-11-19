const canvas : any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let interval = 0;
let pageIndex = 1;
let pauseFlag : boolean = false;
let tournamentisOn : boolean = false;
let matchPlayed : number = 0;
let lastGameTournament : Player[];
lastGameTournament = [];
const gameScreenDiv : any = document.getElementById("gameScreen");
const resultDiv : any = document.getElementById("result");
const inputFieldPlayerOne : any = document.getElementById("displayNamePlayerOne")
const inputPlayerTwo : any = document.getElementById("displayNamePlayerTwo");
const winnerTextDiv : any = document.getElementById("winner-text");
const startGameButtonDiv : any = document.getElementById("startButton");
const gameNextGameDiv : any = document.getElementById("nextGameTournament");
let enableAI : boolean = false;
let gameisOn : boolean = false;
let currentMatchisOn : boolean = false;

function initGame()
{
  
  if (players.length == 2 && !isTournament)
  {
    setGame.classList.add("hidden");
    setGame.classList.remove("flex");
    console.log(`player 1 ${players[0].name} - ${players[0].isAI}`);
    console.log(`player 2 ${players[1].name} - ${players[1].isAI}`);
    //showGameInfo();
    showStartButton();
  }
  else if (players.length == 4 && isTournament)
  {
    setGame.classList.add("hidden");
    setGame.classList.remove("flex");
    console.log(`player 1 ${players[0].name} - ${players[0].isAI}`);
    console.log(`player 2 ${players[1].name} - ${players[1].isAI}`);
    //showGameInfo();
    console.log(`player 3 ${players[2].name} - ${players[2].isAI}`);
    console.log(`player 4 ${players[3].name} - ${players[3].isAI}`);
    //showGameInfo();
    //showGameInfo();
    showStartButton();
  }
}

function showStartButton() {
  instruction.classList.add("flex");
  instruction.classList.remove("hidden");
}

class Paddle {
	width: number;
	lenght: number;
	color: string;
	v: number;
	x : number;
	y : number;
  up : boolean;
  down : boolean;

	constructor() {
	this.lenght = 70;
	this.width = 10;
	this.color = "white";
	this.v = 7;
	this.x = 0;
	this.y = 0;
  this.up = false;
  this.down = false;
	};

  startPositionPaddleRight() {
    this.x = canvas.width - this.width;
    this.y = canvas.height / 2 - this.lenght / 2;
  }

  startPositionPaddleLeft() {
    this.x = 0;
    this.y = canvas.height / 2 - this.lenght / 2;
  }

	drawPaddle() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.lenght);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

  moveUP() {

  }
}

class Ball {
	lenght: number;
	dx : number;
	dy : number;
	color : string;
	x : number;
	y : number;

	constructor () {
		this.lenght = 12;
		this.dx = 3;
		this.dy = -3;
		this.color = "red";
		this.x = 0;
		this.y = 0;
	}

	drawBall() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.lenght, this.lenght);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	startPositionBall() {
		this.x = canvas.width / 2 - this.lenght / 2;
		this.y = canvas.height / 2 - this.lenght / 2;
	}
}

class Score {
  playerLeft : number;
  playerRight : number;

  constructor() {
    this.playerLeft = 0;
    this.playerRight = 0;
  }

  drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${this.playerLeft} - ${this.playerRight}`, 8, 20);
}

}

class Board {

  constructor(){}
   drawBoardElements() {
    this.drawMiddleLine();
    this.drawTopLine();
    this.drawBottomLine();
   }

   drawMiddleLine() {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  drawTopLine() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.stroke();
   }
  drawBottomLine() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.stroke();
   }

}

class Game {
  player1 : Player;
  player2 : Player;
  winner : Player;
  default : Player;
  loser : Player;
  paddleLeft : Paddle;
  paddleRight : Paddle;
  score : Score;
  ball : Ball;
  board : Board;

  constructor(player1 : Player, player2 : Player)
  {
    this.player1 = player1;
    this.player2 = player2;
    this.default = new Player("default", false, -1);
    this.winner = this.default; 
    this.loser = this.default; 
    this.score = new Score();
    this.ball = new Ball();
    this.board = new Board();
    this.paddleLeft = new Paddle();
    this.paddleRight = new Paddle();
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
    this.initGame();
  }

  initGame() {
    console.log(`in game player 1: ${this.player1.name} - player 2: ${this.player2.name}`);
    this.paddleRight.startPositionPaddleRight()
    this.paddleLeft.startPositionPaddleLeft();
    this.ball.startPositionBall();
  }

 keyDownHandler(e: any) {
  console.log("Player 1:", this.player1.isAI);
  console.log("Player 2:", this.player2.isAI);
  console.log("Player 1:", this.player1.name);
  console.log("Player 2:", this.player2.name);
  if (gameisOn) {
    if (e.key === "Up" || e.key === "ArrowUp" || e.key === "Down" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  }
  if (!this.player2.isAI) {
    if (e.key === "Up" || e.key === "ArrowUp") {
      this.paddleRight.up = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
      this.paddleRight.down = true;
    }
  }

  if (!this.player1.isAI) {
    if (e.key === "w") {
      this.paddleLeft.up = true;
    } else if (e.key === "s") {
      this.paddleLeft.down = true;
    }
  }
}

keyUpHandler(e: any) {
    console.log("Player 1:", this.player1.isAI);
    console.log("Player 2:", this.player2.isAI);
  if (gameisOn) {
    if (e.key === "Up" || e.key === "ArrowUp" || e.key === "Down" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  if (!this.player2.isAI) {
    if (e.key === "Up" || e.key === "ArrowUp") {
      this.paddleRight.up = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
      this.paddleRight.down = false;
    }
    }
  }
  if (!this.player1.isAI) {
    if (e.key === "w") {
      this.paddleLeft.up = false;
    } else if (e.key === "s") {
      this.paddleLeft.down = false;
    }
  }
}

draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  this.score.drawScore();
  this.board.drawBoardElements();
  this.ball.drawBall();
  this.paddleRight.drawPaddle();
  this.paddleLeft.drawPaddle();

  if (this.paddleRight.down) {
    this.paddleRight.y += 7;
    if (this.paddleRight.y + this.paddleRight.lenght > canvas.height) {
      this.paddleRight.y = canvas.height - this.paddleRight.lenght;
    }
  } else if (this.paddleRight.up) {
    this.paddleRight.y -= 7;
    if (this.paddleRight.y < 0) {
      this.paddleRight.y = 0;
    }
  }
  if (this.paddleLeft.down) {
    this.paddleLeft.y += 7;
    if (this.paddleLeft.y + this.paddleLeft.lenght > canvas.height) {
      this.paddleLeft.y = canvas.height - this.paddleLeft.lenght;
    }
  } else if (this.paddleLeft.up) {
    this.paddleLeft.y -= 7;
    if (this.paddleLeft.y < 0) {
      this.paddleLeft.y = 0;
    }
  }
  if (this.ball.x + this.ball.dx < (this.paddleLeft.x + this.paddleLeft.width) || this.ball.x + this.ball.dx > canvas.width - this.ball.lenght - this.paddleRight.width) {
    if (this.ball.y > this.paddleLeft.y && this.ball.y <this. paddleLeft.y + this.paddleLeft.lenght && this.ball.x < canvas.width / 2)
    {
      this.ball.dx = -this.ball.dx;
    }
    else if (this.ball.y > this.paddleRight.y && this.ball.y < this.paddleRight.y + this.paddleRight.lenght && this.ball.x > canvas.width / 2)
    {
      this.ball.dx = -this.ball.dx;
    }
    else
    {
      if (this.ball.x + this. ball.dx < (this.paddleLeft.x + this.paddleLeft.width))
        this.score.playerRight++;
      else
        this.score.playerLeft++;
      this.ball.x = canvas.width / 2 - this.ball.lenght / 2;
      this.ball.y = canvas.height / 2 - this.ball.lenght / 2;
    }
  }
  if (this.score.playerLeft == 3 || this.score.playerRight == 3)
  {
    gameisOn = false;
    clearInterval(interval);
    matchPlayed += 1;
    console.log(`match played ${matchPlayed}`);
    this.endGame();
    this.resetGame();
  }
  if (this.ball.y + this.ball.dy < 0 || this.ball.y + this.ball.dy > canvas.height - (this.ball.lenght) ) {
    this.ball.dy = -this.ball.dy;
  }
  this.ball.x += this.ball.dx;
  this.ball.y += this.ball.dy;
  }

  resetGame() {
  this.score.playerRight = 0;
  this.score.playerLeft = 0;
  this.paddleRight.startPositionPaddleRight();
  this.paddleLeft.startPositionPaddleLeft();
}
  getWinner() : Player {
    return this.winner;
  }

  getLoser() : Player {
    return this.loser;
  }

  endGame() {
    if (this.score.playerLeft == 3)
    {
      lastGameTournament.push(this.player1);
      this.winner = this.player1
      this.loser = this.player2;
      winnerTextDiv.textContent = this.winner.name + " won";
      this.score.playerLeft++;
    }
    else
    {
      lastGameTournament.push(this.player2);
      this.winner = this.player2;
      this.loser = this.player1;
      winnerTextDiv.textContent = this.winner.name + " won";
      this.score.playerRight++;
    }
    if (!isTournament)
    {
      //return game over screen
      gameOverDiv.classList.add("flex");
      gameOverDiv.classList.remove("hidden");
      gameScreenDiv.classList.add("hidden");
      gameScreenDiv.classList.remove("flex");
      matchPlayed = 0;
    }
    else
    {
      //return next game screen
      if (matchPlayed == 3)
      {
        gameOverDiv.classList.add("flex");
        gameOverDiv.classList.remove("hidden");
        gameScreenDiv.classList.add("hidden");
        gameScreenDiv.classList.remove("flex");
        matchPlayed = 0;
      }
      else {
        gameNextGameDiv.classList.add("flex");
        gameNextGameDiv.classList.remove("hidden");
        gameScreenDiv.classList.add("hidden");
        gameScreenDiv.classList.remove("flex");
      }
    }
  }
};

class Tournament {
  players : Player[];
  games : Game[];
  // randomNumberList : number[];
  matches_count : number;
  winners : Player[];
  losers : Player[];

  constructor(players : Player[]) {
    this.players = players;
    for (let i = 0; i < players.length; i++)
    {
      console.log(`in tournament class: player ${i}: ${players[i].name}`);
    }
    this.games = [];
    this.matches_count = 0;
    this.winners = [];
    this.losers = [];

    // let randomNumber : number;
    // let isDuplicate = false;
    // this.randomNumberList = [];
    // while (this.randomNumberList.length < 4) {
    //   randomNumber = Math.floor(Math.random() * 4);
    //   isDuplicate = false;
    //   for (let i = 0; i < this.randomNumberList.length; i++) {
    //       if (randomNumber === this.randomNumberList[i]) {
    //           isDuplicate = true;
    //           break;
    //       }
    //   }
    //   if (!isDuplicate) {
    //       this.randomNumberList.push(randomNumber);
    //   }
    // }
    // for (let i = 0; i < this.randomNumberList.length; i++)
    //     console.log(`random ${this.randomNumberList[i]}`);
    // let game : Game;
    // const i = this.randomNumberList[0];
    // game = new Game(players[this.randomNumberList[0]], players[this.randomNumberList[1]]);
    // this.games.push(game);
    // game = new Game(players[this.randomNumberList[2]], players[this.randomNumberList[3]]);
    // this.games.push(game);
    game = new Game(players[0], players[1]);
    this.games.push(game);
    game = new Game(players[2], players[3]);
    this.games.push(game);
    console.log(`game 1 ${this.games[0].player1.name} vs ${this.games[0].player2.name}`);
    console.log(`game 2 ${this.games[1].player1.name} vs ${this.games[1].player2.name}`);
  }

  getGamesList() {
    return this.games;
  }

  playGame(game : Game)
  {

    currentMatchisOn = true;
    console.log(`start match - Player 1: ${game.player1.name} - Player 2: ${game.player2.name}`);
    interval = setInterval(() => game.draw(), 20);
  }
}

const nextMatchButton : any = document.getElementById("nextMatch");
const gameOverDiv : any = document.getElementById("gameOverScreen");
const runButton : any = document.getElementById("runButton");

nextMatchButton.addEventListener("click", () => {
  setUpCanva();
  startGame();
});

let game : Game;
let tournament : Tournament;
let gameQueue : Game[];

function setUpCanva() {
  aliasPage.classList.add("hidden");
  aliasPage.classList.remove("flex");
  instruction.classList.add("hidden");
  instruction.classList.remove("flex");
  setGame.classList.add("hidden");
  setGame.classList.remove("block");
  gameP.classList.add("flex");
  gameP.classList.remove("hidden");
  canvas.classList.add("blockk");
  canvas.classList.remove("hidden");
  gameOverDiv.classList.add("hidden");
  gameOverDiv.classList.remove("flex");
  gameScreenDiv.classList.add("flex");
  gameScreenDiv.classList.remove("hidden");
  gameNextGameDiv.classList.add("hidden");
  gameNextGameDiv.classList.remove("flex");
}

function startGame () {
  gameisOn = true;
  if (players.length == 2)
  {
    game = new Game(players[0], players[1]);
    interval = setInterval(() => game.draw(), 20);
  }
  else
  {
    if (matchPlayed == 0)
    {
      console.log("start tournament");
      tournament = new Tournament(players);
      gameQueue = tournament.getGamesList();

      console.log("Player 1:", gameQueue[0].player1.name);
      console.log("Player 2:", gameQueue[0].player2.name);
      tournament.playGame(gameQueue[0]);
    }
    if (matchPlayed == 1)
    {
      console.log("next tournament");
      console.log("Player 1:", gameQueue[1].player1.name);
      console.log("Player 2:", gameQueue[1].player2.name);
      gameQueue = tournament.getGamesList();
      tournament.playGame(gameQueue[1]);
    }
    if (matchPlayed == 2)
    {
      console.log("last tournament");
      gameQueue = tournament.getGamesList();
      let newGame = new Game(lastGameTournament[0], lastGameTournament[1]);
      tournament.playGame(newGame);
    }
  }
}

runButton.addEventListener("click", () => {  
  setUpCanva();
  startGame();
});