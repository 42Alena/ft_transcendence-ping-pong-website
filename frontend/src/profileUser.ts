// import { createPieChart, createBarChart } from './charts';

const usernameDiv = document.getElementById(
  "profile-info-username",
) as HTMLDivElement;
const displayNameDiv = document.getElementById(
  "profile-info-displayName",
) as HTMLDivElement;
const avatarImg = document.querySelector(
  "#profile-avatar img",
) as HTMLImageElement;
const usernameSpan: HTMLSpanElement = document.createElement("span");
const usernameData: HTMLSpanElement = document.createElement("span");
const displayNameSpan: HTMLSpanElement = document.createElement("span");
const displayNameData: HTMLSpanElement = document.createElement("span");

let firstView: boolean = false;

async function requestProfile() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/users/me", {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      profP.classList.add("grid");
      profP.classList.remove("hidden");
      const buttons = document.getElementById("acc-actions") as HTMLDivElement;
      if (!firstView) {
        console.log("first load");
        usernameSpan.classList.add("font-bold", "text-xl");
        usernameSpan.textContent = "Username:";
        usernameData.classList.add("text-xl");
        usernameData.textContent = data.username;
        usernameDiv.appendChild(usernameSpan);
        usernameDiv.appendChild(document.createTextNode("\u00A0"));
        usernameDiv.appendChild(usernameData);
        displayNameSpan.classList.add("font-bold", "text-xl");
        displayNameSpan.textContent = "Username:";
        displayNameData.classList.add("text-xl");
        displayNameData.textContent = data.displayName;
        displayNameDiv.appendChild(displayNameSpan);
        displayNameDiv.appendChild(document.createTextNode("\u00A0"));
        displayNameDiv.appendChild(displayNameData);
        avatarImg.src = "images/profile/blue.png"; //need to be fixed
        firstView = true;
      } else {
        console.log("second load");
        usernameData.textContent = data.username;
        displayNameData.textContent = data.displayName;
      }
      buttons.classList.add("hidden");
      buttons.classList.remove("flex");
      await requestStats(data.id);
      requestStats(data.id);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const settingsPage: any = document.getElementById("settingsPage");
const settingsUsernameInput = document.getElementById(
  "settings-username",
) as HTMLInputElement;
const settingsDisplayNameInput = document.getElementById(
  "settings-displayName",
) as HTMLInputElement;
const avatarForm: any = document.getElementById("avatar");
const imgIcon: any = document.getElementById("svgIcon");
const avatarInput: any = document.getElementById("avatarImgEdit"); //file
const popup: any = document.getElementById("avatarOptions");
const popUpButton: any = document.getElementById("closePopUp");
const displayNameForm: any = document.getElementById("displayName");
const passwordForm: any = document.getElementById("password");
const previewNewAvatar = document.getElementById(
  "avatar-image",
) as HTMLImageElement; //preview
const existingImgAvatarInput = document.getElementById(
  "existingAvatar",
) as HTMLInputElement;

// When the user clicks on <span> (x), close the modal
popUpButton.addEventListener("click", () => {
  popup.classList.add("hidden");
  popup.classList.remove("block");
});

