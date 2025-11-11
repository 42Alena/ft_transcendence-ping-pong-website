//pages

const regP : any = document.getElementById('registerPage');
const logP: any = document.getElementById('loginPage');
const profP : any = document.getElementById('profilePage');
//register form
const registerForm : any = document.getElementById("register");
const regAvatar : any = document.getElementById("reg-avatar");
//profile page
const profileUsername : any = document.getElementById("acc-username");
const profileAvatarImg : any = document.getElementById("acc-profile-avatar");
const profileActions : any = document.getElementById("acc-actions"); //buttons
//buttons
const profileAddRemFriend : any = document.getElementById("add-remove-friend__header");
const profileBlockUnbFriend : any = document.getElementById("block-unblock-friend__header");
//settings page
const profileMenuSettings : any = document.getElementById("acc-settings");
const profileSettingsPage : any = document.getElementById("update-settings");
const tempdisplayN : any = document.getElementById("temp-displayname");

//events on profile button
let isFriend = false;
let isBlocked = true;

profileAddRemFriend.addEventListener("click", (event : any) => {
	if (isFriend == false)
	{
		profileAddRemFriend.textContent = "Add";
		isFriend = true;
	}
	else
	{
		profileAddRemFriend.textContent = "Remove";
		isFriend = false;
	}
});

profileBlockUnbFriend.addEventListener("click", (event : any) => {
	if (isBlocked == false)
	{
		profileBlockUnbFriend.textContent = "Block";
		isBlocked = true;
	}
	else
	{
		profileBlockUnbFriend.textContent = "Unblock";
		isBlocked = false;
	}
});
function setAccountPage(text : string)
{
	console.log(`text: ${text}`);
	accP.classList.add("flex");
	accP.classList.remove("hidden");
	chatP.classList.remove("grid");
	chatP.classList.add("hidden");
	welcP.classList.add("hidden");
	welcP.classList.remove("flex");
	if (text == "login")
	{
		console.log(" - login");
		logP.classList.add("flex");
		logP.classList.remove("hidden");
		regP.classList.add("hidden");
		regP.classList.remove("flex");
		profP.classList.add("hidden");
		profP.classList.remove("grid");

	}
	else if (text == "register")
	{
		console.log(" - register");
		regP.classList.add("flex");
		regP.classList.remove("hidden");
		logP.classList.add("hidden");
		logP.classList.remove("flex");
		profP.classList.add("hidden");
		profP.classList.remove("grid");
	}
	else if (text == "profile")
	{
		console.log(" - profile");
		profP.classList.add("grid");
		profP.classList.remove("hidden");
		accP.appendChild(profP);
		displayPersonalProfile();
		logP.classList.add("hidden");
		logP.classList.remove("flex");
		regP.classList.add("hidden");
		regP.classList.remove("flex");
		friendsPage.classList.add("hidden");
		friendsPage.classList.remove("flex");
		matchesPage.classList.add("hidden");
		matchesPage.classList.remove("flex");
	}
}

// It makes the preview of the avatar the user wants to upload
regAvatar.addEventListener("change", (event : any) => {
	console.log('change event caught');
	const img : any = document.getElementById("avatar");
	img.src = URL.createObjectURL(regAvatar.files[0]);
});

/*Implementation to display pages triggered by menu selection */
//divs in menu
const settingsDiv : any = document.getElementById("acc-settings");
const friendsDiv : any = document.getElementById("acc-friends");
const matchesDiv : any = document.getElementById("acc-matches");

//page
const settingsPage : any = document.getElementById("update-settings");
const friendsPage : any = document.getElementById("friends");
const matchesPage : any = document.getElementById("matches");

/* Releated to friend page*/

let toggle = false;
const blockButton : any = document.getElementById("blockButton");
const blockedList : any = document.getElementById("blockedList");
const friendList : any = document.getElementById("friendsList");

