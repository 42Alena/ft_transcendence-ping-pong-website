const listUsers = document.getElementById("list-users") as HTMLDivElement;
const listChats = document.getElementById("list-dms") as HTMLDivElement;

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
          newDiv.dataset.useravatarurl = user.avatarUrl || "images/avatars/pong_default.png";
          const userDiv = document.createElement("div");
          userDiv.setAttribute("id", user.displayName);
          const newContent = document.createTextNode(user.displayName);
          userDiv.appendChild(newContent);
          newDiv.appendChild(userDiv);
          newDiv.onclick = function () {
            requestUserProfile(user.id);
          };
          const tabChat = document.getElementsByClassName("chat-div");
          newDiv.classList.add(
            "chat-div",
            "flex",
            "items-center",
            "gap-2.5",
            "border",
            "p-2.5",
            "bg-white",
            "transition",
            "duration-300",
            "outline-none",
          );
          listUsers.append(newDiv);
          for (let i = 0; i < tabChat.length; i++) {
            tabChat[i].addEventListener("click", function () {
              console.log(`user: ${user.displayName}`);
              for (let j = 0; j < tabChat.length; j++) {
                tabChat[j].classList.remove("active"); // Base active class for clicked element
              }
              tabChat[i].classList.add("active");
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

async function requestChats() {  
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
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      const users = await response.json();
      for (const chat_user of users) {
        console.log(`${chat_user.userId}`);
        console.log(`${chat_user.displayName}`);
        console.log(`${chat_user.avatarUrl}`);
        if (!document.querySelector(`[data-chatid="${chat_user.userId}"]`)) {
          const newDiv = document.createElement("div");
          const avatDiv = document.createElement("div");
          const avatImg = document.createElement("img");
          avatImg.src = chat_user.avatarUrl;
          avatImg.width = 30;
          avatImg.height = 30;
          avatDiv.appendChild(avatImg);
          newDiv.appendChild(avatDiv);
          newDiv.dataset.chatid = chat_user.userId;
          newDiv.dataset.chatdisplayname = chat_user.displayName;
          newDiv.dataset.chatavatarurl =
            chat_user.avatarUrl || "images/avatars/pong_default.png";
          const userDiv = document.createElement("div");
          userDiv.setAttribute("id", chat_user.displayName);
          const newContent = document.createTextNode(chat_user.displayName);
          userDiv.appendChild(newContent);
          newDiv.appendChild(userDiv);
          newDiv.addEventListener("click", event => {
            event.preventDefault();
            const state = {page: "chat", userId: chat_user.userId, userDisplayName: chat_user.displayName, userAvatarUrl: chat_user.avatarUrl};
            history.pushState(state, "");
            requestConversation(chat_user.userId, chat_user.displayName, chat_user.avatarUrl);
          })
          const tabChat = document.getElementsByClassName("chat-div");
          newDiv.classList.add(
            "chat-div",
            "flex",
            "items-center",
            "gap-2.5",
            "border",
            "p-2.5",
            "bg-white",
            "transition",
            "duration-300",
            "outline-none",
          );
          listChats.append(newDiv);
          for (let i = 0; i < tabChat.length; i++) {
            tabChat[i].addEventListener("click", function () {
              for (let j = 0; j < tabChat.length; j++) {
                tabChat[j].classList.remove("active"); // Base active class for clicked element
              }
              tabChat[i].classList.add("active");
            });
          }
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
const startConversationDiv = document.getElementById(
  "start-chat",
) as HTMLDivElement;
const profileOptions = document.getElementById("acc-options") as HTMLDivElement;
const buttons = document.getElementById("acc-actions") as HTMLDivElement;

async function requestUserProfile(id: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let isMe = false;
  const myRequest = new Request(`http://127.0.0.1:3000/users/${id}`, {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    let friendFlag: boolean = false;
    let blockFlag: boolean = false;
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      const user = await response.json();
      conversationDiv.hidden = true;
      startConversationDiv.hidden = true;
      userProfile.hidden = false;
      userProfile.dataset.profileuserid = user.id;
      userProfile.dataset.profileusername = user.displayName;
      userProfile.dataset.profileuseravatar = user.avatarUrl;
      if (localStorage.getItem("userData")) {
        const userDataString: string | null = localStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log(`${userData.displayName} - ${user.id} checking myself`);
          if (userData.displayName == user.displayName)
            isMe = true;
        }
      }
      await requestFriendsList();
      for (let i = 0; i < friendListStorage.length; i++) {
        if (user.id == friendListStorage[i]) {
          profileAddRemFriend.textContent = "Remove";
          friendFlag = true;
          console.log(`friend: ${friendListStorage[i]}`);
          break;
        }
      }
      await requestOnlineStatus(id);
      if (friendFlag) {
        profileAddRemFriend.textContent = "Remove";
        isFriend = true;
      } else {
        profileAddRemFriend.textContent = "Add";
        isFriend = false;
      }
      await requestBlockedList();
      for (let i = 0; i < blockListStorage.length; i++) {
        if (user.id == blockListStorage[i]) {
          blockFlag = true;
          console.log(`blocked: ${blockListStorage[i]}`);
          break;
        }
      }
      if (blockFlag) {
        profileBlockUnbFriend.textContent = "Unblock";
        isBlocked = true;
      } else {
        profileBlockUnbFriend.textContent = "Block chat";
        isBlocked = false;
      }
      while (usernameDiv.firstChild)
          usernameDiv.removeChild(usernameDiv.firstChild)
      while (displayNameDiv.firstChild)
          displayNameDiv.removeChild(displayNameDiv.firstChild)
      const userNameCheck = document.getElementById("profile-user");
      if (userNameCheck) userNameCheck.remove();
      const displayNameCheck = document.getElementById("profile-display");
      if (displayNameCheck) displayNameCheck.remove();
      const whiteSpace = document.createTextNode("\u00A0");
      if (usernameDiv.contains(whiteSpace)) usernameDiv.removeChild(whiteSpace);
      if (displayNameDiv.contains(whiteSpace)) displayNameDiv.removeChild(whiteSpace);
      usernameDiv.hidden=true;
      displayNameOSpan.classList.add("font-bold", "text-xl");
      displayNameSpan.setAttribute("id", "profile-display");
      displayNameOSpan.textContent = "Display name:";
      displayNameOData.classList.add("text-xl");
      displayNameOData.textContent = user.displayName;
      displayNameDiv.appendChild(displayNameOSpan);
      displayNameDiv.appendChild(displayNameOData);
      avatarImg.src = user.avatarUrl; //need to be fixed
      userProfile.append(profP);
      userProfile.classList.add("grid");
      userProfile.classList.remove("hidden");
      profP.hidden = false;
      console.log("profile user");
      profileOptions.dataset.userid = user.id;
      profileOptions.dataset.username = user.displayName;
      profileOptions.dataset.avatar = user.avatarUrl;
      profileOptions.classList.add("flex");
      profileOptions.classList.remove("hidden");
      buttons.classList.add("flex");
        buttons.classList.remove("hidden");
      if (isMe)
      {
        buttons.classList.add("hidden");
        buttons.classList.remove("flex");
      }
      await requestStats(id);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const sendMessageButton = document.getElementById(
  "send-message__header",
) as HTMLButtonElement;

sendMessageButton.addEventListener("click", async () => {
  //open chat
  const buttonsDiv = document.getElementById(
    "acc-options",
  ) as HTMLButtonElement;
  const conversationDiv = document.getElementById(
    "conversation",
  ) as HTMLDivElement;
  conversationDiv.hidden = false;
  const id = buttonsDiv.dataset.userid as string;
  const displayName = buttonsDiv.dataset.username as string;
  const avatarUrl = buttonsDiv.dataset.avatar as string;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(
    `http://127.0.0.1:3000/chat/conversations/${id}`,
    {
      method: "GET",
      headers: myHeaders,
      credentials: "include",
    },
  );
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      const messages = await response.json();
      const userDataString = localStorage.getItem("userData") as string;
      const userData = JSON.parse(userDataString);
      const receiverId = id;
      const inputHiddenForm = document.getElementById(
        "recv-id",
      ) as HTMLInputElement;
      if (receiverId)
        inputHiddenForm.value = receiverId;
      const existingBubble = document.getElementById("history-conv");
      if (existingBubble) existingBubble.remove();
      historyConversation = document.createElement("div");
      historyConversation.className = "chat-right__bubble border";
      historyConversation.setAttribute("id", "history-conv");

      for (const message of messages) {
        const timeStampMess = document.createElement("div");
        const timestamp: number = message.createdAt;
        const milliseconds: number = timestamp * 1000;
        const date: Date = new Date(milliseconds);
        const readableTime: string = date.toLocaleString();
        timeStampMess.textContent = readableTime;
          console.log(
          `send: ${message.senderId} - receive: ${message.receiverId}`,
        );
        if (message.type == "PrivateGameInviteMessage") {
          console.log("change style");
          timeStampMess.classList.add(
            "text-sm",
            "chat-right__bubble-sent-time",
          );
          if (message.senderId != userData.id) {
            timeStampMess.classList.add(
              "text-sm",
              "chat-right__bubble-sent-time",
            );
            addBubbleTournament("sender", message.content, timeStampMess);
          } else {
            timeStampMess.classList.add(
              "text-sm",
              "chat-right__bubble-received-time",
            );
            addBubbleTournament("recv", message.content, timeStampMess);
          }
          continue;
        }
        if (message.senderId == userData.id) {
          timeStampMess.classList.add(
            "text-sm",
            "chat-right__bubble-received-time",
          );
          addBubble("recv", message.content, timeStampMess);
        } else {
          timeStampMess.classList.add(
            "text-sm",
            "chat-right__bubble-sent-time",
          );
          addBubble("sender", message.content, timeStampMess);
        }
      }
      //remove profile
      const userProfileDiv = document.getElementById(
        "userProfile",
      ) as HTMLDivElement;
      if (userProfileDiv)
        while (userProfileDiv.firstChild) {
          userProfileDiv.removeChild(userProfileDiv.firstChild);
        }
      userProfileDiv.classList.add("hidden");
      userProfileDiv.classList.remove("flex");
      console.log(displayName, avatarUrl);
      fillConversationInfo(displayName, avatarUrl);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});

const messageForm = document.getElementById("message") as HTMLFormElement;

messageForm.addEventListener("submit", async (event: any) => {
  event.preventDefault();
  console.log("submit message");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(messageForm);

  const messageBody = {
    receiverId: formData.get("receiverId") as string,
    content: formData.get("input-chat") as string,
  };
  console.log(messageBody.receiverId);
  const myRequest = new Request("http://127.0.0.1:3000/chat/messages", {
    method: "POST",
    body: JSON.stringify(messageBody),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      const inputMessage = document.getElementById(
        "textArea",
      ) as HTMLInputElement;
      inputMessage.value = "";
      const timeStampDiv = document.createElement("div") as HTMLDivElement;
      const currentDate = new Date();
      const readableTimestamp = currentDate.toLocaleString();
      timeStampDiv.textContent = readableTimestamp;
      timeStampDiv.classList.add("text-sm", "chat-right__bubble-received-time");
      addBubble("recv", messageBody.content, timeStampDiv);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});

async function requestConversation(
  id: string,
  displayName: string,
  avatarUrl: string,
) {
  console.log(`request chat for ${id}`);
  conversationDiv.hidden = false;
  const chatDisplay = document.getElementById("chatDisplay") as HTMLDivElement;
  if (chatDisplay.hidden)
    chatDisplay.hidden = false;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(
    `http://127.0.0.1:3000/chat/conversations/${id}`,
    {
      method: "GET",
      headers: myHeaders,
      credentials: "include",
    },
  );
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      const messages = await response.json();
      const userDataString = localStorage.getItem("userData") as string;
      const userData = JSON.parse(userDataString);
      const receiverId = id;
      const inputHiddenForm = document.getElementById(
        "recv-id",
      ) as HTMLInputElement;
      if (receiverId)
        inputHiddenForm.value = receiverId;
      const existingBubble = document.getElementById("history-conv");
      if (existingBubble)
        existingBubble.remove();
      historyConversation = document.createElement("div");
      historyConversation.className = "chat-right__bubble border";
      historyConversation.setAttribute("id", "history-conv");

      for (const message of messages) {
        const timeStampMess = document.createElement("div");
        const timestamp: number = message.createdAt;
        const milliseconds: number = timestamp * 1000;
        const date: Date = new Date(milliseconds);
        const readableTime: string = date.toLocaleString();
        timeStampMess.textContent = readableTime;
        if (message.type == "PrivateGameInviteMessage") {
          console.log("change style");
          if (message.senderId != userData.id) {
            timeStampMess.classList.add(
              "text-sm",
              "chat-right__bubble-sent-time",
            );
            addBubbleTournament("sender", message.content, timeStampMess);
          } else {
            timeStampMess.classList.add(
              "text-sm",
              "chat-right__bubble-received-time",
            );
            addBubbleTournament("recv", message.content, timeStampMess);
          }
          continue;
        }
        if (message.senderId == userData.id) {
          timeStampMess.classList.add(
            "text-sm",
            "chat-right__bubble-received-time",
          );
          addBubble("recv", message.content, timeStampMess);
        } else {
          timeStampMess.classList.add(
            "text-sm",
            "chat-right__bubble-sent-time",
          );
          addBubble("sender", message.content, timeStampMess);
        }
      }
      //remove profile
      const userProfileDiv = document.getElementById(
        "userProfile",
      ) as HTMLDivElement;
      if (userProfileDiv)
        while (userProfileDiv.firstChild) {
          userProfileDiv.removeChild(userProfileDiv.firstChild);
        }
      userProfile.hidden=true;
      console.log(displayName, avatarUrl);
      //header
      fillConversationInfo(displayName, avatarUrl);
      //swtich tab to chats
      displayList({ currentTarget: chatTab }, "chat");
      //highlight current chat
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

const invitePlayForm = document.getElementById("invite") as HTMLFormElement;

invitePlayForm.addEventListener("submit", async (event: any) => {
  event.preventDefault();
    const buttonsDiv = document.getElementById(
    "acc-options",
  ) as HTMLButtonElement;
  const inviteInputId = document.getElementById("invite-recv-id") as HTMLInputElement;
  inviteInputId.value = buttonsDiv.dataset.userid as string;
  console.log("send invitation message");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(invitePlayForm);

  const invited = {
    receiverId: formData.get("inviteRecvId") as string,
  };
  console.log(invited.receiverId);
  const myRequest = new Request("http://127.0.0.1:3000/chat/messages/game-invite", {
    method: "POST",
    body: JSON.stringify(invited),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
       console.log(response);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});
const statusUser = document.getElementById("status") as HTMLDivElement;

async function requestOnlineStatus(id : string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(`http://127.0.0.1:3000/users/${id}/status`, {
    method: "GET",
    headers: myHeaders,
    credentials: "include",
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const status = await response.json();
    console.log(`status: ${status.status}`);
    if (!response.ok) {
      while (statusUser.firstChild) {
            statusUser.removeChild(statusUser.firstChild);}
      throw new Error(`Error ${response.status}`);
    } else {
       while (statusUser.firstChild) {
            statusUser.removeChild(statusUser.firstChild);}
      if (status.status == "online")
      {
        const setStatus = document.createElement("div");
        const circle = document.createElement("div");
        circle.classList.add("ml-[5px]", "h-[15px]", "w-[15px]", "rounded-full", "border-2", "border-black", "bg-green-700");
        setStatus.textContent = status.status;
        statusUser.appendChild(circle);
        statusUser.appendChild(setStatus);
        statusUser.classList.add("flex");
        statusUser.classList.remove("hidden");
      }
      else if (status.status == "offline")
      {
        console.log("here");
        const setStatus = document.createElement("div");
        const circle = document.createElement("div");
        circle.classList.add("ml-[5px]", "h-[15px]", "w-[15px]", "rounded-full", "border-2", "border-black", "bg-grey-700");
        setStatus.textContent = status.status;
        statusUser.appendChild(circle);
        statusUser.appendChild(setStatus);
        statusUser.classList.add("flex");
        statusUser.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}