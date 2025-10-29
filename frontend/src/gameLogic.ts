const canvas : any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e : any) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    paddleLeft.up = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    paddleLeft.down = true;
  }

   if (e.key === "w") {
    paddleRight.up = true;
  } else if (e.key === "s") {
    paddleRight.down = true;
  }
}

function keyUpHandler(e : any) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    paddleLeft.up = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    paddleLeft.down = false;
  }

   if (e.key === "w") {
    paddleRight.up = false;
  } else if (e.key === "s") {
    paddleRight.down = false;
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
	this.lenght = 35;
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
		this.lenght = 8;
		this.dx = 2;
		this.dy = -2;
		this.color = "white";
		this.x = canvas.width / 2 - this.lenght / 2;
		this.y = canvas.height / 2 - this.lenght / 2;
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

let paddleRight = new Paddle();
let paddleLeft = new Paddle();
let ball = new Ball();

paddleRight.positionPaddle(0, canvas.height / 2 - paddleRight.lenght / 2);
paddleLeft.positionPaddle(canvas.width - paddleLeft.width, canvas.height / 2 - paddleRight.lenght / 2);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  if (ball.x + ball.dx > canvas.width - 3 || ball.x + ball.dx < 3) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy > canvas.height - 3 || ball.y + ball.dy < 3) {
    ball.dy = -ball.dy;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

function startGame() {
  setInterval(draw, 10);
}

const runButton : any = document.getElementById("runButton");
runButton.addEventListener("click", () => {
  startGame();
  runButton.disabled = true;
});
