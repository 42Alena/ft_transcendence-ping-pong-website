const chatP: any = document.getElementById("chatPage");
const welcP: any = document.getElementById("welcomePage");
const accP: any = document.getElementById("accountPage");
const gameP: any = document.getElementById("gamePage");

function handleClickEvent(text: string) {
  const state = { page: text};
  history.pushState(state, "");
  displayPage(text);
}

function displayPage(text: string): void {
  // girlImgLeft.classList.add("block");
  // girlImgLeft.classList.remove("hidden");
  // girlImgLeftLoser.classList.remove("block");
  // girlImgLeftLoser.classList.add("hidden");
  // girlImgRight.classList.add("block");
  // girlImgRight.classList.remove("hidden");
  // girlImgRightLoser.classList.remove("block");
  // girlImgRightLoser.classList.add("hidden");
  // successRegPage.classList.add("hidden");
  // successRegPage.classList.remove("flex");
  // playersNameForm.reset();
  // errorNamesDiv.classList.add("invisible");
  const pages = document.querySelectorAll(".page") as NodeListOf<HTMLDivElement>;
  pages.forEach((element) => {
    element.hidden = true;
    console.log(`page: ${element.id}`);
  });
  reg.reset();
  log.reset();
  avatarForm.reset();
  passwordForm.reset();
  playersNameForm.reset();
  if (gameisOn && !(text == "game" || text == "tournament")) {
    clearInterval(interval);
    canvas.classList.add("hidden");
    canvas.classList.remove("block");
    gameisOn = false;
  }
  console.log(text);
  if (text == "chat") {
    chatP.hidden = false;
    const conversationDiv = document.getElementById("conversation") as HTMLDivElement;
    conversationDiv.hidden = true;
    const startConversationPage = document.getElementById("start-chat") as HTMLDivElement;
    startConversationPage.hidden = false;
    requestChats();
  } else if (text == "welcome" || text == "logo") {
    welcP.hidden = false;
  } else if (text == "game" || text == "tournament") {
    gameP.hidden = false;
    setGameType(text);
  } else if (text == "login") {
    accP.hidden = false;
    logP.hidden = false;
  } else if (text == "register") {
     accP.hidden = false;
    regP.hidden = false;
  } else if (text == "profile") {
    accP.hidden = false;
    profP.hidden = false;
    requestProfile();
  } else if (text == "settings") {
    accP.hidden = false;
    settingsPage.hidden = false;
    const userDataString: string | null = localStorage.getItem("userData");
    if (localStorage.getItem("userData")) {
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        settingsUsernameInput.value = userData.username;
        settingsDisplayNameInput.value = userData.displayName;
      }
    }
  } else if (text == "friends") {
     accP.hidden = false;
    friendsPage.hidden = false;
    requestFriendsList();
  } else {
    // error
  }
}
