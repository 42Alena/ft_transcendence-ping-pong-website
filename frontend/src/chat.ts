const SERVER = 'http://localhost:3000'

export async function loadChatChannels () {
	const res = await fetch(`${SERVER}/chat/channels`)
	const data = await res.json()
	return data  // [{name: 'chann1'}]
}

//Need UI:
// 0. Function: show all users
// User:  
// show user status : online/offline
//  User: block/unblock 
// User: invite to game
//User: send message

