const setGame: any = document.getElementById("setUpGame");
const aliasPage: any = document.getElementById("setUpPlayers");
const aliasPlayerThreeDiv: any = document.getElementById("aliasPlayerThree");
const aliasPlayerFourDiv: any = document.getElementById("aliasPlayerFour");
const aliasPlayerOneInput: any = document.getElementById("namePlayerOne");
const aliasPlayerTwoInput: any = document.getElementById("namePlayerTwo");
const aliasPlayerThreeInput: any = document.getElementById("namePlayerThree");
const aliasPlayerFourInput: any = document.getElementById("namePlayerFour");
const AIPlayerOneButtonsDiv: any = document.getElementById("AIPlayerOne");
const AIPlayerTwoButtonsDiv: any = document.getElementById("AIPlayerTwo");
const AIPlayerThreeButtonsDiv: any = document.getElementById("AIPlayerThree");
const AIPlayerFourButtonsDiv: any = document.getElementById("AIPlayerFour");
const aliasPlayerOneButton: any = document.getElementById("okPlayerOne");
const aliasPlayerTwoButton: any = document.getElementById("okPlayerTwo");
const aliasPlayerThreeButton: any = document.getElementById("okPlayerThree");
const aliasPlayerFourButton: any = document.getElementById("okPlayerFour");
const AIonButtonPlayerOne: any = document.getElementById("AIonPlayerOne");
const AIonButtonPlayerTwo: any = document.getElementById("AIonPlayerTwo");
const AIonButtonPlayerThree: any = document.getElementById("AIonPlayerThree");
const AIonButtonPlayerFour: any = document.getElementById("AIonPlayerFour");
const AIoffButtonPlayerOne: any = document.getElementById("AIoffPlayerOne");
const AIoffButtonPlayerTwo: any = document.getElementById("AIoffPlayerTwo");
const AIoffButtonPlayerThree: any = document.getElementById("AIoffPlayerThree");
const AIoffButtonPlayerFour: any = document.getElementById("AIoffPlayerFour");

let AIPlayerTwo: boolean = false;
let AIPlayerThree: boolean = false;
let AIPlayerFour: boolean = false;
let isTournament: boolean = false;

let players: Player[] = [];

class Player {
  name: string;
  isAI: boolean;
  playerNum: number;

  constructor(name: string, AI: boolean, num: number) {
    this.name = name;
    this.isAI = AI;
    this.playerNum = num;
  }
}

//clean up page for choosing alias - making sure nothing left from previous session
function setGameType(text: string) {
  isTournament = false;
  if (gameisOn) {
    clearInterval(interval);
    gameScreenDiv.classList.add("hidden");
    gameScreenDiv.classList.remove("flex");
    canvas.classList.add("hidden");
    canvas.classList.remove("block");
    gameisOn = false;
  }
  if (text == "tournament") isTournament = true;
  setGame.classList.add("flex");
  setGame.classList.remove("hidden");
  players = [];
  matchPlayed = 0;
  lastGameTournament = [];
  gameisOn = false;
  gameQueue = [];
  aliasPlayerOneInput.value = "";
  aliasPlayerTwoInput.value = "";
  aliasPlayerThreeInput.value = "";
  aliasPlayerFourInput.value = "";

  aliasPlayerOneInput.readOnly = false;
  aliasPlayerTwoInput.readOnly = false;
  aliasPlayerThreeInput.readOnly = false;
  aliasPlayerFourInput.readOnly = false;

  AIPlayerTwo = AIisOff(
    AIonButtonPlayerTwo,
    AIoffButtonPlayerTwo,
    aliasPlayerTwoInput,
  );
  AIPlayerThree = AIisOff(
    AIonButtonPlayerThree,
    AIoffButtonPlayerThree,
    aliasPlayerThreeInput,
  );
  AIPlayerFour = AIisOff(
    AIonButtonPlayerFour,
    AIoffButtonPlayerFour,
    aliasPlayerFourInput,
  );

  AIPlayerTwoButtonsDiv.classList.remove("invisible");
  AIPlayerThreeButtonsDiv.classList.remove("invisible");
  AIPlayerFourButtonsDiv.classList.remove("invisible");

  aliasPage.classList.add("flex");
  aliasPage.classList.remove("hidden");
  aliasSelection();
  gameOverDiv.classList.add("hidden");
  gameOverDiv.classList.remove("flex");
  instruction.classList.add("hidden");
  instruction.classList.remove("flex");
}

