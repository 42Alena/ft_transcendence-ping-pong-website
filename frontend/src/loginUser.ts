const log: any = document.getElementById("login");
const errorUsernameLog: any = document.getElementById("log-username_error");
const errorPasswordLog: any = document.getElementById("log-password_error");
const logUserHeaderDiv: any = document.getElementById("logged-user");
const logAvatHeaderDiv: any = document.querySelector("#logged-user-avatar img");
const dropMenuGuestDiv: any = document.getElementById("dropdown-menu_guests");
const dropMenuUserDiv: any = document.getElementById("dropdown-menu_user");
const settingsUsernameInput2 = document.getElementById(
  "settings-username",
) as HTMLInputElement;

const settingsDisplayInput2 = document.getElementById(
  "settings-displayName",
) as HTMLInputElement;

let loggedUser: boolean = false;

if (localStorage.getItem("userData")) {
  dropMenuUserDiv.classList.add("block");
  dropMenuUserDiv.classList.remove("hidden");
  dropMenuGuestDiv.classList.add("hidden");
  dropMenuGuestDiv.classList.remove("block");
  const userDataString: string | null = localStorage.getItem("userData");
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    if (logUserHeaderDiv.textContent !== `Hello, ${userData.username}`) {
      logUserHeaderDiv.textContent = `Hello, ${userData.username}`;
    }

    if (logAvatHeaderDiv.src !== userData.avatarUrl) {
      logAvatHeaderDiv.src = userData.avatarUrl; //need to fix
    }
    settingsUsernameInput2.value = userData.username;
    settingsDisplayInput2.value = userData.displayName;
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
    credentials: "include",
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
    } else {
      errorUsernameLog.classList.add("hidden");
      errorUsernameLog.classList.remove("block");
      errorPasswordLog.classList.remove("block");
      errorPasswordLog.classList.add("hidden");
      log.reset();
      logUserHeaderDiv.textContent = "";
      localStorage.setItem("userData", JSON.stringify(data));
      const userDataString: string | null = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userData.avatarUrl = "/images/profile/blue.png"; //default img
        logUserHeaderDiv.textContent = `Hello, ${userData.username}`;
        logAvatHeaderDiv.src = userData.avatarUrl;
        dropMenuUserDiv.classList.add("block");
        dropMenuUserDiv.classList.remove("hidden");
        dropMenuGuestDiv.classList.add("hidden");
        dropMenuGuestDiv.classList.remove("block");
        displayPage("welcome");
      }
      console.log("login user:", data);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});

//need to change fastify.register(require('@fastify/cors'), { origin: '*' })
//fastify.register(require('@fastify/cors'), { origin: ['http://127.0.0.1:8081', 'http://localhost:8081'], credentials: true}) //https://github.com/fastify/fastify-cors

