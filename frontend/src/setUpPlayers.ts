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

const imgElement : any = document.querySelector('#gamePage img');

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

  aliasPlayerOneInput.classList.remove("placeholder-green-300", "border", "border-green-400");
  aliasPlayerTwoInput.classList.remove("placeholder-green-300", "border", "border-green-400");
  aliasPlayerThreeInput.classList.remove("placeholder-green-300", "border", "border-green-400");
  aliasPlayerFourInput.classList.remove("placeholder-green-300", "border", "border-green-400");
  aliasPlayerOneInput.classList.remove("placeholder-red-300", "border", "border-red-400");
  aliasPlayerTwoInput.classList.remove("placeholder-red-300", "border", "border-red-400");
  aliasPlayerThreeInput.classList.remove("placeholder-red-300", "border", "border-red-400");
  aliasPlayerFourInput.classList.remove("placeholder-red-300", "border", "border-red-400");

  aliasPlayerOneButton.disabled = false;
  aliasPlayerTwoButton.disabled = false;
  aliasPlayerThreeButton.disabled = false;
  aliasPlayerFourButton.disabled = false;

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
  const playerInputOne = document.getElementById("player-one") as HTMLInputElement;
  const playerInputThree = document.getElementById("playerThree") as HTMLDivElement;
    const playerInputFour = document.getElementById("playerFour") as HTMLDivElement;
  if (isTournament == false) {
    imgElement.src = "images/pages_images/pong_game_new.png"
    // playerInputThree.classList.add("hidden");
    playerInputThree.classList.add("invisible");
    playerInputFour.classList.add("invisible");
  if (localStorage.getItem("userData")) {
  const userDataString: string | null = localStorage.getItem("userData");
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    playerInputOne.value = userData.displayName;
    playerInputOne.classList.add("disable");
  }
}
    // aliasPlayerFourDiv.classList.remove("block");
  } else {
    imgElement.src = "images/pages_images/pong_tournament_new.png"
     playerInputThree.classList.remove("invisible");
    playerInputFour.classList.remove("invisible");
    // aliasPlayerThreeDiv.classList.add("block");
    // aliasPlayerThreeDiv.classList.remove("hidden");
    // aliasPlayerFourDiv.classList.add("block");
    // aliasPlayerFourDiv.classList.remove("hidden");
  }
}

//check/add player to the list

function checkAlias(name: string, AIFlag: boolean): string {
  if (name == "") return "";
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
const errorMessage : any = document.getElementById("validationMsg");
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
    input.classList.remove("placeholder-red-300", "border", "border-red-400");
    input.classList.add("placeholder-green-300", "border", "border-green-400");
    // errorMessage.classList.remove("flex");
    // errorMessage.classList.add("hidden");
    //add green text + check
    return true;
  }
  // errorMessage.classList.add("flex");
  // errorMessage.classList.remove("hidden");
  input.value = "";
  input.classList.add("placeholder-red-300", "border", "border-red-400");
  return false;
}

//Switch on/off AI button
function AIisOn(onButton: any, offButton: any, input: any, numb : string): boolean {
  onButton.classList.add("active");
  offButton.classList.remove("active");
  input.value = "AI_" + numb;
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
    "ALENA",
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
    "SVEVA",
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
    "LUIS",
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
  console.log("button ok pressed");
  const startGame = processInput(
    aliasPlayerOneInput,
    1,
    AIPlayerOneButtonsDiv,
    false,
  );
  if (startGame == true)
  {
      aliasPlayerOneButton.disabled = true;
      showPageBeforeGame();
  }
});

aliasPlayerTwoButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerTwoInput,
    2,
    AIPlayerTwoButtonsDiv,
    AIPlayerTwo,
  );
  if (startGame == true){
    aliasPlayerTwoButton.disabled = true;
    showPageBeforeGame();
  }
});

aliasPlayerThreeButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerThreeInput,
    3,
    AIPlayerThreeButtonsDiv,
    AIPlayerThree,
  );
  if (startGame == true) {
    aliasPlayerThreeButton.disabled = true;
    showPageBeforeGame();
  }
});

aliasPlayerFourButton.addEventListener("click", () => {
  const startGame = processInput(
    aliasPlayerFourInput,
    4,
    AIPlayerFourButtonsDiv,
    AIPlayerFour,
  );
  if (startGame == true) {
     aliasPlayerFourButton.disabled = true;
     showPageBeforeGame();
  }
});

const playersNameForm = document.getElementById("playersName") as HTMLFormElement;
const errorNamesDiv = document.getElementById("playersName_error") as HTMLDivElement;

playersNameForm.addEventListener("submit", async (event : SubmitEvent) => {
  event.preventDefault();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(playersNameForm);
  const playersNames = {
    player1Alias: formData.get("player-one_name"),
    player2Alias: formData.get("player-two_name"),
    player3Alias: formData.get("player-three_name"),
    player4Alias: formData.get("player-four_name"),
  };
  let url;
  if (!isTournament)
    url = "http://127.0.0.1:3000/games/match/aliases/check";
  else
    url = "http://127.0.0.1:3000/games/tournament/aliases/check";
  const myRequest = new Request(url, {
    method: "POST",
    body: JSON.stringify(playersNames),
    headers: myHeaders,
    credentials : "include"
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    console.log(response.json);
    const data = await response.json();
    if (!response.ok) {
        errorNamesDiv.classList.add("block");
        errorNamesDiv.classList.remove("invisible");
        errorNamesDiv.textContent = data.error;
        playersNameForm.reset();
      throw new Error(`Response status ${response.status}`);
    } else {
        errorNamesDiv.classList.add("invisible");
        errorNamesDiv.classList.remove("block");
      playersNameForm.reset();
      console.log("check alias user:", data);
    }
  } catch (error: any) {
    console.error("Error during registration:", error.message);
  }
});

