const log : any = document.getElementById("login");
const errorUsernameLog: any = document.getElementById("log-username_error");
const errorPasswordLog: any = document.getElementById("log-password_error");
const logUserHeaderDiv : any = document.getElementById("logged-user");
const logAvatHeaderDiv : any = document.querySelector('#logged-user-avatar img');
let loggedUser : boolean = false;

if (localStorage.getItem('loggedUser'))
{
    logUserHeaderDiv.textContent = `Hello, ${localStorage.getItem('loggedUser')}`;
    logAvatHeaderDiv.src = localStorage.getItem('loggedAvatar');
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
    username: formData.get("login-user_username"), // Use the name attribute
    passwordPlain: formData.get("login-user_password"), // Use the name attribute
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
        loggedUser = true;
        errorUsernameLog.classList.add("hidden");
        errorUsernameLog.classList.remove("block");
        errorPasswordLog.classList.remove("block");
        errorPasswordLog.classList.add("hidden");
        log.reset();
        logUserHeaderDiv.textContent = '';
        logUserHeaderDiv.textContent = `Hello, ${data.username}`;
        const user = data.username;
        let url : string = data.avatarUrl;
        //need to change menu bar, change the name in the header and the avatar
        if (url == null)
            localStorage.setItem('loggedAvatar', "images/profile/blue.png");
        else
            localStorage.setItem('loggedAvatar', url);
        localStorage.setItem('loggedUser', user);
        logUserHeaderDiv.textContent = `Hello, ${localStorage.getItem('loggedUser')}`;
        logAvatHeaderDiv.src = localStorage.getItem('loggedAvatar');
        console.log("login user:", data);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});
