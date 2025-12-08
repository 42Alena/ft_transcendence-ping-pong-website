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
		console.log(`url: ${data.avatarUrl}`);
		avatarImg.src = data.avatarUrl; //need to be fixed
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const settingsPage: any = document.getElementById("settingsPage");

const avatarForm: any = document.getElementById("avatar");
const imgIcon: any = document.getElementById("svgIcon");
const avatarInput: any = document.getElementById("avatarImgEdit"); //file
const popup: any = document.getElementById("avatarOptions");
const popUpButton: any = document.getElementById("closePopUp");
const displayNameForm: any = document.getElementById("displayName");
const passwordForm: any = document.getElementById("password");
const previewNewAvatar = document.getElementById("avatar-image") as HTMLImageElement; //preview
const existingImgAvatarInput = document.getElementById("existingAvatar") as HTMLInputElement;

// When the user clicks on <span> (x), close the modal
popUpButton.addEventListener("click", () => {
  popup.classList.add("hidden");
  popup.classList.remove("block");
});

let pop: boolean = false;
avatarForm.addEventListener("submit", async (event: any) => {
  event.preventDefault();
  console.log("submiut avatar");

   const formData  = new FormData();
   if (avatarInput.files.length > 0) {
    formData.append("avatar", avatarInput.files[0]);
    const myRequest = new Request("http://127.0.0.1:3000/users/me/avatar", {
    method: "POST",
    body: formData,
	credentials : "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    console.log(response.json);
    const data = await response.json();
    if (!response.ok) {
      avatarForm.reset();
      throw new Error(`Response status ${response.status}`);
    } else {
		const userDataString : string | null = localStorage.getItem('userData');
    avatarForm.reset();
        if (userDataString)
        {
          const userData = JSON.parse(userDataString)
          userData.url = data.avatarUrl; //default img
        }
        popup.classList.add("hidden");
        popup.classList.remove("block");
      	console.log("avatar uploaded:", data);
    }
  } catch (error: any) {
    avatarForm.reset();
    console.error("Error during avatar:", error.message);
  }
  } else {
    console.log("need to handle url");
    formData.append("avatar", existingImgAvatarInput.value);
  }

  
});

displayNameForm.addEventListener("submit", (event: any) => {
  event.preventDefault();
});

passwordForm.addEventListener("submit", (event: any) => {
  event.preventDefault();
});

function showPopUp() {
	popup.classList.add("block");
  	popup.classList.remove("hidden");
}

function previewImage(event : Event) {
  const input = (event.target as HTMLInputElement);
	const file = input.files ? input.files[0] : null;
    const preview = document.getElementById('avatar-image') as HTMLImageElement;

    if (file) {
        const objectURL = URL.createObjectURL(file);
        preview.src = objectURL;
    }
}

function displayPreview() {
   const imgElement = document.getElementById("G") as HTMLImageElement;
   previewNewAvatar.src = imgElement.src;
   existingImgAvatarInput.value = imgElement.src;
}

// imgIcon.addEventListener("click", (event: any) => {
//   popup.classList.add("block");
//   popup.classList.remove("hidden");
// });

// avatar.addEventListener("click", () => {
//   popup.classList.add("block");
//   popup.classList.remove("hidden");
// });