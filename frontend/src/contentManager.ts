const chatP: any = document.getElementById("chatPage");
const welcP: any = document.getElementById("welcomePage");
const accP: any = document.getElementById("accountPage");
const gameP: any = document.getElementById("gamePage");
const personalP = document.getElementById("personalProfilePage") as HTMLDivElement;
const errors = document.querySelectorAll(".errors") as NodeListOf<HTMLDivElement>;

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
  const errorNamesDiv = document.getElementById(
  "playersName_error",
) as HTMLDivElement;
errorNamesDiv.classList.add("invisible");
  reg.reset();
  log.reset();
  avatarForm.reset();
  passwordForm.reset();
  errors.forEach((elements) => {
    elements.classList.add("hidden");
    elements.classList.remove("block");
  })
// function displayPage(text: string, shouldUpdateNav = true): void {
//   updateUrl("pong", text, shouldUpdateNav);
//   girlImgLeft.classList.add("block");
//   girlImgLeft.classList.remove("hidden");
//   girlImgLeftLoser.classList.remove("block");
//   girlImgLeftLoser.classList.add("hidden");
//   girlImgRight.classList.add("block");
//   girlImgRight.classList.remove("hidden");
//   girlImgRightLoser.classList.remove("block");
//   girlImgRightLoser.classList.add("hidden");
//   successRegPage.classList.add("hidden");
//   successRegPage.classList.remove("flex");
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
    const userProfileDiv = document.getElementById("userProfile") as HTMLDivElement;
    userProfileDiv.hidden = true;
    if (userProfileDiv)
    {
      while(userProfileDiv.firstChild)
        userProfileDiv.removeChild(userProfileDiv.firstChild);
    }
    requestChats();
  //   chatP.classList.add("grid");
  //   chatP.classList.remove("hidden");
  //   welcP.classList.add("hidden");
  //   welcP.classList.remove("flex");
  //   accP.classList.add("hidden");
  //   accP.classList.remove("flex");
  //   gameP.classList.add("hidden");
  //   gameP.classList.remove("flex");
  //   setGame.classList.add("hidden");
  //   setGame.classList.remove("block");
  //   gameOverDiv.classList.add("hidden");
  //   gameOverDiv.classList.remove("flex");
  //   instruction.classList.add("hidden");
  //   instruction.classList.remove("flex");
  //   if (gameisOn) {
  //     clearInterval(interval);
  //     canvas.classList.add("hidden");
  //     canvas.classList.remove("block");
  //     gameisOn = false;
  //   }
  // } else if (text == "welcome") {
  //   welcP.classList.add("flex");
  //   welcP.classList.remove("hidden");
  //   chatP.classList.remove("grid");
  //   chatP.classList.add("hidden");
  //   accP.classList.add("hidden");
  //   accP.classList.remove("flex");
  //   gameP.classList.add("hidden");
  //   gameP.classList.remove("flex");
  //   setGame.classList.add("hidden");
  //   setGame.classList.remove("block");
  //   gameOverDiv.classList.add("hidden");
  //   gameOverDiv.classList.remove("flex");
  //   instruction.classList.add("hidden");
  //   instruction.classList.remove("flex");
    // if (gameisOn) {
    //   clearInterval(interval);
    //   canvas.classList.add("hidden");
    //   canvas.classList.remove("block");
    //   gameisOn = false;
    // }
    // requestChats();
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
    personalP.hidden = false;
    profP.hidden = false;
    requestProfile();
  } else if (text == "settings") {
    accP.hidden = false;
    settingsPage.hidden = false;
    const userDataString: string | null = localStorage.getItem("userData");
    if (localStorage.getItem("userData")) {
      if (userDataString) {
        const setUsername = document.getElementById("settings-username") as HTMLInputElement;
        const setDisplayName = document.getElementById("settings-displayName") as HTMLInputElement;
        const setAvatar = document.getElementById("avatar-image") as HTMLImageElement;
        const userData = JSON.parse(userDataString);
        setUsername.value = userData.username;
        setDisplayName.value = userData.displayName;
        setAvatar.src = userData.avatarUrl;
      }
    }
  } else if (text == "friends") {
     accP.hidden = false;
    friendsPage.hidden = false;
    requestFriendsList();
  } else {
    console.log("smth wrong");
  }
}


// on load check if we need to show specific page
// `/pong-$name` for general pages
// `/account-$name` for account relate pages
// window.addEventListener("load", () => navToPage());
// whenever history state changes (back <> forward buttons in browser)
// window.addEventListener("popstate", () => setTimeout(() => navToPage(), 0));

// function navToPage() {
//   const [pageType, pageName] = window.location.pathname.split("-");
//   console.log("Page type:", pageType, "Page name:", pageName);
//   if (!pageName) {
//     return;
//   }
//   if (pageType === "/pong") {
//     displayPage(pageName, false); // go to page but don't update nav state
//   } else if (pageType === "/account") {
//     setAccountPage(pageName, false); // go to page but don't update nav state
//   }
// }

// only push new state when it differes from active
function updateUrl(pageType: string, pageName: string, shouldUpdateNav = true) {
  const newUrl = `/${pageType}-${pageName}`;
  if (shouldUpdateNav && !window.location.pathname.startsWith(newUrl)) {
    history.pushState({ pageName }, "", newUrl);
  }
}