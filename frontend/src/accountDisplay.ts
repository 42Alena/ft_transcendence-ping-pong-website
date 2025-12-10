//pages

const regP: any = document.getElementById("registerPage");
const logP: any = document.getElementById("loginPage");
const profP: any = document.getElementById("profilePage");
//register form
const registerForm: any = document.getElementById("register");
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
function setAccountPage(text: string) {
  reg.reset();
  log.reset();
  displayNameForm.reset();
  passwordForm.reset();
  avatarForm.reset();
  accP.classList.add("flex");
  accP.classList.remove("hidden");
  chatP.classList.remove("grid");
  chatP.classList.add("hidden");
  welcP.classList.add("hidden");
  welcP.classList.remove("flex");
  girlImgLeft.classList.add("block");
  girlImgLeft.classList.remove("hidden");
  girlImgLeftLoser.classList.remove("block");
  girlImgLeftLoser.classList.add("hidden");
  girlImgRight.classList.add("block");
  girlImgRight.classList.remove("hidden");
  girlImgRightLoser.classList.remove("block");
  girlImgRightLoser.classList.add("hidden");
  successRegPage.classList.add("hidden");
  successRegPage.classList.remove("flex");
  if (text == "login") {
    logP.classList.add("flex");
    logP.classList.remove("hidden");
    regP.classList.add("hidden");
    regP.classList.remove("flex");
    profP.classList.add("hidden");
    profP.classList.remove("grid");
    settingsPage.classList.add("hidden");
    settingsPage.classList.remove("flex");
    friendsPage.classList.add("hidden");
    friendsPage.classList.remove("flex");
    gameP.classList.add("hidden");
    gameP.classList.remove("flex");
    setGame.classList.add("hidden");
    setGame.classList.remove("block");
    gameOverDiv.classList.add("hidden");
    gameOverDiv.classList.remove("flex");
    instruction.classList.add("hidden");
    instruction.classList.remove("flex");
    errorUsernameLog.classList.add("hidden");
    errorUsernameLog.classList.remove("block");
    errorPasswordLog.classList.remove("block");
    errorPasswordLog.classList.add("hidden");
    if (gameisOn) {
      clearInterval(interval);
      canvas.classList.add("hidden");
      canvas.classList.remove("block");
      gameisOn = false;
    }
  } else if (text == "register") {
    reg.reset();
    log.reset();
    regP.classList.add("flex");
    regP.classList.remove("hidden");
    reg.classList.add("flex");
    reg.classList.remove("hidden");
    logP.classList.add("hidden");
    logP.classList.remove("flex");
    profP.classList.add("hidden");
    profP.classList.remove("grid");
    settingsPage.classList.add("hidden");
    settingsPage.classList.remove("flex");
    friendsPage.classList.add("hidden");
    friendsPage.classList.remove("flex");
    gameP.classList.add("hidden");
    gameP.classList.remove("flex");
    setGame.classList.add("hidden");
    setGame.classList.remove("block");
    gameOverDiv.classList.add("hidden");
    gameOverDiv.classList.remove("flex");
    instruction.classList.add("hidden");
    instruction.classList.remove("flex");
    errorUsername.classList.add("hidden");
    errorUsername.classList.remove("block");
    errorDisplayName.classList.add("hidden");
    errorDisplayName.classList.remove("block");
    errorPaassword.classList.add("hidden");
    errorPaassword.classList.remove("block");
    if (gameisOn) {
      clearInterval(interval);
      canvas.classList.add("hidden");
      canvas.classList.remove("block");
      gameisOn = false;
    }
  } else if (text == "profile") {
    logP.classList.add("hidden");
    logP.classList.remove("flex");
    regP.classList.add("hidden");
    regP.classList.remove("flex");
    settingsPage.classList.add("hidden");
    settingsPage.classList.remove("flex");
    friendsPage.classList.add("hidden");
    friendsPage.classList.remove("flex");
    gameP.classList.add("hidden");
    gameP.classList.remove("flex");
    setGame.classList.add("hidden");
    setGame.classList.remove("block");
    gameOverDiv.classList.add("hidden");
    gameOverDiv.classList.remove("flex");
    instruction.classList.add("hidden");
    instruction.classList.remove("flex");
    if (gameisOn) {
      clearInterval(interval);
      canvas.classList.add("hidden");
      canvas.classList.remove("block");
      gameisOn = false;
    }
    requestProfile();
  } else if (text == "settings") {
    //add route to this?
    settingsPage.classList.add("flex");
    settingsPage.classList.remove("hidden");
    console.log("here");
    const userDataString: string | null = localStorage.getItem("userData");
    if (localStorage.getItem("userData")) {
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        settingsUsernameInput.value = userData.username;
        settingsDisplayNameInput.value = userData.displayName;
      }
    }
    popup.classList.add("hidden");
    popup.classList.remove("block");
    profP.classList.add("hidden");
    profP.classList.remove("grid");
    logP.classList.add("hidden");
    logP.classList.remove("flex");
    regP.classList.add("hidden");
    regP.classList.remove("flex");
    friendsPage.classList.add("hidden");
    friendsPage.classList.remove("flex");
    gameP.classList.add("hidden");
    gameP.classList.remove("flex");
    setGame.classList.add("hidden");
    setGame.classList.remove("block");
    gameOverDiv.classList.add("hidden");
    gameOverDiv.classList.remove("flex");
    instruction.classList.add("hidden");
    instruction.classList.remove("flex");
    if (gameisOn) {
      clearInterval(interval);
      canvas.classList.add("hidden");
      canvas.classList.remove("block");
      gameisOn = false;
    }
  } else if (text == "friends") {
    requestFriendsList();
    blockedList.classList.add("hidden");
    blockedList.classList.remove("flex");
    profP.classList.add("hidden");
    profP.classList.remove("grid");
    logP.classList.add("hidden");
    logP.classList.remove("flex");
    regP.classList.add("hidden");
    regP.classList.remove("flex");
    settingsPage.classList.add("hidden");
    settingsPage.classList.remove("flex");
    gameP.classList.add("hidden");
    gameP.classList.remove("flex");
    setGame.classList.add("hidden");
    setGame.classList.remove("block");
    gameOverDiv.classList.add("hidden");
    gameOverDiv.classList.remove("flex");
    instruction.classList.add("hidden");
    instruction.classList.remove("flex");
    if (gameisOn) {
      clearInterval(interval);
      canvas.classList.add("hidden");
      canvas.classList.remove("block");
      gameisOn = false;
    }
  }
}

