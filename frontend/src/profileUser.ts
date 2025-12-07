const usernameDiv = document.getElementById("profile-info-username") as HTMLDivElement;
const displayNameDiv = document.getElementById("profile-info-displayName") as HTMLDivElement;
const avatarImg = document.querySelector('#profile-avatar img') as HTMLImageElement;

async function requestProfile() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(log);

  const profileBody = {
    username: formData.get("login-user_username"),
    passwordPlain: formData.get("login-user_password"),
  };
  const myRequest = new Request("http://127.0.0.1:3000/users/me", {
    method: "GET",
    headers: myHeaders,
    credentials : "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    else
    {
		profP.classList.add("grid");
		profP.classList.remove("hidden");
		const usernameSpan : HTMLSpanElement = document.createElement("span");
		usernameSpan.classList.add("font-bold", "text-xl");
		usernameSpan.textContent = "Username:";
		const usernameData : HTMLSpanElement = document.createElement("span");
		usernameData.classList.add("text-xl");
		usernameData.textContent = `${data.username}`;
		usernameDiv.appendChild(usernameSpan);
		usernameDiv.appendChild(document.createTextNode('\u00A0'));
		usernameDiv.appendChild(usernameData);
		const displayNameSpan : HTMLSpanElement = document.createElement("span");
		displayNameSpan.classList.add("font-bold", "text-xl");
		displayNameSpan.textContent = "Username:";
		const displayNameData : HTMLSpanElement = document.createElement("span");
		displayNameData.classList.add("text-xl");
		displayNameData.textContent = `${data.displayName}`;
		displayNameDiv.appendChild(displayNameSpan);
		displayNameDiv.appendChild(document.createTextNode('\u00A0'));
		displayNameDiv.appendChild(displayNameData);
		avatarImg.src = "/images/profile/blue.png"; //to change
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}