const setGame: any = document.getElementById("setUpGame");
const aliasPage: any = document.getElementById("setUpPlayers");

let AIPlayerOne : boolean = false;
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
    imgElement.src = "images/pages_images/pong_game_new.png"
    playerInputThree.classList.remove("block");
    playerInputFour.classList.remove("block");
    playerInputThree.classList.add("hidden");
    playerInputFour.classList.add("hidden");
  } else {
    imgElement.src = "images/pages_images/pong_tournament_new.png"
    playerInputThree.classList.remove("hidden");
    playerInputFour.classList.remove("hidden");
    playerInputThree.classList.add("block");
    playerInputFour.classList.add("block");
  }
}

function addPlayer(name: string, AI: boolean, index: number) {
  const player = new Player(name, AI, index);
  players.push(player);
}

const playersNameForm = document.getElementById("playersName") as HTMLFormElement;
const errorNamesDiv = document.getElementById("playersName_error") as HTMLDivElement;

playersNameForm.addEventListener("submit", async (event : SubmitEvent) => {
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
  if (!isTournament)
    url = `${BACKEND_URL}/games/match/aliases/check`;
  else
    url = `${BACKEND_URL}/games/tournament/aliases/check`;
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
        errorNamesDiv.classList.remove("invisible");
        errorNamesDiv.textContent = data.error;
      throw new Error(`Response status ${response.status}`);
    } else {
      errorNamesDiv.classList.add("invisible");
      let i = 0;
      for (const key in data) {
            let AI : boolean = false;
            const value = data[key];
            if (value == "AI_ALENA" || value == "AI_SVEVA" || value == "AI_LUIS")
            {
              AI = true;
            }
            addPlayer(value, AI, i);
            i++;
        }
      playersNameForm.reset()
      showPageBeforeGame();
      console.log("check alias user:", data);
    }
  } catch (error: any) {
    console.error("Error during check alias:", error.message);
  }
});

