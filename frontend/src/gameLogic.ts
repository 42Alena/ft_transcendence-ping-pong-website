const canvas : any = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let interval = 0;
let pageIndex = 1;
let displayNamePlayerOne : string;
let displayNamePlayerTwo : string;

class Player {
    name: string;
    score: number;
    enableAI : boolean;

    constructor(name : string, score : number, AI : boolean)
    {
      this.name = name;
      this.score = score;
      this.enableAI = false;
    }
}

const players: Player[] = [];

//setup game
const setGame : any = document.getElementById("setUpGame");
const aliasPage : any = document.getElementById("setUpPlayers");
const aliasPlayerOneDiv : any = document.getElementById("aliasPlayerOne");
const aliasPlayerTwoDiv : any = document.getElementById("aliasPlayerTwo");
const aliasPlayerThreeDiv : any = document.getElementById("aliasPlayerThree");
const aliasPlayerFourDiv : any = document.getElementById("aliasPlayerFour");

const aliasPlayerOneInput : any = document.getElementById("namePlayerOne");
const aliasPlayerTwoInput : any = document.getElementById("namePlayerTwo");
const aliasPlayerThreeInput : any = document.getElementById("namePlayerThree");
const aliasPlayerFourInput : any = document.getElementById("namePlayerFour");

const AIPlayerOneButtonsDiv : any = document.getElementById("AIPlayerOne");
const AIPlayerTwoButtonsDiv : any = document.getElementById("AIPlayerTwo");
const AIPlayerThreeButtonsDiv : any = document.getElementById("AIPlayeThree");
const AIPlayerFourButtonsDiv : any = document.getElementById("AIPlayerFour");


const aliasPlayerOneButton : any = document.getElementById("okPlayerOne");
const aliasPlayerTwoButton : any = document.getElementById("okPlayerTwo");
const aliasPlayerThreeButton : any = document.getElementById("okPlayerThree");
const aliasPlayerFourButton : any = document.getElementById("okPlayerFour");

const AIonButtonPlayerOne : any = document.getElementById("AIonPlayerOne");
const AIonButtonPlayerTwo : any = document.getElementById("AIonPlayerTwo");
const AIonButtonPlayerThree : any = document.getElementById("AIonPlayerThree");
const AIonButtonPlayerFour : any = document.getElementById("AIonPlayerFour");

const AIoffButtonPlayerOne : any = document.getElementById("AIoffPlayerOne");
const AIoffButtonPlayerTwo : any = document.getElementById("AIoffPlayerTwo");
const AIoffButtonPlayerThree : any = document.getElementById("AIoffPlayerThree");
const AIoffButtonPlayerFour : any = document.getElementById("AIoffPlayerFour");


const instruction : any = document.getElementById("setInstructions");
const gameScreenDiv : any = document.getElementById("gameScreen");
const resultDiv : any = document.getElementById("result");
const inputFieldPlayerOne : any = document.getElementById("displayNamePlayerOne")
const inputPlayerTwo : any = document.getElementById("displayNamePlayerTwo");
const winnerTextDiv : any = document.getElementById("winner-text");
let enableAI : boolean = true;
let gameisOn : boolean = false;
let isTournament : boolean;

function setGameType(text : string)
{
  if (text == "game")
    isTournament = false;
  else
    isTournament = true;
  console.log(`${isTournament}`);
  setGame.classList.add("flex");
  setGame.classList.remove("hidden");
  //reset html
  aliasPlayerOneInput.value = '';
  aliasPlayerTwoInput.value = '';
  aliasPlayerThreeInput.value = '';
  aliasPlayerFourInput.value = '';

  aliasPlayerOneInput.readOnly = false;
  aliasPlayerOneButton.disabled = false;

  aliasPage.classList.add("flex");
  aliasPage.classList.remove("hideen");
  aliasSelection();
  gameOverDiv.classList.add("hidden");
  gameOverDiv.classList.remove("flex");
  instruction.classList.add("hidden");
  instruction.classList.remove("block");
  runButton.classList.add("hidden");
  runButton.classList.remove("block");
  if (gameisOn)
  {
    clearInterval(interval);
    canvas.classList.add("hidden");
    canvas.classList.remove("block");
    gameisOn = false;
  }
}

function aliasSelection()
{
  if (isTournament == false)
  {
    aliasPlayerThreeDiv.classList.add("hidden");
    aliasPlayerThreeDiv.classList.remove("block");
    aliasPlayerFourDiv.classList.add("hidden");
    aliasPlayerFourDiv.classList.remove("block");
  }
  else
  {
    aliasPlayerThreeDiv.classList.add("block");
    aliasPlayerThreeDiv.classList.remove("hidden");
    aliasPlayerFourDiv.classList.add("block");
    aliasPlayerFourDiv.classList.remove("hidden");
  }
}

