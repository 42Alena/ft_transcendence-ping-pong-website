//HTML elements
const canva : any = document.getElementById("gameCanva");
const gameP : any = document.getElementById('gamePage');
const chatP : any = document.getElementById('chatPage');
const leadP : any = document.getElementById('leaderboardPage');
const welcP : any = document.getElementById('welcomePage');
const playerTypeButton : any = document.getElementById('playerType');
const playerModeButton : any = document.getElementById('playerMode');
const matchTypeButton : any = document.getElementById('matchType');

function display(text: string) : void
{
	console.log(`${text}`);
	if (text == "game")
	{
		chatP.style.display = "none";
		leadP.style.display = "none";
		welcP.style.display = "none";
		gameP.style.display = "flex";

	}
	else if (text == "chat")
	{
		gameP.style.display = "none";
		leadP.style.display = "none";
		welcP.style.display = "none";
		chatP.style.display = "block";
	}
	else if (text == "leaderboard")
	{
		gameP.style.display = "none";
		chatP.style.display = "none";
		welcP.style.display = "none";
		leadP.style.display = "block";
	}
}

function setSettingPlayerType(button : string)
{
	console.log(`${button}`);
	playerTypeButton.style.display = "none";
	playerModeButton.style.display = "flex";
}

function setSettingPlayerMode(button : string)
{
	console.log(`${button}`);
	playerTypeButton.style.display = "none";
	matchTypeButton.style.display = "flex";
}

function setSettingMatchType(button : string)
{
	console.log(`${button}`);
}

//Game

class Paddles {

}
// class Ball {

// }
// class Game {
// 	constructor() {};
// 	//instances
// 	playerType
// 	playerMode
// 	matchType
// }
