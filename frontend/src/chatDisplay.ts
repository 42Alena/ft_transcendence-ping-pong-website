//HTML elements
const listDmsDiv: any = document.getElementById("list-dms");
const bubbleDiv: any = document.getElementById("bubble");
const SendEl: any = document.getElementById("send-button");
const listUsersDiv: any = document.getElementById("list-users");
const conversationDiv: any = document.getElementById("conversation");
const chatInfoDiv: any = document.getElementById("chat-info");
const startConvDiv: any = document.getElementById("start-chat");
const userProfileDiv: any = document.getElementById("userProfile");
let historyConversation: any;
let currChatId: string;

//tabs chat/user chat left
const chatTab: any = document.getElementById("defaultOpen");
// chatTab.click();

function displayList(event: any, text: string) {
  var i, tablinks;

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  if (text == "chat") {
    listDmsDiv.classList.add("flex");
    listDmsDiv.classList.remove("hidden");
    listUsersDiv.classList.add("hidden");
    listUsersDiv.classList.remove("flex");
    requestChats();
  } else {
    listDmsDiv.classList.add("hidden");
    listDmsDiv.classList.remove("flex");
    listUsersDiv.classList.add("flex");
    listUsersDiv.classList.remove("hidden");
    requestUsers();
  }
  event.currentTarget.className += " active";
}

//display
function addBubble(role: string, content: string, timeStamp : HTMLDivElement) {
  const newBubble = document.createElement("div");
  const newContent = document.createTextNode(content);
  newBubble.append(newContent);
  if (role == "sender") {
    newBubble.className = "chat-right__bubble-sent border";
  } else {
    newBubble.className = "chat-right__bubble-received border";
  }
  historyConversation.append(newBubble);
  historyConversation.append(timeStamp);
  bubbleDiv.appendChild(historyConversation);
}

function addBubbleTournament(role: string, content: string, timeStamp : HTMLDivElement) {
  const newBubble = document.createElement("div");
  const newContent = document.createTextNode(content);
  newBubble.append(newContent);
  newBubble.classList.add("bg-yellow-200", "block", "h-auto", "max-w-[75%]", "relative", "border");
  if (role == "sender") {
    newBubble.classList.add("chat-right__bubble-sent-time", "bg-yellow-200");
  } else {
    newBubble.classList.add("chat-right__bubble-received-time", "bg-yellow-200");
  }
  historyConversation.append(newBubble);
  historyConversation.append(timeStamp);
  bubbleDiv.appendChild(historyConversation);
}

function fillConversationInfo(name: string, avatar: string) {
  const existingContactDiv = document.getElementById("contact-name");
  const existingAvatarDiv = document.getElementById("contact-avatar");

  if (existingContactDiv) {
    existingContactDiv.remove();
  }
  if (existingAvatarDiv) {
    existingAvatarDiv.remove();
  }

  const contactDiv = document.createElement("div");
  const avatarDiv = document.createElement("div");
  const avatarImg = document.createElement("img");

  contactDiv.className = "chat-right__header-contact";
  contactDiv.textContent = name;
  contactDiv.setAttribute("id", "contact-name");
  chatInfoDiv.appendChild(contactDiv);

  avatarDiv.className = "chat-right__header-avatar";
  avatarDiv.setAttribute("id", "contact-avatar");
  avatarDiv.classList.add("w-[45px]", "h-[45px]", "overflow-hidden", "p-1.25");
  avatarImg.src = avatar;
  avatarImg.classList.add("w-full", "h-full", "object-cover");
  avatarDiv.appendChild(avatarImg);
  chatInfoDiv.appendChild(avatarDiv);

  conversationDiv.classList.add("flex");
  conversationDiv.classList.remove("hidden");
  startConvDiv.hidden = true;
}

