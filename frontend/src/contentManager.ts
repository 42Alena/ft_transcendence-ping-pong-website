const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');
const accP : any = document.getElementById('accountPage');
const regP : any = document.getElementById('registerPage');
const logP: any = document.getElementById('loginPage');
const profP : any = document.getElementById('profilePage');



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
		accP.style.display = "flex";
		/*choice page and profile page momenterely are set here
		 so each time you click on the profile avatar you check to choose page*/
		choicePage.style.display = "flex";
		profP.style.display = "none"
		chatP.style.display = "none";
		welcP.style.display = "none";
		regP.style.display = "none";
		logP.style.display = "none";
	}
}