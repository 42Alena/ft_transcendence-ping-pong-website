const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');
const accP : any = document.getElementById('accountPage');
const gameP : any = document.getElementById('gamePage');



function displayPage(text: string) : void
{
	console.log(`${text}`);
	if (text == 'chat')
	{
		chatP.classList.add("grid");
		chatP.classList.remove("hidden");
		welcP.classList.add("hidden");
		welcP.classList.remove("flex");
		accP.classList.add("hidden");
		accP.classList.remove("flex");
		gameP.style.display = "none";
		setGame.style.display = "none";
		playersNum.style.display = "none";
		alias.style.display = "none";
		gameOverDiv.style.display = "none";
		instruction.style.display = "none";
		if (gameisOn)
		{
			clearInterval(interval)
			canvas.style.display = "none";
			gameisOn = false;
		}
		profP.style.display = "none";
	}
	else if(text == 'welcome')
	{
		welcP.classList.add("flex");
		welcP.classList.remove("hidden");
		chatP.classList.remove("grid");
		chatP.classList.add("hidden");
		accP.classList.add("hidden");
		accP.classList.remove("flex");
		gameP.style.display = "none";
		setGame.style.display = "none";
		playersNum.style.display = "none";
		alias.style.display = "none";
		gameOverDiv.style.display = "none";
		instruction.style.display = "none";
		if (gameisOn)
		{
			clearInterval(interval);
			canvas.style.display = "none";
			gameisOn = false;
		}
		profP.style.display = "none";
	}
	else if (text == 'game')
	{
		gameP.style.display = "flex";
		setGame.style.display = "block";
		playersNum.style.display = "flex";
		alias.style.display = "none";
		gameOverDiv.style.display = "none";
		instruction.style.display = "none";

		if (gameisOn)
		{
			clearInterval(interval);
			canvas.style.display = "none";
			gameisOn = false;
		}
		welcP.style.display = "none";
		chatP.style.display = "none";
		accP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
		profP.style.display = "none";
	}
}