//set page for 2 players or 4 players (tournament)
function aliasSelection() {
  if (isTournament == false) {
    aliasPlayerThreeDiv.classList.add("hidden");
    aliasPlayerThreeDiv.classList.remove("block");
    aliasPlayerFourDiv.classList.add("hidden");
    aliasPlayerFourDiv.classList.remove("block");
  } else {
    aliasPlayerThreeDiv.classList.add("block");
    aliasPlayerThreeDiv.classList.remove("hidden");
    aliasPlayerFourDiv.classList.add("block");
    aliasPlayerFourDiv.classList.remove("hidden");
  }
}

//check/add player to the list
function checkAIinName(name : string) : boolean
{
  const lowerName = name.toLowerCase();
  if (name.includes('ai'))
    return true;
  return false;
}

function checkAlias(name: string, AIFlag: boolean): string {
  if (checkAIinName(name) && !AIFlag) return "";
  else if (name == "") return "";
  else if (name == "AI") return "Ai";
  for (let i = 0; i < players.length; i++) {
    if (players[i].name == name) {
      return "";
    }
  }
  return name;
}

function addPlayer(name: string, AI: boolean, index: number) {
  const player = new Player(name, AI, index);
  players.push(player);
}

function processInput(
  input: any,
  index: number,
  AIbuttonsDiv: any,
  AIFlag: boolean,
): boolean {
  const name = checkAlias(input.value, AIFlag);
  if (name) {
    addPlayer(name, AIFlag, index);
    input.readOnly = true;
    AIbuttonsDiv.classList.add("invisible");
    //add green text + check
    return true;
  }
  input.value = "";
  return false;
}

//Switch on/off AI button
function AIisOn(onButton: any, offButton: any, input: any): boolean {
  onButton.classList.add("active");
  offButton.classList.remove("active");
  input.value = "AI";
  input.readOnly = true;
  return true;
}

function AIisOff(onButton: any, offButton: any, input: any): boolean {
  onButton.classList.remove("active");
  offButton.classList.add("active");
  input.value = "";
  input.readOnly = false;
  return false;
}

//buttons on/off
AIonButtonPlayerTwo.addEventListener("click", (even: any) => {
  AIPlayerTwo = AIisOn(
    AIonButtonPlayerTwo,
    AIoffButtonPlayerTwo,
    aliasPlayerTwoInput,
  );
});

AIoffButtonPlayerTwo.addEventListener("click", (event: any) => {
  AIPlayerTwo = AIisOff(
    AIonButtonPlayerTwo,
    AIoffButtonPlayerTwo,
    aliasPlayerTwoInput,
  );
});

AIonButtonPlayerThree.addEventListener("click", (even: any) => {
  AIPlayerThree = AIisOn(
    AIonButtonPlayerThree,
    AIoffButtonPlayerThree,
    aliasPlayerThreeInput,
  );
});

AIoffButtonPlayerThree.addEventListener("click", (event: any) => {
  AIPlayerThree = AIisOff(
    AIonButtonPlayerThree,
    AIoffButtonPlayerThree,
    aliasPlayerThreeInput,
  );
});

AIonButtonPlayerFour.addEventListener("click", (even: any) => {
  AIPlayerFour = AIisOn(
    AIonButtonPlayerFour,
    AIoffButtonPlayerFour,
    aliasPlayerFourInput,
  );
});

AIoffButtonPlayerFour.addEventListener("click", (event: any) => {
  AIPlayerFour = AIisOff(
    AIonButtonPlayerFour,
    AIoffButtonPlayerFour,
    aliasPlayerFourInput,
  );
});

//buttons
//process input and check if we can start the game
aliasPlayerOneButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerOneInput,
    1,
    AIPlayerOneButtonsDiv,
    false,
  );
  if (startGame == true) showPageBeforeGame();
});

aliasPlayerTwoButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerTwoInput,
    2,
    AIPlayerTwoButtonsDiv,
    AIPlayerTwo,
  );
  if (startGame == true) showPageBeforeGame();
});

aliasPlayerThreeButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerThreeInput,
    3,
    AIPlayerThreeButtonsDiv,
    AIPlayerThree,
  );
  if (startGame == true) showPageBeforeGame();
});

aliasPlayerFourButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerFourInput,
    4,
    AIPlayerFourButtonsDiv,
    AIPlayerFour,
  );
  if (startGame == true) showPageBeforeGame();
});
