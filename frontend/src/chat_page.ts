const currentDiv : any = document.getElementById("list-dms");

class chatPrevInfo {
	id : number;
	recipientName : string;
	avatar : string;

	constructor (id : number, rec : string, avatar : string) {
		this.id = id;
		this.recipientName = rec;
		this.avatar = avatar;
	}
}

function addElement(name : string) {
  
	const newDiv = document.createElement("div");
    const newContent = document.createTextNode(name);
	newDiv.appendChild(newContent);
    newDiv.className = "chat-left__list-dms-item border";
    currentDiv.append(newDiv);
}

let chatPrevList : chatPrevInfo[] = [];
for (let step = 0; step < 24; step++)
{
	let chat : chatPrevInfo = new chatPrevInfo(1, "chat " + step, "url");
	chatPrevList.push(chat);
}

for (let step = 0; step < chatPrevList.length; step++) {
	addElement(chatPrevList[step].recipientName);
}