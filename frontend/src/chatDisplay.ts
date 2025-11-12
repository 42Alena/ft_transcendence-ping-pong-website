//HTML elements
const listDmsDiv : any = document.getElementById("list-dms");
const bubbleDiv : any = document.getElementById("bubble");
const inputEl : any = document.getElementById("text-box");
const SendEl : any = document.getElementById("send-button");
const listUsersDiv : any = document.getElementById("list-users");
const conversationDiv : any = document.getElementById("conversation");
const chatInfoDiv : any = document.getElementById("chat-info");
const startConvDiv : any = document.getElementById("start-chat");
const userProfileDiv : any = document.getElementById("userProfile");
let historyConversation : any;
let currChatId : string;

//tabs chat/user chat left
const chatTab : any = document.getElementById("defaultOpen");
chatTab.click();

function displayList(event : any, text : string) {
  var i, tablinks;

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
   if (text == 'chat')
  {
	listDmsDiv.classList.add("flex");
	listDmsDiv.classList.remove("hidden");
	listUsersDiv.classList.add("hidden");
	listUsersDiv.classList.remove("flex");

  }
  else
  {
	listDmsDiv.classList.add("hidden");
	listDmsDiv.classList.remove("flex");
	listUsersDiv.classList.add("flex");
	listUsersDiv.classList.remove("hidden");
  }
  event.currentTarget.className += " active";
}

//display
function addBubble(role : string, content : string)
{
	const newBubble = document.createElement("div");
	const newContent = document.createTextNode(content);
	newBubble.append(newContent);
	if (role == "sender")
	{
		newBubble.className = "chat-right__bubble-sent border";
	}
	else
	{
		newBubble.className = "chat-right__bubble-received border";
	}
	historyConversation.append(newBubble);
	bubbleDiv.appendChild(historyConversation);
}

function dispalyConversationHistory(id : string, list : Chat[], name : string, avatar : string) {

	userProfileDiv.classList.add("hidden");
	userProfileDiv.classList.remove("block");
	fillConversationInfo(name, avatar);
	currChatId = id;
	const existingBubble = document.getElementById('history-conv');
	if (existingBubble)
		existingBubble.remove();
	historyConversation = document.createElement('div');
	historyConversation.className = "chat-right__bubble border";
	historyConversation.setAttribute('id', 'history-conv');
	for (let step = 0; step < list.length; step++)
	{
		if (list[step].id == id)
		{
			let historyMex : { sender: boolean; receiver: boolean; content: string }[] = list[step].messages;
			for (let step = 0; step < historyMex.length; step++)
			{
				if (historyMex[step].receiver == true)
					addBubble("sender", historyMex[step].content);
				else
					addBubble("recv", historyMex[step].content);
			}
		}
	}
}

function fillConversationInfo(name : string, avatar : string) {

	const existingContactDiv = document.getElementById('contact-name');
	const existingAvatarDiv = document.getElementById('contact-avatar');

	if (existingContactDiv)
	{
		existingContactDiv.remove();
	}
	if (existingAvatarDiv)
	{
		existingAvatarDiv.remove();
	}

	const contactDiv = document.createElement("div");
	const avatarDiv = document.createElement("div");
	const avatarImg = document.createElement("img");

	contactDiv.className = "chat-right__header-contact";
	contactDiv.textContent = name;
	contactDiv.setAttribute('id', 'contact-name');
	chatInfoDiv.appendChild(contactDiv);

	avatarDiv.className = "chat-right__header-avatar";
	avatarDiv.setAttribute('id', 'contact-avatar');
	avatarDiv.classList.add("w-[45px]", "h-[45px]", "overflow-hidden", "p-1.25");
	// avatarDiv.style.width = '45px';
	// avatarDiv.style.height = '45px';
	// avatarDiv.style.overflow = 'hidden';
	// avatarDiv.style.padding = '5px';
	avatarImg.src = avatar;
	avatarImg.classList.add("w-full", "h-full", "object-cover")
	// avatarImg.style.width = '100%';
	// avatarImg.style.height = '100%';
	// avatarImg.style.objectFit = 'cover';
	avatarDiv.appendChild(avatarImg);
	chatInfoDiv.appendChild(avatarDiv);

	conversationDiv.classList.add("flex");
	conversationDiv.classList.remove("hidden");
	startConvDiv.classList.add("hidden");
	startConvDiv.classList.remove("flex");
}

