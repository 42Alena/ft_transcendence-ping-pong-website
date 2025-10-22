const registerPage : any = document.getElementById("registerPage");
const loginPage : any = document.getElementById("loginPage");
const profilePage : any = document.getElementById("profilePage");
const choicePage : any = document.getElementById("pageChoice");
const submitButton : any = document.getElementById("submitRegButton");
const loginButton : any = document.getElementById("submitLogingButton");
const registerForm : any = document.getElementById("register");
const loginForm : any = document.getElementById("login");

function setProfilePage(text : string)
{
	if (text == "login")
	{
		loginPage.style.display = "flex";
		choicePage.style.display = "none";
		registerPage.style.display = "none";
		profilePage.style.display = "none";

	}
	else if (text = "register")
	{
		registerPage.style.display = "flex";
		choicePage.style.display = "none";
		loginPage.style.display = "none";
		profilePage.style.display = "none";
	}
	else
	{
		profilePage.style.display = "flex";
		choicePage.style.display = "none";
		loginPage.style.display = "none";
		registerPage.style.display = "none";
	}
}

function displayProfile(user : FormData)
{
	profilePage.style.display = "flex";
	choicePage.style.display = "none";
	loginPage.style.display = "none";
	registerPage.style.display = "none";
}

/*Just to understand how it works - not working to go back to the "choice page"
flow: choice Page: if register, after submitting should take you to profile page?
if login it takes you to profile page
implement logic of logged user*/

// let usersList : FormData[] = [];

// submitButton.addEventListener("click", (event : any) => {

// 	event.preventDefault()
// 	if (registerForm == null)
// 			console.log("no form");
// 	else
// 	{
// 	let newUser : FormData = new FormData(registerForm);

// 	usersList.push(newUser);
//  	displayProfile(newUser);
// 	registerForm.reset();
// 	}
// });

// loginButton.addEventListener("click", (event : any) => {

// 	event.preventDefault()
// 	let incomingUser : FormData = new FormData(loginForm);
// 	for(const users of usersList) {
// 		if (users.get('name') === incomingUser.get('name'))
// 		{
// 			alert(`${users.get('name')}`);
// 			displayProfile(users);
// 			break;
// 		}
// 	}
// 	loginForm.reset();
// });


