const listUsers = document.getElementById("list-users") as HTMLDivElement;
async function requestChat() {
	const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/chat/conversations", {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    // const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

async function requestUsers() {
	const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request("http://127.0.0.1:3000/users", {
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
		const users = await response.json();
		for (const user of users) {
		if (!document.querySelector(`[data-userid="${user.id}"]`)) {
		const newDiv = document.createElement("div");
		const avatDiv = document.createElement("div");
		const avatImg = document.createElement("img");
		avatImg.src = user.avatarUrl;
		avatImg.width = 30;
		avatImg.height = 30;
		avatDiv.appendChild(avatImg);
		newDiv.appendChild(avatDiv);
		newDiv.dataset.userid = user.id;
		newDiv.dataset.userdisplayname = user.displayName;
		newDiv.dataset.useravatarurl =
			user.avatarUrl || "default-avatar.png";
		const userDiv = document.createElement("div");
		userDiv.setAttribute("id", user.displayName);
		const newContent = document.createTextNode(user.displayName);
		userDiv.appendChild(newContent);
		newDiv.appendChild(userDiv);
		newDiv.onclick = function () {
			requestUserProfile(user.id);
		};
		newDiv.classList.add(
			"flex",
			"items-center",
			"gap-2.5",
			"border",
			"p-2.5",
			"bg-white",
		);
		listUsers.append(newDiv);
		}
		}
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const usernameOSpan: HTMLSpanElement = document.createElement("span");
const usernameOData: HTMLSpanElement = document.createElement("span");
const displayNameOSpan: HTMLSpanElement = document.createElement("span");
const displayNameOData: HTMLSpanElement = document.createElement("span");
const userProfile = document.getElementById("userProfile") as HTMLDivElement;
const startConversationDiv = document.getElementById("start-chat") as HTMLDivElement;
const buttonsOptions = document.getElementById("acc-options") as HTMLDivElement;
// const addandRemoveUserButton: any = document.getElementById(
//   "add-remove-friend__header",
// );
// const blockandUnblockButton: any = document.getElementById(
//   "block-unblock-friend__header",
// );

async function requestUserProfile(id : string)
{
	const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(`http://127.0.0.1:3000/users/${id}`, {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    let friendFlag : boolean = false;
    let blockFlag : boolean = false;
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
	  const user = await response.json();
        while (displayNameDiv.firstChild) {
            displayNameDiv.removeChild(displayNameDiv.firstChild);
        }
		startConversationDiv.classList.add("hidden");
		startConversationDiv.classList.remove("flex");
		userProfile.dataset.profileuserid = user.id;
		userProfile.dataset.profileusername = user.displayName;
		userProfile.dataset.profileuseravatar = user.avatarUrl;
    // console.log(`before request ${friendListStorage.length}`);
    await requestFriendsList();
    // console.log(`after request ${friendListStorage.length}`);
    for (let i = 0; i < friendListStorage.length; i++)
    {
      if (user.id == friendListStorage[i])
      {
        profileAddRemFriend.textContent = "Remove";
        friendFlag = true;
        console.log(`friend: ${friendListStorage[i]}`);
        break;
      }
    }
    if (friendFlag)
    {
      profileAddRemFriend.textContent = "Remove";
      isFriend = true;
    }
    else
    {
      profileAddRemFriend.textContent = "Add";
      isFriend = false;
    }
    await requestBlockedList();
    for (let i = 0; i < blockListStorage.length; i++)
    {
      if (user.id == blockListStorage[i])
      {
        blockFlag = true;
        console.log(`blocked: ${blockListStorage[i]}`);
        break;
      }
    }
    if (blockFlag)
    {
      profileBlockUnbFriend.textContent = "Unblock";
      isBlocked = true;
    }
    else
    {
      profileBlockUnbFriend.textContent = "Block";
      isBlocked = false;
    }
		usernameDiv.classList.add("hidden");
		usernameDiv.classList.remove("flex");
    displayNameOSpan.classList.add("font-bold", "text-xl");
    displayNameOSpan.textContent = "Username:";
    displayNameOData.classList.add("text-xl");
    displayNameOData.textContent = user.displayName;
    displayNameDiv.appendChild(displayNameOSpan);
    displayNameDiv.appendChild(document.createTextNode("\u00A0"));
    displayNameDiv.appendChild(displayNameOData);
    avatarImg.src = user.avatarUrl; //need to be fixed
		userProfile.append(profP);
		userProfile.classList.add("grid");
		userProfile.classList.remove("hidden");
		profP.classList.remove("hidden");
		profP.classList.add("grid");
		buttonsOptions.dataset.userid = user.id;
		buttonsOptions.dataset.username = user.displayName;
		buttonsOptions.dataset.avatar = user.avatarUrl;
		buttonsOptions.classList.add("flex");
		buttonsOptions.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}