// It makes the preview of the avatar the user wants to upload
// regAvatar.addEventListener("change", (event: any) => {
//   const img: any = document.getElementById("avatar");
//   img.src = URL.createObjectURL(regAvatar.files[0]);
// });

/*Implementation to display pages triggered by menu selection */
//divs in menu
const settingsDiv: any = document.getElementById("acc-settings");
const friendsDiv: any = document.getElementById("acc-friends");
const matchesDiv: any = document.getElementById("acc-matches");

//page
const matchesPage: any = document.getElementById("matches");

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
    blockButton.textContent = "See blocked users";
    blockedList.classList.add("hidden");
    blockedList.classList.remove("flex");
    friendList.classList.add("flex");
    friendList.classList.remove("hidden");
    requestFriendsList();
    toggle = false;
  }
}

// blockButton.classList.add("block");
//event on each menu div
// settingsDiv.addEventListener("click", (event: any) => {
//   settingsPage.classList.add("flex");
//   settingsPage.classList.remove("hidden");
//   friendsPage.classList.add("hidden");
//   friendsPage.classList.remove("flex");
//   matchesPage.classList.add("hidden");
//   matchesPage.classList.remove("flex");
// });

// friendsDiv.addEventListener("click", (event: any) => {
//   friendsPage.classList.add("flex");
//   friendsPage.classList.remove("hidden");
//   matchesPage.classList.add("hidden");
//   matchesPage.classList.remove("flex");
// });

// matchesDiv.addEventListener("click", (event: any) => {
//   matchesPage.classList.add("flex");
//   matchesPage.classList.remove("hidden");
//   friendsPage.classList.add("hidden");
//   friendsPage.classList.remove("flex");
// });

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
