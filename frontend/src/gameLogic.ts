const canva : any = document.getElementById("canvas");
const context : any = canva.getContext("2d");

const paddleLenght : number = 10;
const paddleWidth : number = 5;

let y : number = canva.height / 2;
let UpPressed : boolean = false;
let downPressed : boolean = false;

document.addEventListener("keydown", (e : any) => {
	if (e.key == "w")
	{
		UpPressed = true;
	}
	else if (e.key == "s")
	{
		downPressed = true;
	}
});

document.addEventListener("keyup", (e : any) => {
	if (e.key == "w")
	{
		UpPressed = false;
	}
	else if (e.key == "s")
	{
		downPressed = false;
	}
});

function drawPaddle() {
  context.beginPath();
  context.rect(0, y, paddleWidth, paddleLenght);
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}

function draw() {
  context.clearRect(0, 0, canva.width, canva.height);
  drawPaddle();

  if (UpPressed) {
    y -= 7;
    if (y < 0) {
      y = 0;
    }
  } else if (downPressed) {
    y += 7;
    if (y + paddleLenght > canva.height) {
      y = canva.height - paddleLenght;
    }
}
}

setInterval(draw, 20);