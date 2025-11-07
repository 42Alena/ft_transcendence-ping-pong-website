const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');
const accP : any = document.getElementById('accountPage');
const regP : any = document.getElementById('registerPage');
const logP: any = document.getElementById('loginPage');
const profP : any = document.getElementById('profilePage');
const gameP : any = document.getElementById('gamePage');



function displayPage(text: string) : void
{
	if (text == 'chat')
	{
		chatP.style.display = "grid";
		welcP.style.display = "none";
		accP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
		gameP.style.display = "none";
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
		welcP.style.display = "flex";
		chatP.style.display = "none";
		accP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
		gameP.style.display = "none";
		if (gameisOn)
		{
			clearInterval(interval);
			canvas.style.display = "none";
			gameisOn = false;
		}
		profP.style.display = "none";
	}
	else if (text == 'account')
	{
		accP.style.display = "flex";
		profP.style.display = "none";
		chatP.style.display = "none";
		welcP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
		gameP.style.display = "none";
		if (gameisOn)
		{
			clearInterval(interval);
			canvas.style.display = "none";
			gameisOn = false;
		}
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