const canvas: any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const gameScreenDiv: any = document.getElementById("gameScreen");
const resultDiv: any = document.getElementById("result");
const inputFieldPlayerOne: any = document.getElementById(
  "displayNamePlayerOne",
);
const inputPlayerTwo: any = document.getElementById("displayNamePlayerTwo");
const winnerTextDiv: any = document.getElementById("winner-text");
const startGameButtonDiv: any = document.getElementById("startButton");
const gameOverOptionsButtons: any = document.getElementById("gameOptions");
const nextGameButton: any = document.getElementById("nextGameButton");
const playAgainButton: any = document.getElementById("playAgainButton");
const newGameButton: any = document.getElementById("newGameButton");
const nextMatchButton: any = document.getElementById("nextMatch");
const gameOverDiv: any = document.getElementById("gameOverScreen");
const runButton: any = document.getElementById("runButton");

//variables used for single game and tournament game: flags, lists. To be cleaned before each game session
let gameisOn: boolean = false;
let game: Game;
let tournament: Tournament;
let gameQueue: Game[];
let interval = 0;
let matchPlayed: number = 0;
let lastGameTournament: Player[];
lastGameTournament = [];

//buttons
//new game from game over screen
newGameButton.addEventListener("click", () => {
  let singleMatch: boolean = false;
  if (!isTournament) singleMatch = true;
  gameP.classList.add("flex");
  gameP.classList.remove("hidden");
  if (singleMatch) setGameType("game");
  else setGameType("tournament");
});

//next game in tournament mode
nextGameButton.addEventListener("click", () => {
  showGamePreview();
});

//start game button
runButton.addEventListener("click", () => {
  setUpCanva();
  startGame();
});

//show page of whom is playing, commands and score
function showPageBeforeGame() {
  if (players.length == 2 && !isTournament) {
    setGame.classList.add("hidden");
    setGame.classList.remove("flex");
    showGamePreview();
  } else if (players.length == 4 && isTournament) {
    setGame.classList.add("hidden");
    setGame.classList.remove("flex");
    showGamePreview();
  }
}

function showGamePreview() {
  gameOverDiv.classList.add("hidden");
  gameOverDiv.classList.remove("flex");
  nextGameButton.classList.add("hidden");
  nextGameButton.classList.remove("flex");
  instruction.classList.add("flex");
  instruction.classList.remove("hidden");
  if (matchPlayed == 0) {
    playerNameLeft.textContent = players[0].name;
    playerNameRight.textContent = players[1].name;
  } else if (matchPlayed == 1) {
    playerNameLeft.textContent = players[2].name;
    playerNameRight.textContent = players[3].name;
  } else if (matchPlayed == 2) {
    playerNameLeft.textContent = lastGameTournament[0].name;
    playerNameRight.textContent = lastGameTournament[1].name;
  }
}

//setup canva page and hide the other pages
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
}
//classes
class Paddle {
  width: number;
  length: number;
  color: string;
  v: number;
  x: number;
  y: number;
  up: boolean;
  down: boolean;

  constructor() {
    this.length = 70;
    this.width = 10;
    this.color = "white";
    this.v = 7;
    this.x = 0;
    this.y = 0;
    this.up = false;
    this.down = false;
  }

  startPositionPaddleRight() {
    this.x = canvas.width - this.width;
    this.y = canvas.height / 2 - this.length / 2;
  }

  startPositionPaddleLeft() {
    this.x = 0;
    this.y = canvas.height / 2 - this.length / 2;
  }

  drawPaddle() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.length);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  moveUP() {}
}

class Ball {
  length: number;
  dx: number;
  dy: number;
  color: string;
  x: number;
  y: number;

  constructor() {
    this.length = 12;
    this.dx = 5;
    this.dy = -5;
    this.color = "red";
    this.x = 0;
    this.y = 0;
  }

  drawBall() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.length, this.length);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  startPositionBall() {
    this.x = canvas.width / 2 - this.length / 2;
    this.y = Math.floor(Math.random() * (canvas.height - this.length) + (this.length / 2));
  }
}

