//pages

const regP: any = document.getElementById("registerPage");
const logP: any = document.getElementById("loginPage");
const profP: any = document.getElementById("profilePage");
//register form
// const regAvatar: any = document.getElementById("reg-avatar");
//profile page
const profileUsername: any = document.getElementById("acc-username");
const profileAvatarImg: any = document.getElementById("acc-profile-avatar");
const profileActions: any = document.getElementById("acc-actions"); //buttons
//buttons
const profileAddRemFriend: any = document.getElementById(
  "add-remove-friend__header",
);
const profileBlockUnbFriend: any = document.getElementById(
  "block-unblock-friend__header",
);
// const tempdisplayN: any = document.getElementById("temp-displayname");

let isFriend = false;
let isBlocked = true;

profileAddRemFriend.addEventListener("click", (event: any) => {
  const buttonsDiv = document.getElementById("acc-options");
  if (buttonsDiv)
  {
    const userId = buttonsDiv.dataset.userid as string;
    if (isFriend == false) {
      profileAddRemFriend.textContent = "Remove";
      isFriend = true;
      addFriend(userId);
    } else {
      profileAddRemFriend.textContent = "Add";
       isFriend = false;
      removeFriend(userId);
    }
}
});

profileBlockUnbFriend.addEventListener("click", (event: any) => {
  const buttonsDiv = document.getElementById("acc-options");
  if (buttonsDiv)
  {
     const userId = buttonsDiv.dataset.userid as string;
  if (isBlocked == false) {
    profileBlockUnbFriend.textContent = "Unblock";
    isBlocked = true;
    blockFriend(userId);
  } else {
    profileBlockUnbFriend.textContent = "Block";
    isBlocked = false;
    unBlockFriend(userId)
  }
}
});

// It makes the preview of the avatar the user wants to upload
// regAvatar.addEventListener("change", (event: any) => {
//   const img: any = document.getElementById("avatar");
//   img.src = URL.createObjectURL(regAvatar.files[0]);
// });

/*Implementation to display pages triggered by menu selection */
//divs in menu
const settingsDiv: any = document.getElementById("acc-settings");
const friendsDiv: any = document.getElementById("acc-friends");
// const matchesDiv: any = document.getElementById("acc-matches");

//page
const matchesPage: any = document.getElementById("stats");

/* Releated to friend page*/

let toggle = false;
const blockButton: any = document.getElementById("blockButton");
const blockedList: any = document.getElementById("blockedList");
const friendList: any = document.getElementById("friendsList");

function displayBlockedFriends() {
  if (toggle == false) {
    blockButton.textContent = "See friends";
    blockedList.classList.add("flex");
    blockedList.classList.remove("hidden");
    friendList.classList.add("hidden");
    friendList.classList.remove("flex");
    requestBlockedList();
    toggle = true;
  } else {
    blockButton.textContent = "See blocked chats";
    blockedList.classList.add("hidden");
    blockedList.classList.remove("flex");
    friendList.classList.add("flex");
    friendList.classList.remove("hidden");
    requestFriendsList();
    toggle = false;
  }
}

function displayPersonalProfile() {
  // tempdisplayN.innerHTML = "Display name: Pallo";
  profileActions.classList.add("hidden");
  profileActions.classList.remove("flex");

  profileUsername.classList.add("flex");
  profileUsername.classList.remove("hidden");

  // profileMenuSettings.classList.add("block");
  // profileMenuSettings.classList.remove("hidden");
  // profileSettingsPage.classList.add("flex");
  // profileSettingsPage.classList.remove("hidden");

  //friends button requests in friend page
  const friendsButtons: NodeListOf<Element> =
    document.querySelectorAll(".friend-action");
  friendsButtons.forEach((button) => {
    const element = button as HTMLElement;
    element.classList.add("flex");
    element.classList.remove("hidden");
  });
  profileAvatarImg.src = "images/profile/orange.png";
  blockButton.classList.add("block");
  blockButton.classList.remove("hidden");
}

function displayUserProfile() {
  // tempdisplayN.innerHTML = "Display name: Eos";
  profileActions.classList.add("flex");
  profileActions.classList.remove("hidden");
  // matchesPage.classList.add("hidden");
  // matchesPage.classList.remove("flex");
  profileUsername.classList.add("hidden");
  profileUsername.classList.remove("flex");
  // profileMenuSettings.classList.add("hidden");
  // profileMenuSettings.classList.remove("block");
  // profileSettingsPage.classList.add("hidden");
  // profileSettingsPage.classList.remove("flex");
  const friendsButtons: NodeListOf<Element> =
    document.querySelectorAll(".friend-action");
  friendsButtons.forEach((button) => {
    const element = button as HTMLElement;
    element.classList.add("hidden");
    element.classList.remove("flex");
  });
  profileAvatarImg.src = "images/profile/blue.png"; //blue.png for others' view
  blockButton.classList.add("hidden");
  blockButton.classList.remove("block");
}

// const registerForm: any = document.getElementById("register");
// const registerSuccessPage: any = document.getElementById("register-success");
// const loginButton: any = document.getElementById("login-button");
// const loginForm: any = document.getElementById("login");

// registerForm.addEventListener("click", (event: any) => {
//   event.preventDefault();
//   regP.classList.add("hidden");
//   regP.classList.remove("flex");
//   registerSuccessPage.classList.add("flex");
//   registerSuccessPage.classList.remove("hidden");
// });

// loginButton.addEventListener("click", () => {
//   registerSuccessPage.classList.add("hidden");
//   registerSuccessPage.classList.remove("flex");
//   setAccountPage("login");
// });

// loginForm.addEventListener("submit", (event: any) => {
//   event.preventDefault();
// });

// const settingsPage: any = document.getElementById("settingsPage");
const friendsPage: any = document.getElementById("friendsPage");
// const avatarForm: any = document.getElementById("avatar");
// const imgIcon: any = document.getElementById("svgIcon");
// const avatar: any = document.getElementById("avatarImgEdit");
// const popup: any = document.getElementById("avatarOptions");
// const popUpButton: any = document.getElementById("closePopUp");
// const displayNameForm: any = document.getElementById("displayName");
// const passwordForm: any = document.getElementById("password");

// // When the user clicks on <span> (x), close the modal
// popUpButton.addEventListener("click", () => {
//   popup.classList.add("hidden");
//   popup.classList.remove("block");
// });

// let pop: boolean = false;
// avatarForm.addEventListener("submit", (event: any) => {
//   event.preventDefault();
// });

// displayNameForm.addEventListener("submit", (event: any) => {
//   event.preventDefault();
// });

// passwordForm.addEventListener("submit", (event: any) => {
//   event.preventDefault();
// });

// imgIcon.addEventListener("click", (event: any) => {
//   popup.classList.add("block");
//   popup.classList.remove("hidden");
// });

// avatar.addEventListener("click", () => {
//   popup.classList.add("block");
//   popup.classList.remove("hidden");
// });
