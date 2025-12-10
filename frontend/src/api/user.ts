
export async function loadAllUsers () {
	//const SERVER = 'http://localhost:3000' (luis comnented out to make it work with certs look line below)
	const SERVER = window?.location?.origin ?? 'http://localhost:3000'
	const res = await fetch(`${SERVER}/users`)
	const data = await res.json()
	return data  // [{name: 'chann1'}]
}