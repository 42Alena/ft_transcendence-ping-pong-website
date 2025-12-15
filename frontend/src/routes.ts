window.addEventListener("popstate", (event) => {
  console.log(`state: ${JSON.stringify(event.state)}`);
  const page = event.state.page;
  // check if id is not null
  // call displayChat page
  // otherwise
  displayPage(page);
  if (page == "chat" && event.state.userId != null)
    requestConversation(event.state.userId, event.state.userDisplayName, event.state.userAvatarUrl);
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
