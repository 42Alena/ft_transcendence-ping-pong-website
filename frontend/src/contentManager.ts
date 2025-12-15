const chatP: any = document.getElementById("chatPage");
const welcP: any = document.getElementById("welcomePage");
const accP: any = document.getElementById("accountPage");
const gameP: any = document.getElementById("gamePage");

function displayPage(text: string, shouldUpdateNav = true): void {
  updateUrl("pong", text, shouldUpdateNav);
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
  playersNameForm.reset();
  errorNamesDiv.classList.add("invisible");
  if (text == "chat") {
    requestChats();
    chatP.classList.add("grid");
    chatP.classList.remove("hidden");
    welcP.classList.add("hidden");
    welcP.classList.remove("flex");
    accP.classList.add("hidden");
    accP.classList.remove("flex");
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
  } else if (text == "welcome") {
    welcP.classList.add("flex");
    welcP.classList.remove("hidden");
    chatP.classList.remove("grid");
    chatP.classList.add("hidden");
    accP.classList.add("hidden");
    accP.classList.remove("flex");
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
  } else if (text == "game" || text == "tournament") {
    gameP.classList.add("flex");
    gameP.classList.remove("hidden");
    setGameType(text);
    welcP.classList.add("hidden");
    welcP.classList.remove("flex");
    chatP.classList.remove("grid");
    chatP.classList.add("hidden");
    accP.classList.add("hidden");
    accP.classList.remove("flex");
  }
}


// on load check if we need to show specific page
// `/pong-$name` for general pages
// `/account-$name` for account relate pages
window.addEventListener("load", () => navToPage());
// whenever history state changes (back <> forward buttons in browser)
window.addEventListener("popstate", () => setTimeout(() => navToPage(), 0));

function navToPage() {
  const [pageType, pageName] = window.location.pathname.split("-");
  console.log("Page type:", pageType, "Page name:", pageName);
  if (!pageName) {
    return;
  }
  if (pageType === "/pong") {
    displayPage(pageName, false); // go to page but don't update nav state
  } else if (pageType === "/account") {
    setAccountPage(pageName, false); // go to page but don't update nav state
  }
}

// only push new state when it differes from active
function updateUrl(pageType: string, pageName: string, shouldUpdateNav = true) {
  const newUrl = `/${pageType}-${pageName}`;
  if (shouldUpdateNav && !window.location.pathname.startsWith(newUrl)) {
    history.pushState({ pageName }, "", newUrl);
  }
}