let pop: boolean = false;
avatarForm.addEventListener("submit", async (event: any) => {
  event.preventDefault();
  console.log("submiut avatar");

  const formData = new FormData();
  if (avatarInput.files.length > 0) {
    formData.append("avatar", avatarInput.files[0]);
    const myRequest = new Request("http://127.0.0.1:3000/users/me/avatar", {
      method: "POST",
      body: formData,
      credentials: "include",
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
        const userDataString: string | null = localStorage.getItem("userData");
        avatarForm.reset();
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          userData.url = data.avatarUrl;
          localStorage.setItem("userData", JSON.stringify(userData));
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
const errorSettingsDisplayName = document.getElementById(
  "settings-displayName_error",
) as HTMLDivElement;

displayNameForm.addEventListener("submit", async (event: any) => {
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

const errorSettingsCurrPass = document.getElementById(
  "settings-current-password_error",
) as HTMLDivElement;
const errorSettingsNewPass = document.getElementById(
  "settings-new-password_error",
) as HTMLDivElement;
passwordForm.addEventListener("submit", async (event: any) => {
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
    newPassword: formData.get("settings-user_new-password"),
  };
  console.log(passwordBody.currentPassword);
  console.log(passwordBody.newPassword);
  const myRequest = new Request(
    "http://127.0.0.1:3000/users/me/change-password",
    {
      method: "PATCH",
      body: JSON.stringify(passwordBody),
      credentials: "include",
      headers: myHeaders,
    },
  );
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
      } else {
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

const deleteAccountButton = document.getElementById(
  "delete-account-button",
) as HTMLButtonElement;

deleteAccountButton.addEventListener("click", async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/users/me", {
    method: "DELETE",
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    // const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      localStorage.clear();
      dropMenuUserDiv.classList.add("hidden");
      dropMenuUserDiv.classList.remove("block");
      dropMenuGuestDiv.classList.add("block");
      dropMenuGuestDiv.classList.remove("hidden");
      logUserHeaderDiv.textContent = "Hello, you!";
      logAvatHeaderDiv.src = "images/avatars/pong_default.png";
      displayPage("welcome");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});

function showPopUp() {
  popup.classList.add("block");
  popup.classList.remove("hidden");
}

function previewImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;
  const preview = document.getElementById("avatar-image") as HTMLImageElement;

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

const friendsList = document.getElementById("friendsList") as HTMLDivElement;
console.log("before list");
let friendListStorage: string[];
friendListStorage = [];
console.log(`after list ${friendListStorage.length}`);

async function requestFriendsList() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/users/me/friends", {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const friends = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      console.log(`before loop length id ${friendListStorage.length}`);
      friendListStorage = [];
      friendsPage.classList.add("flex");
      friendsPage.classList.remove("hidden");
      for (const friend of friends) {
        console.log(`friend id ${friend.id}`);
        friendListStorage.push(friend.id);
        console.log(`length id ${friendListStorage.length}`);
        console.log("it doesnt exist");
        if (!document.querySelector(`[data-friendid="${friend.id}"]`)) {
          const friendDiv = document.createElement("div");
          const friendInfoDiv = document.createElement("div");
          const friendNameDiv = document.createElement("div");
          const friendButtonsDiv = document.createElement("div");
          friendDiv.classList.add("flex", "items-center", "border", "p-2.5");
          friendDiv.dataset.friendid = friend.id;
          friendDiv.dataset.frienddisplayname = friend.displayName;
          friendDiv.dataset.friendurl =
            friend.avatarUrl || "default-avatar.png";
          const friendImg = document.createElement("img");
          friendImg.src = friend.avatarUrl || "default-avatar.png";
          friendImg.classList.add("h-[100px]", "w-[100px]");
          friendDiv.appendChild(friendImg);
          friendInfoDiv.classList.add("ml-2.5", "flex", "flex-col");
          friendNameDiv.classList.add("flex", "items-center", "gap-2");
          friendNameDiv.textContent = friend.displayName;
          friendInfoDiv.appendChild(friendNameDiv);
          friendButtonsDiv.classList.add("flex", "justify-start", "gap-1");
          const friendRemoveButton = document.createElement("button");
          friendRemoveButton.classList.add(
            "flex",
            "h-10",
            "w-[70px]",
            "items-center",
            "justify-center",
            "rounded",
            "border-2",
            "border-blue-950",
            "bg-blue-500",
            "font-bold",
            "text-white",
            "hover:bg-blue-700",
          );
          friendRemoveButton.textContent = "remove";
          friendRemoveButton.type = "button";
          friendRemoveButton.onclick = function () {
            removeFriend(friend.id);
          };
          friendButtonsDiv.appendChild(friendRemoveButton);
          // const friendBlockButton = document.createElement("button");
          // friendBlockButton.classList.add(
          //   "flex",
          //   "h-10",
          //   "w-[70px]",
          //   "items-center",
          //   "justify-center",
          //   "rounded",
          //   "border-2",
          //   "border-blue-950",
          //   "bg-blue-500",
          //   "font-bold",
          //   "text-white",
          //   "hover:bg-blue-700",
          // );
          // friendBlockButton.textContent = "block";
          // friendBlockButton.type = "button";
          // friendBlockButton.onclick = function () {
          //   blockFriend(friend.id);
          // };
          // friendButtonsDiv.appendChild(friendBlockButton);
          friendInfoDiv.appendChild(friendButtonsDiv);
          friendDiv.appendChild(friendInfoDiv);
          friendsList.appendChild(friendDiv);
        }
      }
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

async function addFriend(id: string) {
  const completeUrl: string = "http://127.0.0.1:3000/friends/" + id;
  console.log(completeUrl);
  const myRequest = new Request(completeUrl, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({}),
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      let data;
      if (response.status != 204) {
        data = await response.json(); //to check errors?
      }
      await requestOnlineStatus(id);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const friendsBlockedList = document.getElementById(
  "blockedList",
) as HTMLDivElement;

async function removeFriend(id: string) {
  const completeUrl: string = "http://127.0.0.1:3000/friends/" + id;
  console.log(completeUrl);
  const myRequest = new Request(completeUrl, {
    method: "DELETE",
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      let data;
      if (response.status != 204) {
        data = await response.json(); //to check errors?
      }
      await requestOnlineStatus(id);
      const friend = document.querySelector(
        `[data-friendid="${id}"]`,
      ) as HTMLDivElement;
      console.log(id);
      if (friend) friend.remove();
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

async function blockFriend(id: string) {
  const completeUrl: string = "http://127.0.0.1:3000/blocks/" + id;
  console.log(completeUrl);
  const myRequest = new Request(completeUrl, {
    method: "POST",
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      let data;
      if (response.status != 204) {
        data = await response.json();
      }
      // const friend = document.querySelector(
      //   `[data-friendid="${id}"]`,
      // ) as HTMLDivElement;
      // friend.remove();
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

let blockListStorage: string[];
blockListStorage = [];
async function requestBlockedList() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/users/me/blocks", {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    friendsList.replaceChildren();
    console.log(response);
    const friends = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      friendsPage.classList.add("flex");
      friendsPage.classList.remove("hidden");
      blockListStorage = [];
      for (const friend of friends) {
        blockListStorage.push(friend.id);
        if (!document.querySelector(`[data-friendblockedid="${friend.id}"]`)) {
          const friendBlockedDiv = document.createElement("div");
          const friendBlockedImg = document.createElement("img");
          const friendInfoBlockedDiv = document.createElement("div");
          const friendNameBlockedDiv = document.createElement("div");
          const friendButtonsBlockedDiv = document.createElement("div");
          const friendRemoveBlockedButton = document.createElement("button");
          friendBlockedDiv.classList.add(
            "flex",
            "items-center",
            "border",
            "p-2.5",
          );
          friendBlockedDiv.dataset.friendblockedid = friend.id;
          friendBlockedDiv.dataset.frienddisplayname = friend.displayName;
          friendBlockedDiv.dataset.friendurl = friend.avatarUrl;
          friendBlockedImg.src = friend.avatarUrl || "default-avatar.png";
          friendBlockedImg.classList.add("h-[100px]", "w-[100px]");
          friendBlockedDiv.appendChild(friendBlockedImg);
          friendInfoBlockedDiv.classList.add("ml-2.5", "flex", "flex-col");
          friendNameBlockedDiv.classList.add("flex", "items-center", "gap-2");
          friendNameBlockedDiv.textContent = friend.displayName;
          friendInfoBlockedDiv.appendChild(friendNameBlockedDiv);
          friendButtonsBlockedDiv.classList.add(
            "flex",
            "justify-start",
            "gap-1",
          );
          friendButtonsBlockedDiv.dataset.friendblockedid = friend.id;
          friendRemoveBlockedButton.classList.add(
            "flex",
            "h-10",
            "w-[70px]",
            "items-center",
            "justify-center",
            "rounded",
            "border-2",
            "border-blue-950",
            "bg-blue-500",
            "font-bold",
            "text-white",
            "hover:bg-blue-700",
          );
          friendRemoveBlockedButton.textContent = "unblock";
          friendRemoveBlockedButton.setAttribute("type", "button");
          friendRemoveBlockedButton.onclick = function () {
            unBlockFriend(friend.id);
          };
          friendButtonsBlockedDiv.appendChild(friendRemoveBlockedButton);
          friendInfoBlockedDiv.appendChild(friendButtonsBlockedDiv);
          friendBlockedDiv.appendChild(friendInfoBlockedDiv);
          friendsBlockedList.appendChild(friendBlockedDiv); // Append the new block to the list
        }
      }
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

async function unBlockFriend(id: string) {
  const completeUrl: string = "http://127.0.0.1:3000/blocks/" + id;
  console.log(completeUrl);
  const myRequest = new Request(completeUrl, {
    method: "DELETE",
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      let data;
      if (response.status != 204) {
        data = await response.json();
      }
      const friend = document.querySelector(
        `[data-friendblockedid="${id}"]`,
      ) as HTMLDivElement;
      if (friend) friend.remove();
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}
const matchesDiv = document.getElementById("list-matches") as HTMLDivElement;

async function requestStats(id: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(`http://127.0.0.1:3000/profile/${id}/stats`, {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      const data = await response.json();
      while (matchesDiv.firstChild) {
        matchesDiv.removeChild(matchesDiv.firstChild);
      }
      for (const match of data.matches) {
        const singleMatch = document.createElement("div");
        singleMatch.classList.add("grid", "w-full", "grid-cols-3", "border");
        const opponent = document.createElement("div");
        const date = document.createElement("div");
        const score = document.createElement("div");

        opponent.classList.add(
          "flex",
          "items-center",
          "justify-center",
          "border",
        );
        date.classList.add("flex", "items-center", "justify-center", "border");
        score.classList.add("flex", "items-center", "justify-center", "border");

        opponent.textContent = match.opponentAlias;
        date.textContent = match.date;
        score.textContent = match.scoreMeOther;

        singleMatch.appendChild(opponent);
        singleMatch.appendChild(date);
        singleMatch.appendChild(score);
        matchesDiv.appendChild(singleMatch);
      }
      // createPieChart(data.stats.data.winRatePercent, data.stats.lossRatePercent);
      // createBarChart(data.stats.place1, data.stats.place2, data.stats.place3);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}
