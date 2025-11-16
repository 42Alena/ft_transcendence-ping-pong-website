class Player {
    name: string;
    score: number;
    isAI : boolean;
    playerNum : number;

    constructor(name : string, score : number, AI : boolean, num : number)
    {
      this.name = name;
      this.score = score;
      this.isAI = false;
      this.playerNum = num;
    }
}

let players: Player[] = [];

const setGame : any = document.getElementById("setUpGame");
const aliasPage : any = document.getElementById("setUpPlayers");

const aliasPlayerThreeDiv : any = document.getElementById("aliasPlayerThree");
const aliasPlayerFourDiv : any = document.getElementById("aliasPlayerFour");

const aliasPlayerOneInput : any = document.getElementById("namePlayerOne");
const aliasPlayerTwoInput : any = document.getElementById("namePlayerTwo");
const aliasPlayerThreeInput : any = document.getElementById("namePlayerThree");
const aliasPlayerFourInput : any = document.getElementById("namePlayerFour");

const AIPlayerOneButtonsDiv : any = document.getElementById("AIPlayerOne");
const AIPlayerTwoButtonsDiv : any = document.getElementById("AIPlayerTwo");
const AIPlayerThreeButtonsDiv : any = document.getElementById("AIPlayerThree");
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

let AIPlayerTwo : boolean = false;
let AIPlayerThree : boolean = false;
let AIPlayerFour : boolean = false;
let isTournament : boolean;

