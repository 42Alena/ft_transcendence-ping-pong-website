const canvas : any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// const ballRadius = 10;
// let x = canvas.width / 2;
// let y = canvas.height - 30;
// let dx = 2;
// let dy = -2;
const paddleHeight = 35;
const paddleWidth = 10;
let paddleX = 0;
let paddleY = 0;
let up = false;
let down = false;

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
// function drawBall() {
//   ctx.beginPath();
//   ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//   ctx.fillStyle = "#0095DD";
//   ctx.fill();
//   ctx.closePath();
// }

let paddleRight = new Paddle();
let paddleLeft = new Paddle();

paddleRight.positionPaddle(0, canvas.height / 2 - paddleRight.lenght / 2);
paddleLeft.positionPaddle(canvas.width - paddleLeft.width, canvas.height / 2 - paddleRight.lenght / 2);
// paddleRight.drawPaddle();

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // drawBall();
  paddleRight.drawPaddle();
  paddleLeft.drawPaddle();

  // if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
  //   dx = -dx;
  // }
  // if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
  //   dy = -dy;
  // }

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

  // x += dx;
  // y += dy;
}

function startGame() {
  setInterval(draw, 10);
}

const runButton : any = document.getElementById("runButton");
runButton.addEventListener("click", () => {
  startGame();
  runButton.disabled = true;
});