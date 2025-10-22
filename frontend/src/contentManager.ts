const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');
const accP : any = document.getElementById('account');

function displayPage(text: string) : void
{
	if (text == 'chat')
	{
		chatP.style.display = "grid";
		welcP.style.display = "none";
		accP.style.display = "none";
	}
	else if(text == 'welcome')
	{
		welcP.style.display = "flex";
		chatP.style.display = "none";
		accP.style.display = "none";
	}
	else if (text == 'profile')
	{
		accP.style.display = "flex";
		chatP.style.display = "none";
		welcP.style.display = "none";
	}

}