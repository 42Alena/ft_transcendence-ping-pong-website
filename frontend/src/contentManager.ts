const chatP : any = document.getElementById('chatPage');
const welcP : any = document.getElementById('welcomePage');
const accP : any = document.getElementById('accountPage');

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
	}
	else if(text == 'welcome')
	{
		welcP.classList.add("flex");
		welcP.classList.remove("hidden");
		chatP.classList.remove("grid");
		chatP.classList.add("hidden");
		accP.classList.add("hidden");
		accP.classList.remove("flex");
	}
}