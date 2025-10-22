const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');
const accP : any = document.getElementById('accountPage');
const regP : any = document.getElementById('registerPage');
const logP: any = document.getElementById('loginPage');

function displayPage(text: string) : void
{
	if (text == 'chat')
	{
		chatP.style.display = "grid";
		welcP.style.display = "none";
		accP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
	}
	else if(text == 'welcome')
	{
		welcP.style.display = "flex";
		chatP.style.display = "none";
		accP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
	}
	else if (text == 'account')
	{
		console.log("account page to show now");
		accP.style.display = "flex";
		chatP.style.display = "none";
		welcP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
	}

}