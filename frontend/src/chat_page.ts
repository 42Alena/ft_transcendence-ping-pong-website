const listDmsDiv : any = document.getElementById("list-dms");
const bubbleDiv : any = document.getElementById("bubble");

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

function addElement(name : string, id : string) {
  
	const newDiv = document.createElement("div");
    const newContent = document.createTextNode(name);
	newDiv.setAttribute('id', id);
	newDiv.onclick = function() { dispalyConversationHistory(newDiv.id, chatList)};
	newDiv.appendChild(newContent);
    newDiv.className = "chat-left__list-dms-item border";
    listDmsDiv.append(newDiv);
}

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
	bubbleDiv.innerHTML = "";
	for (let step = 0; step < list.length; step++)
	{
		if (list[step].id == id)
		{
			let historyMex : { sender: boolean; receiver: boolean; content: string }[] = list[step].messages;
			for (let step = 0; step < historyMex.length; step++)
			{
				if (historyMex[step].sender == true)
					addBubble("sender", historyMex[step].content);
				else
					addBubble("recv", historyMex[step].content);
			}
		}
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

for (let step = 0; step < chatList.length; step++) {
	addElement(chatList[step].recipientName, chatList[step].id);
}


