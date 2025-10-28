const registerPage : any = document.getElementById("registerPage");
const loginPage : any = document.getElementById("loginPage");
const profilePage : any = document.getElementById("profilePage");
const choicePage : any = document.getElementById("pageChoice");

const submitButton : any = document.getElementById("submitRegButton");
const loginButton : any = document.getElementById("submitLogingButton");

const registerForm : any = document.getElementById("register");
const loginForm : any = document.getElementById("login");

const regAvatar : any = document.getElementById("reg-avatar");

const profileUsername : any = document.getElementById("acc-username");
const profileDisplayName : any = document.getElementById("acc-displayName");
const profileAvatar : any = document.getElementById("acc-avatar");
const profileAvatarImg : any = document.getElementById("acc-profile-avatar");
const profileActions : any = document.getElementById("acc-actions");

const profileMenuSettings : any = document.getElementById("acc-settings");
const profileSettingsPage : any = document.getElementById("update-settings");

const profileFriendsPageButtons : any = document.getElementById("friend-buttons");

let userIsLoggedIn : boolean = false;

/*Releated to display register or login form on choice page */
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
	else if (text == "profile")
	{
		profilePage.style.display = "grid";
		choicePage.style.display = "none";
		loginPage.style.display = "none";
		registerPage.style.display = "none";
	}
}

// It makes the preview of the avatar the user wants to upload
regAvatar.addEventListener("change", (event : any) => {
	console.log('change event caught');
	const img : any = document.getElementById("avatar");
	img.src = URL.createObjectURL(regAvatar.files[0]);
});

/* Releated to profile page */

/* Implementation to choose which profile page to display: personal or other's users*/
/* Now just change the value of each element to display different profile pages
 I will implement logic after getting visibility flag for server*/
//header friend actions
profileActions.style.display = "none"; //flex for others' view
//header username
profileUsername.style.display = "flex"; //none for others' view
//settings menu + settings page
profileMenuSettings.style.display = "flex"; //none for others' view
profileSettingsPage.style.display = "flex"; //none for others' view
//friends button requests in friend page
profileFriendsPageButtons.style.display = "flex"; //none for others' view
//change avatar in header
profileAvatarImg.src = "images/profile/orange.png"; //blue.png for others' view

/*Implementation to display pages triggered by menu selection */
//divs in menu
const settingsDiv : any = document.getElementById("acc-settings");
const friendsDiv : any = document.getElementById("acc-friends");
const matchesDiv : any = document.getElementById("acc-matches");

//page
const settingsPage : any = document.getElementById("update-settings");
const friendsPage : any = document.getElementById("friends");
const matchesPage : any = document.getElementById("matches");

//event on each menu div
settingsDiv.addEventListener("click", (event : any) => {
	settingsPage.style.display = "flex";
	friendsPage.style.display = "none";
	matchesPage.style.display = "none";
});

friendsDiv.addEventListener("click", (event : any) => {
	friendsPage.style.display = "grid";
	settingsPage.style.display = "none";
	matchesPage.style.display = "none";
});

matchesDiv.addEventListener("click", (event : any) => {
	matchesPage.style.display = "flex";
	settingsPage.style.display = "none";
	friendsPage.style.display = "none";
});