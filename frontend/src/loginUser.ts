const log : any = document.getElementById("login");
const errorUsernameLog: any = document.getElementById("log-username_error");
const errorPasswordLog: any = document.getElementById("log-password_error");
const logUserHeaderDiv : any = document.getElementById("logged-user");
const logAvatHeaderDiv : any = document.querySelector('#logged-user-avatar img');
const dropMenuGuestDiv : any = document.getElementById("dropdown-menu_guests");
const dropMenuUserDiv : any = document.getElementById("dropdown-menu_user");

let loggedUser : boolean = false;

if (localStorage.getItem('userData'))
{
    dropMenuUserDiv.classList.add("block");
    dropMenuUserDiv.classList.remove("hidden");
    dropMenuGuestDiv.classList.add("hidden");
    dropMenuGuestDiv.classList.remove("block");
    const userDataString : string | null = localStorage.getItem('userData');
    if (userDataString)
    {
      const userData = JSON.parse(userDataString)
      userData.url = "/images/profile/blue.png" //default img
      logUserHeaderDiv.textContent = `Hello, ${userData.username}`;
      logAvatHeaderDiv.src = userData.url;
    }
}

log.addEventListener("submit", async (event: any) => {
  event.preventDefault();
    errorUsernameLog.classList.add("hidden");
        errorUsernameLog.classList.remove("block");
        errorPasswordLog.classList.remove("block");
        errorPasswordLog.classList.add("hidden");
  console.log("button login pressed");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(log);

  const LoginBody = {
    username: formData.get("login-user_username"),
    passwordPlain: formData.get("login-user_password"),
  };
  const myRequest = new Request("http://127.0.0.1:3000/auth/login", {
    method: "POST",
    body: JSON.stringify(LoginBody),
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const data = await response.json();
    if (!response.ok) {
      if (data.field == "username") {
        errorUsernameLog.classList.add("block");
        errorUsernameLog.classList.remove("hidden");
        errorUsernameLog.textContent = data.error;
      } else {
        errorPasswordLog.classList.add("block");
        errorPasswordLog.classList.remove("hidden");
        errorPasswordLog.textContent = data.error;
      }
      throw new Error(`Error ${response.status}`);
    }
    else
    {
        errorUsernameLog.classList.add("hidden");
        errorUsernameLog.classList.remove("block");
        errorPasswordLog.classList.remove("block");
        errorPasswordLog.classList.add("hidden");
        log.reset();
        logUserHeaderDiv.textContent = '';
        //need to change menu bar, change the name in the header and the avatar
        localStorage.setItem('userData', JSON.stringify(data));
        const userDataString : string | null = localStorage.getItem('userData');
        if (userDataString)
        {
          const userData = JSON.parse(userDataString)
          userData.url = "/images/profile/blue.png" //default img
          // localStorage.setItem('loggedUser', user);
          logUserHeaderDiv.textContent = `Hello, ${userData.username}`;
          logAvatHeaderDiv.src = userData.url;
          dropMenuUserDiv.classList.add("block");
          dropMenuUserDiv.classList.remove("hidden");
          dropMenuGuestDiv.classList.add("hidden");
          dropMenuGuestDiv.classList.remove("block");
          displayPage('welcome');
        }
        console.log("login user:", data);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});
