// if typescript uses "export" functionality, 
// browser needs to include it with type="module":
// <script src="dist/chat.js" type="module"></script>


import type *  as Types from '../../backend/src/lib/types/types';


const SERVER = 'http://localhost:3000'
// [{username: 'Alena',displayName: "akurmyza", , pasword: "fksadjfkl", avatar: "default.png"}]
Types.RegisterBody
export async function authRegister() {
	const post = await fetch(`${SERVER}/auth/register`)
	return post  
}

// [{username: 'Alena', pasword: "fksadjfkl"}]
Types.LoginBody
export async function authLogin() {
	const res = await fetch(`${SERVER}/auth/login`)
	const data = await res.json()
	return data  
}