function turnOn(activeButton : any, offButtonId : any, playerNumber : string)
{
  const offButton : any = document.getElementById(offButtonId);

  activeButton.classList.remove('bg-green-300', 'hover:bg-green-500');
  activeButton.classList.add('bg-green-600', 'hover:bg-green-700');
  
  offButton.classList.remove('bg-gray-600', 'hover:bg-gray-700');
  offButton.classList.add('bg-gray-300', 'hover:bg-gray-500');

  switch (playerNumber)
  {
    case "playerOne":
      aliasPlayerOneInput.value = "AI";
      break;
    case "playerTwo":
      aliasPlayerTwoInput.value = "AI";
      break;
    case "playerThree":
      aliasPlayerThreeInput.value = "AI";
      break;
    case "playerFour":
      aliasPlayerFourInput.value = "AI";
      break;
  }

}

function turnOff(activeButton : any, onButtonId : any, playerNumber : string)
{
  const onButton : any = document.getElementById(onButtonId);

  activeButton.classList.remove('bg-gray-300', 'hover:bg-gray-500');
  activeButton.classList.add('bg-gray-600', 'hover:bg-gray-700');

  onButton.classList.remove('bg-green-600', 'hover:bg-green-700');
  onButton.classList.add('bg-green-300', 'hover:bg-green-500');

  switch (playerNumber)
  {
    case "playerOne":
      aliasPlayerOneInput.value = "";
      break;
    case "playerTwo":
      aliasPlayerTwoInput.value = "";
      break;
    case "playerThree":
      aliasPlayerThreeInput.value = "";
      break;
    case "playerFour":
      aliasPlayerFourInput.value = "";
      break;
  }
}
function initGame()
{
  if (aliasPlayerOneButton.disabled && aliasPlayerTwoButton.disabled && !isTournament)
  {
    setTimeout(showStartButton, 1000);
    instruction.classList.add("block");
    instruction.classList.remove("hidden");
  }
}

aliasPlayerOneButton.addEventListener("click", (event : any) =>
{
  for (let i = 0; i < players.length; i++)
  {
    if (players[i].name == aliasPlayerOneInput.value || aliasPlayerOneInput.value == "AI") {
      aliasPlayerOneInput.value = "Choose another alias";
      return;
    }
  }
  aliasPlayerOneInput.readOnly = true;
  aliasPlayerOneButton.disabled = true;
  const player = new Player(aliasPlayerOneInput.value, 0, false);
  players.push(player);
  initGame();

});

aliasPlayerTwoButton.addEventListener("click", (event : any) =>
{
  let AIon : boolean = true;

  if (aliasPlayerTwoInput.value != "AI")
  {
    AIon = false;
    for (let i = 0; i < players.length; i++)
    {
      if (players[i].name == aliasPlayerTwoInput.value) {
        aliasPlayerTwoInput.value = "Choose another alias";
        return;
      }
    }
  }
  AIPlayerTwoButtonsDiv.classList.add("invisible");
  aliasPlayerTwoInput.readOnly = true;
  aliasPlayerTwoButton.disabled = true;
  const player = new Player(aliasPlayerTwoInput.value, 0, AIon);
  players.push(player);
  initGame();
});

aliasPlayerThreeButton.addEventListener("click", (event : any) =>
{
  let AIon : boolean = true;
  if (aliasPlayerThreeInput.value != "AI")
  {
    AIon = false;
    for (let i = 0; i < players.length; i++)
    {
      if (players[i].name == aliasPlayerThreeInput.value) {
        aliasPlayerThreeInput.value = "Choose another alias";
        break;
      }
    }
  }
  AIPlayerThreeButtonsDiv.classList.add("invisible");
  aliasPlayerThreeInput.readOnly = true;
  aliasPlayerThreeButton.disabled = true;
  const player = new Player(aliasPlayerThreeInput.value, 0, AIon);
  players.push(player);
  initGame();
});

aliasPlayerFourButton.addEventListener("click", (event : any) =>
{
  let AIon : boolean = true;
  if (aliasPlayerFourInput.value != "AI")
  {
    AIon = false;
    for (let i = 0; i < players.length; i++)
    {
      if (players[i].name == aliasPlayerFourInput.value) {
        aliasPlayerFourInput.value = "Choose another alias";
        break;
      }
    }
  }
  AIPlayerFourButtonsDiv.classList.add("invisible");
  aliasPlayerFourInput.readOnly = true;
  aliasPlayerFourButton.disabled = true;
  const player = new Player(aliasPlayerFourInput.value, 0, AIon);
  players.push(player);
  initGame();
});


// function setOnePlayer(value : boolean)
// {
//   //reset
//   inputPlayerOne.value = "";
//   inputNamePlayerTwo.value = "";
//   inputPlayerOne.disabled = false;
//   inputNamePlayerTwo.disabled = false;
//   if (value == true)
//   {
//     inputPlayerTwo.classList.add("hidden");
//     inputPlayerTwo.classList.remove("block");
//     enableAI = true;
//   }
//   else 
//   {
//     enableAI = false;
//     inputPlayerTwo.classList.add("block");
//     inputPlayerTwo.classList.remove("hidden");
//   }
//   playersNum.classList.add("hidden");
//   playersNum.classList.remove("flex");
//   alias.classList.add("flex");
//   alias.classList.remove("hidden");
//   setAlias();
// }

function showStartButton() {
  runButton.classList.add("block");
  runButton.classList.remove("hidden");
}

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

  aliasPage.classList.add("hidden");
  aliasPage.classList.remove("flex");
  // playersNum.classList.add("hidden");
  // playersNum.classList.remove("flex");
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