window.addEventListener("popstate", (event) => {
  console.log(`state: ${JSON.stringify(event.state)}`);
  const page = event.state.page;
  displayPage(page);
  if (page == "chat" && event.state.userId != null)
    requestConversation(event.state.userId, event.state.userDisplayName, event.state.userAvatarUrl);
  // else if (page == "user")
    //
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sideBarButtons").forEach((element) => {
    console.log(`adding event listener for id: ${JSON.stringify(element.id)}`);
    element.addEventListener("click", (event) => {
      event.preventDefault();
      handleClickEvent(element.id);
    });
  });
  
  document.querySelectorAll('.dropdown-menu').forEach((dropdown) => {
    dropdown.querySelectorAll('a').forEach((element) => {
        console.log(`adding event listener for id: ${JSON.stringify(element.id)}`);
      element.addEventListener("click", (event) => {
            event.preventDefault();
            handleClickEvent(element.id);
      });
    });
  });
});
