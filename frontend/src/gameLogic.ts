const canvas : any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let interval = 0;
let pageIndex = 1;
let displayNamePlayerOne : string;
let displayNamePlayerTwo : string;


//setup game
const playersNum : any = document.getElementById("setupNumberPlayers");
const alias : any = document.getElementById("setUpPlayers");
const instruction : any = document.getElementById("Setinstructions");
const setGame : any = document.getElementById("setupGame");
const inputPlayerOne : any = document.getElementById("namePlayerOne");
const inputNamePlayerTwo : any = document.getElementById("namePlayerTwo");
const gameScreenDiv : any = document.getElementById("gameScreen");
const resultDiv : any = document.getElementById("result");
const inputFieldPlayerOne : any = document.getElementById("displayNamePlayerOne")
const inputPlayerTwo : any = document.getElementById("displayNamePlayerTwo");
const winnerTextDiv : any = document.getElementById("winner-text");
let enableAI : boolean = true;
let gameisOn : boolean = false;

function setOnePlayer(value : boolean)
{
  //reset
  inputPlayerOne.value = "";
  inputNamePlayerTwo.value = "";
  inputPlayerOne.disabled = false;
  inputNamePlayerTwo.disabled = false;
  if (value == true)
  {
    inputPlayerTwo.classList.add("hidden");
    inputPlayerTwo.classList.remove("block");
    enableAI = true;
  }
  else 
  {
    enableAI = false;
    inputPlayerTwo.classList.add("block");
    inputPlayerTwo.classList.remove("hidden");
  }
  playersNum.classList.add("hidden");
  playersNum.classList.remove("flex");
  alias.classList.add("flex");
  alias.classList.remove("hidden");
  setAlias();
}

function setAlias() {
  if (enableAI)
  {
    displayNamePlayerTwo = "AI";
  }
}

function showStartButton() {
  runButton.classList.add("block");
  runButton.classList.remove("hidden");
}

function saveDisplayName(player : number) {
  if (player == 1)
  {
    displayNamePlayerOne = inputPlayerOne.value;
    inputPlayerOne.disabled = true;
  }
  else
  {
    displayNamePlayerTwo = inputNamePlayerTwo.value;
    inputNamePlayerTwo.disabled = true;
  }

  if (inputPlayerOne.disabled && (inputNamePlayerTwo.disabled || enableAI))
  {
    setTimeout(showStartButton, 1000);
    instruction.classList.add("block");
    instruction.classList.remove("hidden");
  }
}

inputPlayerOne.addEventListener("keydown", (event : KeyboardEvent) => {
	if (event.key == "Enter")
	{
		displayNamePlayerOne = inputPlayerOne.value;
    saveDisplayName(1);
	}
});

inputNamePlayerTwo.addEventListener("keydown", (event : KeyboardEvent) => {
	if (event.key == "Enter")
	{
		displayNamePlayerTwo = inputNamePlayerTwo.value;
    saveDisplayName(2);
	}
});

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
let pauseFlag : boolean = false;

function keyDownHandler(e: any) {
  if (gameisOn)
  {
    if (e.key === "Up" || e.key === "ArrowUp" || e.key === "Down" || e.key === "ArrowDown")
    {
      e.preventDefault();
    }
    if (e.key == "p")
    {
      if (pauseFlag == false)
      {
        clearInterval(interval);
        pauseFlag = true;
      }
      else
      {
        startGame();
        pauseFlag = false;
      }
    }
  }
  if (!enableAI)
  {
    if (e.key === "Up" || e.key === "ArrowUp") {
      paddleRight.up = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
      paddleRight.down = true;
    }
  }

  if (e.key === "w") {
    paddleLeft.up = true;
  } else if (e.key === "s") {
    paddleLeft.down = true;
  }
}

