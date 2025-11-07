
export async function loadAllUsers () {
	const SERVER = 'http://localhost:3000'
	const res = await fetch(`${SERVER}/users`)
	const data = await res.json()
	return data  // [{name: 'chann1'}]
}