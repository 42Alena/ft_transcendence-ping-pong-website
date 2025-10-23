const registerPage : any = document.getElementById("registerPage");
const loginPage : any = document.getElementById("loginPage");
const profilePage : any = document.getElementById("profilePage");
const choicePage : any = document.getElementById("pageChoice");
const submitButton : any = document.getElementById("submitRegButton");
const loginButton : any = document.getElementById("submitLogingButton");
const registerForm : any = document.getElementById("register");
const loginForm : any = document.getElementById("login");
const profName : any = document.getElementById("acc-name");
const profNickname : any = document.getElementById("acc-nickname");
const profAvatar : any = document.getElementById("acc-avatar");

let userIsLoggedIn : boolean = false;

function setAccountPage(text : string)
{
	if (text == "login")
	{
		loginPage.style.display = "flex";
		choicePage.style.display = "none";
		registerPage.style.display = "none";
		profilePage.style.display = "none";

	}
	else if (text == "register")
	{
		registerPage.style.display = "flex";
		choicePage.style.display = "none";
		loginPage.style.display = "none";
		profilePage.style.display = "none";
	}
}

// /*Just to understand how it works and future implementation - disabled submission forms*/
// function setProfilePage(name : string, nickname : string, avatar : string)
// {
// 	profName.textContent = "Name: " + name;
// 	profNickname.textContent = "NickName: " + nickname;
// 	const imgElement = document.createElement("img");
//     imgElement.src = avatar;
//     profAvatar.appendChild(imgElement);
// }

// let usersList : FormData[] = [];
// let newUser : FormData = new FormData();
// newUser.append('name', 'sveva');
// newUser.append('nickname', 'sve');
// newUser.append('avatar', './images/blue.png');

// let newUser1 : FormData = new FormData();
// newUser.append('name', 'alena');
// newUser.append('nickname', 'ale');
// newUser.append('avatar', './images/green.png');

// let newUser2 : FormData = new FormData();
// newUser.append('name', 'luis');
// newUser.append('nickname', 'lui');
// newUser.append('avatar', './images/purple.png');


// registerForm.addEventListener("submit", (event : any) => {

// 	event.preventDefault()
	
// 	console.log('disable reg form submission');
// 	alert('registration was a success');
// 	setAccountPage('login');
// });

// loginForm.addEventListener("submit", (event : any) => {
// 	event.preventDefault();

// 	let loggedUser : FormData = new FormData();
// 	loggedUser.append('name', 'sveva');
// 	loggedUser.append('nickname', 'sve');
// 	loggedUser.append('avatar', './images/blue.png');
// 	console.log('disable log form submission');
// 	userIsLoggedIn = true;
// 	const nameEntry = loggedUser.get('name');
// 	const nicknameEntry = loggedUser.get('nickname');
// 	const avatarEntry = loggedUser.get('avatar');

// 	const name = nameEntry !== null ? nameEntry.toString() : '';
// 	const nickname = nicknameEntry !== null ? nicknameEntry.toString() : '';
// 	const avatar = avatarEntry !== null ? avatarEntry.toString() : '';

// 	setProfilePage(name, nickname, avatar);
// 	console.log('page is visible?');
// 	displayPage('account');
// });