function keyUpHandler(e: any) {
   if (gameisOn)
  {
    if (e.key === "Up" || e.key === "ArrowUp" || e.key === "Down" || e.key === "ArrowDown")
    {
      e.preventDefault();
    }
  }
  if (!enableAI)
  {
    if (e.key === "Up" || e.key === "ArrowUp") {
      paddleRight.up = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
      paddleRight.down = false;
    }
  }

   if (e.key === "w") {
    paddleLeft.up = false;
  } else if (e.key === "s") {
    paddleLeft.down = false;
  }
}
//game over

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
		this.x = canvas.width / 2 - this.lenght / 2;
		this.y = canvas.height / 2 - this.lenght / 2;
	}

	drawBall() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.lenght, this.lenght);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	positionBall(x : number, y : number) {
		this.x = x;
		this.y = y;
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
let paddleRight = new Paddle();
let paddleLeft = new Paddle();
let ball = new Ball();
let score = new Score();
let board = new Board();

paddleRight.positionPaddle(canvas.width - paddleLeft.width, canvas.height / 2 - paddleRight.lenght / 2);
paddleLeft.positionPaddle(0, canvas.height / 2 - paddleRight.lenght / 2);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  score.drawScore();
  board.drawBoardElements();
  ball.drawBall();
  paddleRight.drawPaddle();
  paddleLeft.drawPaddle();

  if (paddleRight.down) {
    paddleRight.y += 7;
    if (paddleRight.y + paddleRight.lenght > canvas.height) {
      paddleRight.y = canvas.height - paddleRight.lenght;
    }
  } else if (paddleRight.up) {
    paddleRight.y -= 7;
    if (paddleRight.y < 0) {
      paddleRight.y = 0;
    }
  }

  if (paddleLeft.down) {
    paddleLeft.y += 7;
    if (paddleLeft.y + paddleLeft.lenght > canvas.height) {
      paddleLeft.y = canvas.height - paddleLeft.lenght;
    }
  } else if (paddleLeft.up) {
    paddleLeft.y -= 7;
    if (paddleLeft.y < 0) {
      paddleLeft.y = 0;
    }
  }
  
  if (ball.x + ball.dx < (paddleLeft.x + paddleLeft.width) || ball.x + ball.dx > canvas.width - ball.lenght - paddleRight.width) {
    if (ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.lenght && ball.x < canvas.width / 2)
    {
      ball.dx = -ball.dx;
    }
    else if (ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.lenght && ball.x > canvas.width / 2)
    {
      ball.dx = -ball.dx;
    }
    else
    {
      if (ball.x + ball.dx < (paddleLeft.x + paddleLeft.width))
        score.playerRight++;
      else
        score.playerLeft++;
      ball.x = canvas.width / 2 - ball.lenght / 2;
      ball.y = canvas.height / 2 - ball.lenght / 2;
    }
  }
  
  if (score.playerLeft == 3 || score.playerRight == 3)
  {
    if (score.playerLeft == 3)
    {
      winnerTextDiv.textContent = displayNamePlayerOne + " won";
      score.playerLeft++;
    }
    else
    {
      winnerTextDiv.textContent = displayNamePlayerTwo + " won";
      score.playerRight++;
    }
    gameOverDiv.classList.add("flex");
    gameOverDiv.classList.remove("hidden");
    gameScreenDiv.classList.add("hidden");
    gameScreenDiv.classList.remove("flex");
    
    clearInterval(interval);
  }

  if (ball.y + ball.dy < 0 || ball.y + ball.dy > canvas.height - (ball.lenght) ) {
    ball.dy = -ball.dy;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

const gameOverDiv : any = document.getElementById("gameOverScreen");
function startGame() {
  gameisOn = true;
  interval = setInterval(draw, 20);
}

function resetGame() {
  score.playerRight = 0;
  score.playerLeft = 0;
  paddleRight.positionPaddle(canvas.width - paddleLeft.width, canvas.height / 2 - paddleRight.lenght / 2);
  paddleLeft.positionPaddle(0, canvas.height / 2 - paddleRight.lenght / 2);
}
const runButton : any = document.getElementById("runButton");
runButton.addEventListener("click", () => {

  alias.classList.add("hidden");
  alias.classList.remove("flex");
  playersNum.classList.add("hidden");
  playersNum.classList.remove("flex");
  instruction.classList.add("hidden");
  instruction.classList.remove("block");
  setGame.classList.add("hidden");
  setGame.classList.remove("block");
  gameP.classList.add("flex");
  gameP.classList.remove("hidden");
  canvas.classList.add("blockk");
  canvas.classList.remove("hidden");
  runButton.classList.add("hidden");
  runButton.classList.remove("block");
  gameOverDiv.classList.add("hidden");
  gameOverDiv.classList.remove("flex");
  gameScreenDiv.classList.add("flex");
  gameScreenDiv.classList.remove("hidden");
  resetGame();
  startGame();
});