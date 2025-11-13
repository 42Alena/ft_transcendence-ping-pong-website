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
		gameP.classList.add("hidden");
		gameP.classList.remove("flex");
		setGame.classList.add("hidden");
		setGame.classList.remove("block");
		playersNum.classList.add("hidden");
		playersNum.classList.remove("flex");
		alias.classList.add("hidden");
		alias.classList.remove("flex");
		gameOverDiv.classList.add("hidden");
		gameOverDiv.classList.remove("flex");
		instruction.classList.add("hidden");
  		instruction.classList.remove("block");
		if (gameisOn)
		{
			clearInterval(interval)
			canvas.classList.add("hidden");
			canvas.classList.remove("block");
			gameisOn = false;
		}
	}
	else if(text == 'welcome')
	{
		welcP.classList.add("flex");
		welcP.classList.remove("hidden");
		chatP.classList.remove("grid");
		chatP.classList.add("hidden");
		accP.classList.add("hidden");
		accP.classList.remove("flex");
		gameP.classList.add("hidden");
		gameP.classList.remove("flex");
		setGame.classList.add("hidden");
		setGame.classList.remove("block");
		playersNum.classList.add("hidden");
		playersNum.classList.remove("flex");
		alias.classList.add("hidden");
		alias.classList.remove("flex");
		gameOverDiv.classList.add("hidden");
		gameOverDiv.classList.remove("flex");
		instruction.classList.add("hidden");
  		instruction.classList.remove("block");
		if (gameisOn)
		{
			clearInterval(interval)
			canvas.classList.add("hidden");
			canvas.classList.remove("block");
			gameisOn = false;
		}
	}
	else if (text == 'game')
	{
		gameP.classList.add("flex");
		gameP.classList.remove("hidden");
		setGame.classList.add("block");
		setGame.classList.remove("hidden");
		playersNum.classList.add("flex");
		playersNum.classList.remove("hidden");
		alias.classList.add("hidden");
		alias.classList.remove("flex");
		gameOverDiv.classList.add("hidden");
		gameOverDiv.classList.remove("flex");
		instruction.classList.add("hidden");
  		instruction.classList.remove("block");
		if (gameisOn)
		{
			clearInterval(interval);
			canvas.classList.add("hidden");
			canvas.classList.remove("block");
			gameisOn = false;
		}
		welcP.classList.add("hidden");
		welcP.classList.remove("flex");
		chatP.classList.remove("grid");
		chatP.classList.add("hidden");
		accP.classList.add("hidden");
		accP.classList.remove("flex");
	}
}