function displayBlockedFriends() {
	if (toggle == false)
	{
		blockButton.textContent = "See friends";
		blockedList.classList.add("flex");
		blockedList.classList.remove("hidden");
		friendList.classList.add("hidden");
		friendList.classList.remove("flex");
		toggle = true;
	}
	else
	{
		blockButton.textContent = "See blocked users";
		blockedList.classList.add("hidden");
		blockedList.classList.remove("flex");
		friendList.classList.add("flex");
		friendList.classList.remove("hidden");
		toggle = false;
	}
}

// blockButton.classList.add("block");
//event on each menu div
settingsDiv.addEventListener("click", (event : any) => {
	settingsPage.classList.add("flex");
	settingsPage.classList.remove("hidden");
	friendsPage.classList.add("hidden");
	friendsPage.classList.remove("flex");
	matchesPage.classList.add("hidden");
	matchesPage.classList.remove("flex");
});

friendsDiv.addEventListener("click", (event : any) => {
	friendsPage.classList.add("flex");
	friendsPage.classList.remove("hidden");
	settingsPage.classList.add("hidden");
	settingsPage.classList.remove("flex");
	matchesPage.classList.add("hidden");
	matchesPage.classList.remove("flex");
});

matchesDiv.addEventListener("click", (event : any) => {
	matchesPage.classList.add("flex");
	matchesPage.classList.remove("hidden");
	settingsPage.classList.add("hidden");
	settingsPage.classList.remove("flex");
	friendsPage.classList.add("hidden");
	friendsPage.classList.remove("flex");
});

function displayPersonalProfile () {

	tempdisplayN.innerHTML = "Display name: Pallo";
	// profileActions.style.display = "none"; //flex for others' view
	profileActions.classList.add("hidden");
	profileActions.classList.remove("flex");
//header username
// profileUsername.style.display = "flex"; //none for others' view
profileUsername.classList.add("flex");
profileUsername.classList.remove("hidden");
//settings menu + settings page
// profileMenuSettings.style.display = "block"; //none for others' view
profileMenuSettings.classList.add("block");
profileMenuSettings.classList.remove("hidden");
// profileSettingsPage.style.display = "flex"; //none for others' view
profileSettingsPage.classList.add("flex");
profileSettingsPage.classList.remove("hidden");

//friends button requests in friend page
const friendsButtons: NodeListOf<Element> = document.querySelectorAll('.friend-action');
friendsButtons.forEach((button) => {
  const element = button as HTMLElement;
  element.classList.add("flex");
  element.classList.remove("hidden");
});
profileAvatarImg.src = "images/profile/orange.png"; //blue.png for others' view
toggle = true;
displayBlockedFriends();
// blockButton.style.display = "block";
blockButton.classList.add("block");
blockButton.classList.remove("hidden");
}

function displayUserProfile () {

	tempdisplayN.innerHTML = "Display name: Eos";
	// profileActions.style.display = "flex"; //flex for others' view
	profileActions.classList.add("flex");
	profileActions.classList.remove("hidden");
	// matchesPage.style.display = "none";
	matchesPage.classList.add("hidden");
	matchesPage.classList.remove("flex");
//header username
// profileUsername.style.display = "none"; //none for others' view
profileUsername.classList.add("hidden");
profileUsername.classList.remove("flex");
//settings menu + settings page
// profileMenuSettings.style.display = "none"; //none for others' view
profileMenuSettings.classList.add("hidden");
profileMenuSettings.classList.remove("block");
// profileSettingsPage.style.display = "none"; //none for others' view
profileSettingsPage.classList.add("hidden");
profileSettingsPage.classList.remove("flex");
//friends button requests in friend page
const friendsButtons: NodeListOf<Element> = document.querySelectorAll('.friend-action');
friendsButtons.forEach((button) => {
  const element = button as HTMLElement;
  element.classList.add("hidden");
  element.classList.remove("flex");
});
// profileFriendsPageButtons.style.display = "none"; //none for others' view
//change avatar in header
profileAvatarImg.src = "images/profile/blue.png"; //blue.png for others' view
blockButton.classList.add("hidden");
blockButton.classList.remove("block");

}