function setGameType(text : string)
{
  if (gameisOn)
		{
			clearInterval(interval)
			canvas.classList.add("hidden");
			canvas.classList.remove("block");
			gameisOn = false;
		}
  if (text == "game")
    isTournament = false;
  else
    isTournament = true;
  setGame.classList.add("flex");
  setGame.classList.remove("hidden");
  //reset html - make sure cleaned from previous session, maybe I can do it rigth after filling my game session structure
  players = [];

  aliasPlayerOneInput.value = '';
  aliasPlayerTwoInput.value = '';
  aliasPlayerThreeInput.value = '';
  aliasPlayerFourInput.value = '';

  aliasPlayerOneInput.readOnly = false;
  aliasPlayerOneButton.disabled = false;
  aliasPlayerTwoInput.readOnly = false;
  aliasPlayerTwoButton.disabled = false;
  aliasPlayerThreeInput.readOnly = false;
  aliasPlayerThreeButton.disabled = false;
  aliasPlayerFourInput.readOnly = false;
  aliasPlayerFourButton.disabled = false;

  AIPlayerTwo = AIisOff(AIonButtonPlayerTwo, AIoffButtonPlayerTwo, aliasPlayerTwoInput);
  AIPlayerThree = AIisOff(AIonButtonPlayerThree, AIoffButtonPlayerThree, aliasPlayerThreeInput);
  AIPlayerFour = AIisOff(AIonButtonPlayerFour, AIoffButtonPlayerFour, aliasPlayerFourInput);

  AIPlayerTwoButtonsDiv.classList.remove("invisible");
  AIPlayerThreeButtonsDiv.classList.remove("invisible");
  AIPlayerFourButtonsDiv.classList.remove("invisible");

  //
  aliasPage.classList.add("flex");
  aliasPage.classList.remove("hidden");
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

//Switch on/off AI button
function AIisOn(onButton : any, offButton : any, input : any) : boolean{
  onButton.classList.add("active");
  offButton.classList.remove("active");
  input.value = "AI";
  return true;
}

function AIisOff(onButton : any, offButton : any, input : any) : boolean{
  onButton.classList.remove("active");
  offButton.classList.add("active");
  input.value = "";
  return false;
}

AIonButtonPlayerTwo.addEventListener("click", (even: any) => {
  AIPlayerTwo = AIisOn(AIonButtonPlayerTwo, AIoffButtonPlayerTwo, aliasPlayerTwoInput);
});

AIoffButtonPlayerTwo.addEventListener("click", (event : any) => {
   AIPlayerTwo = AIisOff(AIonButtonPlayerTwo, AIoffButtonPlayerTwo, aliasPlayerTwoInput);
});

AIonButtonPlayerThree.addEventListener("click", (even: any) => {
   AIPlayerThree = AIisOn(AIonButtonPlayerThree, AIoffButtonPlayerThree, aliasPlayerThreeInput);
});

AIoffButtonPlayerThree.addEventListener("click", (event : any) => {
  AIPlayerThree = AIisOff(AIonButtonPlayerThree, AIoffButtonPlayerThree, aliasPlayerThreeInput);
});

AIonButtonPlayerFour.addEventListener("click", (even: any) => {
  AIPlayerFour = AIisOn(AIonButtonPlayerFour, AIoffButtonPlayerFour, aliasPlayerFourInput);
});

AIoffButtonPlayerFour.addEventListener("click", (event : any) => {
  AIPlayerFour = AIisOff(AIonButtonPlayerFour, AIoffButtonPlayerFour, aliasPlayerFourInput);
});

//add player to the list
function checkAlias(name : string) : string
{
  if (name == "AI" || name == '')
  {
      return "";
  }

  for (let i = 0; i < players.length; i++)
  {
    if (players[i].name == name) {
      return "";
    }
  }
  return name;
}

function addPlayer(name : string, numberPlayer : number, score : number, AI : boolean)
{
  const player = new Player(name, score, AI, numberPlayer);
  players.push(player);
}

aliasPlayerOneButton.addEventListener("click", (event : any) =>
{

  aliasPlayerOneInput.value = checkAlias(aliasPlayerOneInput.value);
  if (aliasPlayerOneInput.value != '')
  {
    
    const player = new Player(aliasPlayerOneInput.value, 0, false, 1);
    players.push(player);
    aliasPlayerOneInput.readOnly = true;
    initGame();
  }
});

aliasPlayerTwoButton.addEventListener("click", (event : any) =>
{

  console.log(`player 2 ${AIPlayerTwo}`);
  console.log(`${aliasPlayerTwoInput.value}`);
  if (aliasPlayerTwoInput.value == "AI" && !AIPlayerTwo || aliasPlayerTwoInput.value == '')
  {
     aliasPlayerTwoInput.value = '';
    return;
  }
  else if (aliasPlayerTwoInput.value == '')
    return; 
  for (let i = 0; i < players.length; i++)
  {
    if (players[i].name == aliasPlayerTwoInput.value) {
      aliasPlayerTwoInput.value = '';
      return;
    }
  }
  AIPlayerTwoButtonsDiv.classList.add("invisible");
  aliasPlayerTwoInput.readOnly = true;
  aliasPlayerTwoButton.disabled = true;
  const player = new Player(aliasPlayerTwoInput.value, 0, AIPlayerTwo, 2);
  players.push(player);
  initGame();
});

aliasPlayerThreeButton.addEventListener("click", (event : any) =>
{
  console.log(`player 2 ${AIPlayerThree}`);
  console.log(`${aliasPlayerThreeInput.value}`);
  if (aliasPlayerThreeInput.value == "AI" && !AIPlayerThree)
  {
     aliasPlayerThreeInput.value = '';
    return;
  }
  else if (aliasPlayerThreeInput.value == '')
    return;
  if (aliasPlayerThreeInput.value != "AI")
  {
    for (let i = 0; i < players.length; i++)
    {
      if (players[i].name == aliasPlayerThreeInput.value) {

        aliasPlayerThreeInput.value = '';
        return;
      }
    }
  }
  AIPlayerThreeButtonsDiv.classList.add("invisible");
  aliasPlayerThreeInput.readOnly = true;
  aliasPlayerThreeButton.disabled = true;
  const player = new Player(aliasPlayerThreeInput.value, 0, AIPlayerThree, 3);
  players.push(player);
  initGame();
});

aliasPlayerFourButton.addEventListener("click", (event : any) =>
{
  console.log(`player 2 ${AIPlayerFour}`);
  console.log(`${aliasPlayerFourInput.value}`);
  if (aliasPlayerFourInput.value == "AI" && !AIPlayerFour)
  {
     aliasPlayerFourInput.value = '';
    return;
  }
  else if (aliasPlayerFourInput.value == '')
    return;
  if (aliasPlayerFourInput.value != "AI")
  {
    for (let i = 0; i < players.length; i++)
    {
      if (players[i].name == aliasPlayerFourInput.value) {
        aliasPlayerFourInput.value = '';
        return;
      }
    }
  }
  AIPlayerFourButtonsDiv.classList.add("invisible");
  aliasPlayerFourInput.readOnly = true;
  aliasPlayerFourButton.disabled = true;
  const player = new Player(aliasPlayerFourInput.value, 0, AIPlayerFour, 4);
  players.push(player);
  initGame();
});