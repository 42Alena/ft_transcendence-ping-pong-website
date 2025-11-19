class Player {
    name: string;
    isAI : boolean;
    playerNum : number;

    constructor(name : string, AI : boolean, num : number)
    {
      this.name = name;
      this.isAI = AI;
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
let isTournament : boolean = false;

function setGameType(text : string)
{
  isTournament = false;
  if (gameisOn)
		{
      console.log(`${gameisOn} - clean up screen`);
			clearInterval(interval)
      gameScreenDiv.classList.add("hidden");
			gameScreenDiv.classList.remove("flex");
			canvas.classList.add("hidden");
			canvas.classList.remove("block");
			gameisOn = false;
		}
  if (text == "tournament")
    isTournament = true;
  setGame.classList.add("flex");
  setGame.classList.remove("hidden");
  //reset html - make sure cleaned from previous session, maybe I can do it rigth after filling my game session structure
  players = [];
  matchPlayed = 0;
  lastGameTournament = [];
  gameisOn = false;
  gameQueue = [];
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
  instruction.classList.remove("flex");
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
  console.log("is on AI");
  console.log(`flag before ${AIPlayerTwo}`);
  AIPlayerTwo = AIisOn(AIonButtonPlayerTwo, AIoffButtonPlayerTwo, aliasPlayerTwoInput);
  console.log(`flag after ${AIPlayerTwo}`);
});

AIoffButtonPlayerTwo.addEventListener("click", (event : any) => {
  console.log("is off AI");
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

//check/add player to the list
function checkAlias(name : string, AIFlag : boolean) : string
{
  console.log(`check alias name: ${name}`)
  console.log(`check alias AI: ${AIFlag}`)
  if (name == "AI" && !AIFlag)
      return "";
  else if (name == '')
    return "";
  else if (name == "AI")
    return "Ai";
  for (let i = 0; i < players.length; i++)
  {
    if (players[i].name == name) {
      return "";
    }
  }
  return name;
}

function addPlayer(name : string, AI : boolean, index : number)
{
  const player = new Player(name, AI, index);
  players.push(player);
}

function processInput(input : any, index : number, AIbuttonsDiv : any, AIFlag : boolean) : boolean
{
  console.log("process input");
  const name = checkAlias(input.value, AIFlag);
  if (name)
  {
    console.log(`check alias AI before adding to player: ${AIFlag}`)
    addPlayer(name, AIFlag, index);
    console.log(`check alias AI after adding to player: ${AIFlag}`)
    
    input.readOnly = true;
    AIbuttonsDiv.classList.add("invisible");
    //add green text + check
    return true;
  }
  input.value = '';
  return false;
}

aliasPlayerOneButton.addEventListener("click", () =>
{
  const startGame = processInput(aliasPlayerOneInput, 1, AIPlayerOneButtonsDiv, false);
  if (startGame == true)
      showPageBeforeGame();
});

aliasPlayerTwoButton.addEventListener("click", () =>
{
  const startGame = processInput(aliasPlayerTwoInput, 2, AIPlayerTwoButtonsDiv, AIPlayerTwo);
  if (startGame == true)
      showPageBeforeGame();
});

aliasPlayerThreeButton.addEventListener("click", () =>
{
  const startGame = processInput(aliasPlayerThreeInput, 3, AIPlayerThreeButtonsDiv, AIPlayerThree);
  if (startGame == true)
      showPageBeforeGame();
});

aliasPlayerFourButton.addEventListener("click", () =>
{
  const startGame = processInput(aliasPlayerFourInput, 4, AIPlayerFourButtonsDiv, AIPlayerFour);
  if (startGame == true)
      showPageBeforeGame();
});
