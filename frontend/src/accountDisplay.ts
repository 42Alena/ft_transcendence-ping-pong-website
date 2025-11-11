//pages
const registerPage : any = document.getElementById("registerPage");
const loginPage : any = document.getElementById("loginPage");
const profilePage : any = document.getElementById("profilePage");
//register form
const registerForm : any = document.getElementById("register");
const regAvatar : any = document.getElementById("reg-avatar");
const submitButton : any = document.getElementById("submitRegButton"); //button
//login form
const loginForm : any = document.getElementById("login");
const loginButton : any = document.getElementById("submitLogingButton"); //button
//profile page
const profileUsername : any = document.getElementById("acc-username");
const profileDisplayName : any = document.getElementById("acc-displayName");
const profileAvatar : any = document.getElementById("acc-avatar");
const profileAvatarImg : any = document.getElementById("acc-profile-avatar");
const profileActions : any = document.getElementById("acc-actions"); //buttons
//buttons
const profileAddRemFriend : any = document.getElementById("add-remove-friend__header");
const profileBlockUnbFriend : any = document.getElementById("block-unblock-friend__header");
const profileSendMess : any = document.getElementById("send-message__header");
const profileInviteFriend : any = document.getElementById("invite-friend__header");
//settings page
const profileMenuSettings : any = document.getElementById("acc-settings");
const profileSettingsPage : any = document.getElementById("update-settings");
const profileSettingsForm : any = document.getElementById("settings");
//friend page
const profileFriendPage : any = document.getElementById("friends");
//buttons
const removeFriend : any = document.getElementById("remove-friend__page");
const blockFriend : any = document.getElementById("block-friend__page");

const tempdisplayN : any = document.getElementById("temp-displayname");

//events on registration
registerForm.addEventListener("submit", (event : any) => {
	// (Alena) begin temporary for error
	const errorsElm = document.getElementById('reg-errors');
	// (Alena) begin temporary for error
});

//event on login
loginForm.addEventListener("submit", (event));

//event on setting page
profileSettingsForm.addEventListener("submit", (event));

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
profileInviteFriend.addEventListener("click", (event));
profileSendMess.addEventListener("click", (event));
// removeFriend.addEventListener("click", (event));
// blockFriend.addEventListener("click", (event));

/*Releated to display register or login form on choice page */
function setAccountPage(text : string)
{
	accP.style.display = "flex";
	profP.style.display = "none"
	chatP.style.display = "none";
	welcP.style.display = "none";
	regP.style.display = "none";
	logP.style.display = "none";
	if (text == "login")
	{
		loginPage.style.display = "flex";
		registerPage.style.display = "none";
		profilePage.style.display = "none";

	}
	else if (text == "register")
	{
		registerPage.style.display = "flex";
		loginPage.style.display = "none";
		profilePage.style.display = "none";
	}
	else if (text == "profile")
	{
		profilePage.style.display = "grid";
		accP.appendChild(profilePage);
		displayPersonalProfile();
		profileFriendPage.style.display = "none";
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
// profileActions.style.display = "none"; //flex for others' view
// //header username
// profileUsername.style.display = "flex"; //none for others' view
// //settings menu + settings page
// profileMenuSettings.style.display = "flex"; //none for others' view
// profileSettingsPage.style.display = "flex"; //none for others' view
// //friends button requests in friend page
// const friendsButtons: NodeListOf<Element> = document.querySelectorAll('.friend-action');
// friendsButtons.forEach((button) => {
//   const element = button as HTMLElement;
//   element.style.display = 'flex';
// });
// // profileFriendsPageButtons.style.display = "none"; //none for others' view
// //change avatar in header
// profileAvatarImg.src = "images/profile/blue.png"; //blue.png for others' view
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
		blockedList.style.display = "flex";
		friendList.style.display = "none";
		toggle = true;
	}
	else
	{
		blockButton.textContent = "See blocked users";
		friendList.style.display = "flex";
		blockedList.style.display = "none";
		toggle = false;
	}
}

blockButton.style.display = "block";
//event on each menu div
settingsDiv.addEventListener("click", (event : any) => {
	settingsPage.style.display = "flex";
	friendsPage.style.display = "none";
	matchesPage.style.display = "none";
});

friendsDiv.addEventListener("click", (event : any) => {
	friendsPage.style.display = "flex";
	settingsPage.style.display = "none";
	matchesPage.style.display = "none";
});

matchesDiv.addEventListener("click", (event : any) => {
	matchesPage.style.display = "flex";
	settingsPage.style.display = "none";
	friendsPage.style.display = "none";
});

function displayPersonalProfile () {

	tempdisplayN.innerHTML = "Display name: Pallo";
	profileActions.style.display = "none"; //flex for others' view
//header username
profileUsername.style.display = "flex"; //none for others' view
//settings menu + settings page
profileMenuSettings.style.display = "block"; //none for others' view
profileSettingsPage.style.display = "flex"; //none for others' view
//friends button requests in friend page
const friendsButtons: NodeListOf<Element> = document.querySelectorAll('.friend-action');
friendsButtons.forEach((button) => {
  const element = button as HTMLElement;
  element.style.display = 'flex';
});
// profileFriendsPageButtons.style.display = "none"; //none for others' view
//change avatar in header
profileAvatarImg.src = "images/profile/orange.png"; //blue.png for others' view
toggle = true;
displayBlockedFriends();
blockButton.style.display = "block";
}

function displayUserProfile () {

	tempdisplayN.innerHTML = "Display name: Eos";
	profileActions.style.display = "flex"; //flex for others' view
	matchesPage.style.display = "none";
//header username
profileUsername.style.display = "none"; //none for others' view
//settings menu + settings page
profileMenuSettings.style.display = "none"; //none for others' view
profileSettingsPage.style.display = "none"; //none for others' view
//friends button requests in friend page
const friendsButtons: NodeListOf<Element> = document.querySelectorAll('.friend-action');
friendsButtons.forEach((button) => {
  const element = button as HTMLElement;
  element.style.display = 'none';
});
// profileFriendsPageButtons.style.display = "none"; //none for others' view
//change avatar in header
profileAvatarImg.src = "images/profile/blue.png"; //blue.png for others' view
blockButton.style.display = "none";

}