function addElement(name : string, id : string, avatar : string) {
  
	const newDiv = document.createElement("div");

	const avatDiv = document.createElement("div");
	const avatImg = document.createElement("img");
	avatImg.src = avatar;
	avatImg.width = 30;
	avatImg.height = 30;
	avatDiv.appendChild(avatImg);
	newDiv.appendChild(avatDiv);

	const userDiv = document.createElement("div");
	userDiv.setAttribute('id', name);
    const newContent = document.createTextNode(name);
	userDiv.appendChild(newContent);
	newDiv.appendChild(userDiv);
	newDiv.onclick = function() { dispalyConversationHistory(id, chatList, name, avatar)};
	newDiv.classList.add("flex", "items-center", "gap-2.5", "border", "p-2.5", "bg-white");
    listDmsDiv.append(newDiv);
}

function storeNewMessage(id : string, mess : string)
{
	for (let step = 0; step < chatList.length; step++)
	{
		if (chatList[step].id == id)
		{
			let newMess : { sender: boolean; receiver: boolean; content: string } = {sender : true, receiver : false , content : mess};
			chatList[step].messages.push(newMess);
			break;
		}
	}
}

function captureInput() {
	const mess = inputEl.value;
	addBubble("recv", mess);
	storeNewMessage(currChatId, mess);
	inputEl.value = '';
}


//fake chat data structure - testing
class Chat {
	id : string;
	recipientName : string;
	avatar : string;
	messages : {sender : boolean; receiver: boolean; content : string}[]

	constructor (id : string, rec : string, avatar : string, messages : {sender : boolean; receiver: boolean; content : string}[]) {
		this.id = id;
		this.recipientName = rec;
		this.avatar = avatar;
		this.messages = messages;
	}
}

let chatList : Chat[] = [];
let messages1: { sender: boolean; receiver: boolean; content: string }[] = [];
let message1 : { sender: boolean; receiver: boolean; content: string } = {sender : true, receiver : false , content : 'Hello there'};
let message2 : { sender: boolean; receiver: boolean; content: string } = {sender : false, receiver : true , content : 'hi'};
let message3 : { sender: boolean; receiver: boolean; content: string } = {sender : false, receiver : true , content : 'how are you?'};
messages1.push(message1);
messages1.push(message2);
messages1.push(message3);
let messages2:  { sender: boolean; receiver: boolean; content: string }[] = [];
let message4 : { sender: boolean; receiver: boolean; content: string } = {sender : false, receiver : true , content : 'hallo'};
let message5 : { sender: boolean; receiver: boolean; content: string } = {sender : true, receiver : false , content : 'guten abend'};
let message6 : { sender: boolean; receiver: boolean; content: string } = {sender : true, receiver : false , content : 'tschussi'};
messages2.push(message4);
messages2.push(message5);
messages2.push(message6);
chatList.push(new Chat('1', "Mafalda ", "images/profile/purple.png", messages1));
chatList.push(new Chat('2', "Kevin", "images/profile/green.png", messages2));

//create chat box in left sidebar
for (let step = 0; step < chatList.length; step++) {
	addElement(chatList[step].recipientName, chatList[step].id, chatList[step].avatar);
}
//events
inputEl.addEventListener("keydown", (event : KeyboardEvent) => {
	if (event.key == "Enter")
	{
		captureInput();
	}
});

function displayProf() {
	startConvDiv.classList.add("hidden");
	startConvDiv.classList.remove("flex");
	conversationDiv.classList.add("hidden");
	conversationDiv.classList.remove("flex");
	blockedList.classList.add("hidden");
	blockedList.classList.remove("flex");
	friendList.classList.add("flex");
	friendList.classList.remove("hidden");
	displayUserProfile();
	userProfileDiv.appendChild(profP);
	userProfileDiv.classList.add("block");
	userProfileDiv.classList.remove("hidden");
	profP.classList.add("grid");
	profP.classList.remove("hidden")
	friendsPage.classList.add("flex");
	friendsPage.classList.remove("hidden");
	toggle = true;
}