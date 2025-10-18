const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');

function displayPage(text: string) : void
{
	if (text == 'chat')
	{
		chatP.style.display = "grid";
		welcP.style.display = "none";
	}
	else if(text == 'welcome')
	{
		welcP.style.display = "flex";
		chatP.style.display = "none";
	}

}