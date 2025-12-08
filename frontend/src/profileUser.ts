const usernameDiv = document.getElementById("profile-info-username") as HTMLDivElement;
const displayNameDiv = document.getElementById("profile-info-displayName") as HTMLDivElement;
const avatarImg = document.querySelector('#profile-avatar img') as HTMLImageElement;
const usernameSpan : HTMLSpanElement = document.createElement("span");
const usernameData : HTMLSpanElement = document.createElement("span");
const displayNameSpan : HTMLSpanElement = document.createElement("span");
const displayNameData : HTMLSpanElement = document.createElement("span");

let firstView : boolean = false;

async function requestProfile() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

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
    if (!firstView)
    {
      console.log("first load");
      usernameSpan.classList.add("font-bold", "text-xl");
      usernameSpan.textContent = "Username:";
      usernameData.classList.add("text-xl");
      usernameData.textContent = data.username;
      usernameDiv.appendChild(usernameSpan);
      usernameDiv.appendChild(document.createTextNode('\u00A0'));
      usernameDiv.appendChild(usernameData);
      displayNameSpan.classList.add("font-bold", "text-xl");
      displayNameSpan.textContent = "Username:";
      displayNameData.classList.add("text-xl");
      displayNameData.textContent = data.displayName;
      displayNameDiv.appendChild(displayNameSpan);
      displayNameDiv.appendChild(document.createTextNode('\u00A0'));
      displayNameDiv.appendChild(displayNameData);
      avatarImg.src = "images/profile/blue.png" //need to be fixed
      firstView = true;
    }
    else
    {
      console.log("second load");
      usernameData.textContent = data.username;
      displayNameData.textContent = data.displayName;
    }
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const settingsPage: any = document.getElementById("settingsPage");
const settingsUsernameInput = document.getElementById("settings-username") as HTMLInputElement;
const settingsDisplayNameInput = document.getElementById("settings-displayName") as HTMLInputElement;
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
const errorSettingsDisplayName = document.getElementById("settings-displayName_error") as HTMLDivElement;

displayNameForm.addEventListener("submit", async(event: any) => {
  event.preventDefault();
  errorSettingsDisplayName.classList.add("hidden");
  errorSettingsDisplayName.classList.remove("block");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(displayNameForm);

  const displayNameBody = {
    displayName: formData.get("settings-user_displayName"),
  };
  const myRequest = new Request("http://127.0.0.1:3000/users/me/display-name", {
    method: "PATCH",
    body: JSON.stringify(displayNameBody),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    if (!response.ok) {
        errorSettingsDisplayName.classList.add("block");
        errorSettingsDisplayName.classList.remove("hidden");
        errorSettingsDisplayName.textContent = data.error;
      throw new Error(`Error ${response.status}`);
    } else {
      errorSettingsDisplayName.classList.add("hidden");
      errorSettingsDisplayName.classList.remove("block");
      const userDataString: string | null = localStorage.getItem("userData");
      if (userDataString) {
        localStorage.setItem("userData", JSON.stringify(data));
        const userData = JSON.parse(userDataString);
        console.log(userData.displayName);
        userData.displayName = formData.get("settings-user_displayName");
        localStorage.setItem("userData", JSON.stringify(userData)); 
        console.log(userData.displayName);
      }
      console.log("displayName user:", data);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }

});

const errorSettingsCurrPass = document.getElementById("settings-current-password_error") as HTMLDivElement;
const errorSettingsNewPass = document.getElementById("settings-new-password_error") as HTMLDivElement;
passwordForm.addEventListener("submit", async(event: any) => {
  event.preventDefault();
  console.log("password");
  errorSettingsCurrPass.classList.add("hidden");
  errorSettingsCurrPass.classList.remove("block");
   errorSettingsNewPass.classList.add("hidden");
  errorSettingsNewPass.classList.remove("block");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(passwordForm);

  const passwordBody = {
    currentPassword: formData.get("settings-user_current-password"),
    newPassword : formData.get("settings-user_new-password"),
  };
  console.log(passwordBody.currentPassword);
  console.log(passwordBody.newPassword);
  const myRequest = new Request("http://127.0.0.1:3000/users/me/change-password", {
    method: "PATCH",
    body: JSON.stringify(passwordBody),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    if (!response.ok) {
      if (data.field == "currentPassword") {
        errorSettingsCurrPass.classList.add("block");
        errorSettingsCurrPass.classList.remove("hidden");
        errorSettingsCurrPass.textContent = data.error;
      }
      else
      {
        errorSettingsNewPass.classList.add("block");
        errorSettingsNewPass.classList.remove("hidden");
        errorSettingsNewPass.textContent = data.error;
      }
      passwordForm.reset();
      throw new Error(`Error ${response.status}`);
    } else {
      errorSettingsCurrPass.classList.add("hidden");
      errorSettingsCurrPass.classList.remove("block");
      errorSettingsNewPass.classList.add("hidden");
      errorSettingsNewPass.classList.remove("block");
      passwordForm.reset();
    }
  } catch (error) {
    console.error("Error during password change:", error);
  }
});

const deleteAccountButton = document.getElementById("delete-account-button") as HTMLButtonElement;

deleteAccountButton.addEventListener("click", async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/users/me", {
    method: "DELETE",
    credentials : "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    // const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    else
    {
      localStorage.clear();
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }

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