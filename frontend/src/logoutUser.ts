const logoutButton: any = document.getElementById("logout") as HTMLButtonElement;

logoutButton.addEventListener("click", async (event: any) => {

  localStorage.removeItem("userData");
  dropMenuUserDiv.classList.add("hidden");
  dropMenuUserDiv.classList.remove("block");
  dropMenuGuestDiv.classList.add("block");
  dropMenuGuestDiv.classList.remove("hidden");
  logUserHeaderDiv.textContent = "Hello, you";
  logAvatHeaderDiv.src = "images/profile/orange.png"; 
  displayPage('welcome');
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/auth/logout", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({}),
	credentials : "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    console.log(response.json);
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    } else {
      localStorage.clear();
      dropMenuUserDiv.classList.add("hidden");
      dropMenuUserDiv.classList.remove("block");
      dropMenuGuestDiv.classList.add("block");
      dropMenuGuestDiv.classList.remove("hidden");
      // document.cookie = "auth=; path=/auth; expires=Thu, 01 Jan 1970 00:00:00 GMT;"; // delete empty cookie
    }
  } catch (error: any) {
    console.error("Error during logout:", error.message);
  }
});