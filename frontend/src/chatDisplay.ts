//HTML elements
const listDmsDiv : any = document.getElementById("list-dms");
const bubbleDiv : any = document.getElementById("bubble");
const inputEl : any = document.getElementById("text-box");
const SendEl : any = document.getElementById("send-button");
const contactChatEl: any = document.getElementById("contact");
let currChatId : string;

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
	bubbleDiv.append(newBubble);
}

function dispalyConversationHistory(id : string, list : Chat[]) {
	currChatId = id;
	bubbleDiv.innerHTML = "";
	contactChatEl.innerHTML = "";
	for (let step = 0; step < list.length; step++)
	{
		if (list[step].id == id)
		{
			let historyMex : { sender: boolean; receiver: boolean; content: string }[] = list[step].messages;
			const newHeaderContact = document.createElement("h2");
			const newContent = document.createTextNode(list[step].recipientName);
			newHeaderContact.append(newContent);
			contactChatEl.appendChild(newHeaderContact);
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

function addElement(name : string, id : string) {
  
	const newDiv = document.createElement("div");
    const newContent = document.createTextNode(name);
	newDiv.setAttribute('id', id);
	newDiv.onclick = function() { dispalyConversationHistory(newDiv.id, chatList)};
	newDiv.appendChild(newContent);
    newDiv.className = "chat-left__list-dms-item border";
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
chatList.push(new Chat('1', "chat " + 1, "url", messages1));
chatList.push(new Chat('2', "chat " + 2, "url", messages2));

//create chat box in left sidebar
for (let step = 0; step < chatList.length; step++) {
	addElement(chatList[step].recipientName, chatList[step].id);
}
//events
inputEl.addEventListener("keydown", (event : KeyboardEvent) => {
	if (event.key == "Enter")
	{
		captureInput();
	}
});