const logoutButton: any = document.getElementById("logout") as HTMLButtonElement;

logoutButton.addEventListener("click", async (event: any) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(`${BACKEND_URL}/auth/logout`, {
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
      console.log("logout");
      dropMenuUserDiv.classList.add("hidden");
      dropMenuUserDiv.classList.remove("block");
      dropMenuGuestDiv.classList.add("block");
      dropMenuGuestDiv.classList.remove("hidden");
      logUserHeaderDiv.textContent = "Hello, you";
      logAvatHeaderDiv.src = "images/profile/orange.png"; 
      handleClickEvent('welcome');
      // document.cookie = "auth=; path=/auth; expires=Thu, 01 Jan 1970 00:00:00 GMT;"; // delete empty cookie
    }
  } catch (error: any) {
    console.error("Error during logout:", error.message);
  }
});