const canvas : any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let interval = 0;
let pageIndex = 1;

//setup game
const playersNum : any = document.getElementById("setupNumberPlayers");
const alias : any = document.getElementById("setupDisplayName");
const instruction : any = document.getElementById("game-instructions");
const setGame : any = document.getElementById("setupGame");
let enableAI : boolean = true;

function showNextGamePage() {
  setGame.style.display = "block";
  console.log(`Current pageIndex: ${pageIndex}`);
  
  if (pageIndex == 0) {
    console.log("Displaying playersNum");
    playersNum.style.display = "flex";
    alias.style.display = "none";
    instruction.style.display = "none";
    pageIndex++;
  }
  else if (pageIndex == 1) {
    console.log("Displaying alias");
    alias.style.display = "flex";
    playersNum.style.display = "none";
    instruction.style.display = "none";
    pageIndex++;
  }
  else if (pageIndex == 2) {
    console.log("Displaying instruction");
    instruction.style.display = "flex";
    alias.style.display = "none";
    playersNum.style.display = "none";
    pageIndex = 0;
  }
}

function setOnePlayer(value : boolean)
{
  console.log(`value: ${value}`);
  if (value == true)
  {
    console.log("one player selected");
    enableAI = true;
  }
  else 
  {
    enableAI = false;
    console.log("two players selected");
  }
  playersNum.style.display = "none";
  alias.style.display = "flex";
}


//ask about name to display
//ask number of players
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e : any) {
  e.preventDefault()
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

function keyUpHandler(e : any) {
  e.preventDefault()
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
		this.dx = 2;
		this.dy = -2;
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
    if (ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.lenght || ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.lenght) {
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

  if (ball.y + ball.dy < 0 || ball.y + ball.dy > canvas.height - (ball.lenght) ) {
    ball.dy = -ball.dy;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

function startGame() {
  interval = setInterval(draw, 20);
}

const runButton : any = document.getElementById("runButton");
runButton.addEventListener("click", () => {

  alias.style.display = "none;"
  playersNum.style.display = "none";
  instruction.style.display = "none";
  setGame.style.display = "none";
  gameP.style.disabled = "flex";
  canvas.style.display = "block";
  startGame();
  pageIndex = 0;
  runButton.disabled = true;
});