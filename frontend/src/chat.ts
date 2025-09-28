const SERVER = 'http://localhost:3000'

export async function loadChatChannels () {
	const res = await fetch(`{SERVER}/chat/channels`)
	const data = await res.json()
	return data  // [{name: 'chann1'}]
}

