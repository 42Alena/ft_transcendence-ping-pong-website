const setGame: any = document.getElementById("setUpGame");
const aliasPage: any = document.getElementById("setUpPlayers");

let AIPlayerOne: boolean = false;
let AIPlayerTwo: boolean = false;
let AIPlayerThree: boolean = false;
let AIPlayerFour: boolean = false;
let isTournament: boolean = false;

const imgElement: any = document.querySelector("#gamePage img");

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

  AIPlayerTwo = AIisOff(
    AIonButtonPlayerTwo,
    AIoffButtonPlayerTwo,
    playerInputTwo,
  );
  AIPlayerThree = AIisOff(
    AIonButtonPlayerThree,
    AIoffButtonPlayerThree,
    playerInputThree,
  );
  AIPlayerFour = AIisOff(
    AIonButtonPlayerFour,
    AIoffButtonPlayerFour,
    playerInputFour,
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

const playerInputOne = document.getElementById(
    "player-one",
  ) as HTMLInputElement;
  const playerInputTwo = document.getElementById(
    "player-two",
  ) as HTMLInputElement;
  const playerInputThree = document.getElementById(
    "player-three",
  ) as HTMLInputElement;
  const playerInputFour = document.getElementById(
    "player-four",
  ) as HTMLInputElement;
  const playerInputThreeDiv = document.getElementById(
    "playerThree",
  ) as HTMLDivElement;
  const playerInputFourDiv = document.getElementById(
    "playerFour",
  ) as HTMLDivElement;
//set page for 2 players or 4 players (tournament)
function aliasSelection() {
  playerInputOne.readOnly = false;
  if (localStorage.getItem("userData")) {
    const userDataString: string | null = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log(userData.displayName);
      playerInputOne.value = userData.displayName;
      playerInputOne.readOnly = true;
    }
  }
  if (isTournament == false) {
    imgElement.src = "images/pages_images/pong_game_new.png";
    playerInputThreeDiv.classList.remove("block");
    playerInputFourDiv.classList.remove("block");
    playerInputThreeDiv.classList.add("hidden");
    playerInputFourDiv.classList.add("hidden");
  } else {
    imgElement.src = "images/pages_images/pong_tournament_new.png";
    playerInputThreeDiv.classList.remove("hidden");
    playerInputFourDiv.classList.remove("hidden");
    playerInputThreeDiv.classList.add("block");
    playerInputFourDiv.classList.add("block");
  }
}

function addPlayer(name: string, AI: boolean, index: number) {
  const player = new Player(name, AI, index);
  players.push(player);
}

const playersNameForm = document.getElementById(
  "playersName",
) as HTMLFormElement;
const errorNamesDiv = document.getElementById(
  "playersName_error",
) as HTMLDivElement;

playersNameForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  errorNamesDiv.classList.add("invisible");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(playersNameForm);
  const playersNames = {
    player1Alias: formData.get("player-one_name") as string,
    player2Alias: formData.get("player-two_name") as string,
    player3Alias: formData.get("player-three_name") as string,
    player4Alias: formData.get("player-four_name") as string,
  };
  let url;
  if (!isTournament) url = `${BACKEND_URL}/games/match/aliases/check`;
  else url = `${BACKEND_URL}/games/tournament/aliases/check`;
  const myRequest = new Request(url, {
    method: "POST",
    body: JSON.stringify(playersNames),
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    console.log(response.json);
    const data = await response.json();
    if (!response.ok) {
      errorNamesDiv.classList.remove("invisible");
      errorNamesDiv.textContent = data.error;
      throw new Error(`Response status ${response.status}`);
    } else {
      errorNamesDiv.classList.add("invisible");
      let i = 0;
      for (const key in data) {
        let AI: boolean = false;
        if (key != "ok")
        {
          const value = data[key];
          if (value == "AI_ALENA" || value == "AI_SVEVA" || value == "AI_LUIS") {
            AI = true;
          }
          addPlayer(value, AI, i);
      }
        i++;
      }
      playersNameForm.reset();
      showPageBeforeGame();
      console.log("check alias user:", data);
    }
  } catch (error: any) {
    console.error("Error during check alias:", error.message);
  }
});

const AIPlayerOneButtonsDiv: any = document.getElementById("AIPlayerOne");
const AIPlayerTwoButtonsDiv: any = document.getElementById("AIPlayerTwo");
const AIPlayerThreeButtonsDiv: any = document.getElementById("AIPlayerThree");
const AIPlayerFourButtonsDiv: any = document.getElementById("AIPlayerFour");
const AIonButtonPlayerOne: any = document.getElementById("AIonPlayerOne");
const AIonButtonPlayerTwo: any = document.getElementById("AIonPlayerTwo");
const AIonButtonPlayerThree: any = document.getElementById("AIonPlayerThree");
const AIonButtonPlayerFour: any = document.getElementById("AIonPlayerFour");
const AIoffButtonPlayerOne: any = document.getElementById("AIoffPlayerOne");
const AIoffButtonPlayerTwo: any = document.getElementById("AIoffPlayerTwo");
const AIoffButtonPlayerThree: any = document.getElementById("AIoffPlayerThree");
const AIoffButtonPlayerFour: any = document.getElementById("AIoffPlayerFour");

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
AIonButtonPlayerTwo.addEventListener("click", (event: any) => {
  event.preventDefault();
  AIPlayerTwo = AIisOn(
    AIonButtonPlayerTwo,
    AIoffButtonPlayerTwo,
    playerInputTwo,
    "ALENA",
  );
});

AIoffButtonPlayerTwo.addEventListener("click", (event: any) => {
  event.preventDefault();
  AIPlayerTwo = AIisOff(
    AIonButtonPlayerTwo,
    AIoffButtonPlayerTwo,
    playerInputTwo,
  );
});

AIonButtonPlayerThree.addEventListener("click", (event: any) => {
  event.preventDefault();
  AIPlayerThree = AIisOn(
    AIonButtonPlayerThree,
    AIoffButtonPlayerThree,
    playerInputThree,
    "SVEVA",
  );
});

AIoffButtonPlayerThree.addEventListener("click", (event: any) => {
  event.preventDefault();
  AIPlayerThree = AIisOff(
    AIonButtonPlayerThree,
    AIoffButtonPlayerThree,
    playerInputThree,
  );
});

AIonButtonPlayerFour.addEventListener("click", (event: any) => {
  event.preventDefault();
  AIPlayerFour = AIisOn(
    AIonButtonPlayerFour,
    AIoffButtonPlayerFour,
    playerInputFour,
    "LUIS",
  );
});

AIoffButtonPlayerFour.addEventListener("click", (event: any) => {
  event.preventDefault();
  AIPlayerFour = AIisOff(
    AIonButtonPlayerFour,
    AIoffButtonPlayerFour,
    playerInputFour,
  );
});