class Score {
  playerLeft: number;
  playerRight: number;

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
  constructor() {}
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
  player1: Player;
  player2: Player;
  winner: Player;
  default: Player;
  loser: Player;
  paddleLeft: Paddle;
  paddleRight: Paddle;
  score: Score;
  ball: Ball;
  board: Board;

  constructor(player1: Player, player2: Player) {
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
    this.paddleRight.startPositionPaddleRight();
    this.paddleLeft.startPositionPaddleLeft();
    this.ball.startPositionBall();
  }

  keyDownHandler(e: any) {
    if (gameisOn) {
      if (
        e.key === "Up" ||
        e.key === "ArrowUp" ||
        e.key === "Down" ||
        e.key === "ArrowDown"
      ) {
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
    if (gameisOn) {
      if (
        e.key === "Up" ||
        e.key === "ArrowUp" ||
        e.key === "Down" ||
        e.key === "ArrowDown"
      ) {
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

    if (this.player1.isAI)
    {
      if (this.ball.y > this.paddleLeft.y + this.paddleLeft.length / 2) {
        this.paddleLeft.y += 3;
      if (this.paddleLeft.y + this.paddleLeft.length > canvas.height) {
        this.paddleLeft.y = canvas.height - this.paddleLeft.length;
      }
      } else if (this.ball.y < this.paddleLeft.y + this.paddleLeft.length / 2) {
        this.paddleLeft.y -= 3;
        if (this.paddleLeft.y < 0) {
          this.paddleLeft.y = 0;
        }
      }
    }
    else
    {
      if (this.paddleLeft.down) {
      this.paddleLeft.y += 7;
      if (this.paddleLeft.y + this.paddleLeft.length > canvas.height) {
        this.paddleLeft.y = canvas.height - this.paddleLeft.length;
      }
      } else if (this.paddleLeft.up) {
        this.paddleLeft.y -= 7;
        if (this.paddleLeft.y < 0) {
          this.paddleLeft.y = 0;
        }
      }
    }
    if (this.player2.isAI)
    {
      if (this.ball.x > canvas.width / 2 && this.ball.dx > 0)
      {
          if (this.ball.y > this.paddleRight.y + this.paddleRight.length / 2 && Math.random() < 0.6) {
              this.paddleRight.y += 7;
          if (this.paddleRight.y + this.paddleRight.length > canvas.height) {
            this.paddleRight.y = canvas.height - this.paddleRight.length;
          }
          } else if (this.ball.y < this.paddleRight.y + this.paddleRight.length / 2 && Math.random() < 0.6) {
            this.paddleRight.y -= 7;
            if (this.paddleRight.y < 0) {
              this.paddleRight.y = 0;
            }
          }
      }
    }
    else
    {
      if (this.paddleRight.down) {
        this.paddleRight.y += 7;
        if (this.paddleRight.y + this.paddleRight.length > canvas.height) {
          this.paddleRight.y = canvas.height - this.paddleRight.length;
        }
      } else if (this.paddleRight.up) {
        this.paddleRight.y -= 7;
        if (this.paddleRight.y < 0) {
          this.paddleRight.y = 0;
        }
      }
    }
    if (
      this.ball.x + this.ball.dx < this.paddleLeft.x + this.paddleLeft.width ||
      this.ball.x + this.ball.dx >
        canvas.width - this.ball.length - this.paddleRight.width
    ) {
     if (
        this.ball.x + this.ball.length >= this.paddleLeft.x &&
        this.ball.y + this.ball.length > this.paddleLeft.y &&
        this.ball.x < canvas.width / 2 &&
        this.ball.y - this.ball.length < this.paddleLeft.y + this.paddleLeft.length
      ){
        this.ball.dx = -this.ball.dx;
      } else if (
        this.ball.x - this.ball.length <= this.paddleRight.x + this.paddleRight.width &&
        this.ball.y + this.ball.length > this.paddleRight.y &&
        this.ball.x > canvas.width / 2 &&
        this.ball.y - this.ball.length < this.paddleRight.y + this.paddleRight.length
      ) {
        this.ball.dx = -this.ball.dx;
      } else {
        if (
          this.ball.x + this.ball.dx <
          this.paddleLeft.x + this.paddleLeft.width
        )
          this.score.playerRight++;
        else this.score.playerLeft++;
       this.ball.startPositionBall();
       if (Math.floor(Math.random() * 2) == 1) {
          this.ball.dy *= 1;
        } 
        else {  // Other 50% of the time
          this.ball.dy *= -1;
        }
      }
    }
    if (this.score.playerLeft == 3 || this.score.playerRight == 3) {
      gameisOn = false;
      this.score.drawScore();
      clearInterval(interval);
      matchPlayed += 1;
      this.endGame();
      this.resetGame();
    }
    if (
      this.ball.y + this.ball.dy < 0 ||
      this.ball.y + this.ball.dy > canvas.height - this.ball.length
    ) {
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
  getWinner(): Player {
    return this.winner;
  }

  getLoser(): Player {
    return this.loser;
  }

  endGame() {
    if (this.score.playerLeft == 3) {
      lastGameTournament.push(this.player1);
      this.winner = this.player1;
      this.loser = this.player2;
      winnerTextDiv.textContent = this.winner.name + " won";
      this.score.playerLeft++;
    } else {
      lastGameTournament.push(this.player2);
      this.winner = this.player2;
      this.loser = this.player1;
      winnerTextDiv.textContent = this.winner.name + " won";
      this.score.playerRight++;
    }
    if (!isTournament) {
      //return game over screen
      gameOverDiv.classList.add("flex");
      gameOverDiv.classList.remove("hidden");
      gameOverOptionsButtons.classList.add("flex");
      gameOverOptionsButtons.classList.remove("hidden");
      gameScreenDiv.classList.add("hidden");
      gameScreenDiv.classList.remove("flex");
      matchPlayed = 0;
      players = [];
      gameisOn = false;
    } else {
      //return next game screen
      if (matchPlayed == 3) {
        gameOverDiv.classList.add("flex");
        gameOverDiv.classList.remove("hidden");
        gameOverOptionsButtons.classList.add("flex");
        gameOverOptionsButtons.classList.remove("hidden");
        gameScreenDiv.classList.add("hidden");
        gameScreenDiv.classList.remove("flex");
        matchPlayed = 0;
      } else {
        gameOverDiv.classList.add("flex");
        gameOverDiv.classList.remove("hidden");
        gameOverOptionsButtons.classList.add("hidden");
        gameOverOptionsButtons.classList.remove("flex");
        nextGameButton.classList.add("flex");
        nextGameButton.classList.remove("hidden");
        gameScreenDiv.classList.add("hidden");
        gameScreenDiv.classList.remove("flex");
      }
    }
  }
}

class Tournament {
  players: Player[];
  games: Game[];
  matches_count: number;
  winners: Player[];
  losers: Player[];

  constructor(players: Player[]) {
    this.players = players;
    this.games = [];
    this.matches_count = 0;
    this.winners = [];
    this.losers = [];

    game = new Game(players[0], players[1]);
    this.games.push(game);
    game = new Game(players[2], players[3]);
    this.games.push(game);
  }

  getGamesList() {
    return this.games;
  }

  playGame(game: Game) {
    interval = setInterval(() => game.draw(), 20);
  }
}

//setup single match or tournament match before starting the game
function startGame() {
  gameisOn = true;
  if (players.length == 2) {
    game = new Game(players[0], players[1]);
    interval = setInterval(() => game.draw(), 20);
  } else {
    if (matchPlayed == 0) {
      console.log("start tournament");
      tournament = new Tournament(players);
      gameQueue = tournament.getGamesList();
      tournament.playGame(gameQueue[0]);
    }
    if (matchPlayed == 1) {
      console.log("next tournament");
      gameQueue = tournament.getGamesList();
      tournament.playGame(gameQueue[1]);
    }
    if (matchPlayed == 2) {
      console.log("last tournament");
      gameQueue = tournament.getGamesList();
      let newGame = new Game(lastGameTournament[0], lastGameTournament[1]);
      tournament.playGame(newGame);
    }
  }
}
