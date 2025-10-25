// if typescript uses "export" functionality, 
// browser needs to include it with type="module":
// <script src="dist/chat.js" type="module"></script>


import type *  as Types from './types/api.ts';


const SERVER = 'http://localhost:3000'
// [{username: 'Alena',displayName: "akurmyza", , pasword: "fksadjfkl", avatar: "default.png"}]
export async function apiAuthRegister(data: Types.RegisterBody) {
	const payload = JSON.stringify(data) // string  JSON

	const req = await fetch(`${SERVER}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: payload,
	})

	// check response status code

	console.log(req)
	const res = await req.json();
	// if res.error ... res.field
	// if 400 -> throw error
//parse json??
	// either show errorrs, or succes

	return req
}

// [{username: 'Alena', pasword: "fksadjfkl"}]
// Types.LoginBody
export async function authLogin() {
	// const res = await fetch(`${SERVER}/auth/login`)
	// const data = await res.json()
	// return data  
}

//LATER..
/* 
in index.html
<!-- (Alena) begin temporary for error -->
<div class="errors" id="reg-errors"></div>
<!-- (Alena) end temporary  for error --> */
/* 
later
in accountDisplay.ts
registerForm.addEventListener("submit", (event: any) => {
	const errorsElm = document.getElementById('reg-errors')

	// reset errors before submit
	errorsElm.innerHTML = ''

	event.preventDefault()
	console.log('disable reg form submission');
	try {
		call apiAuthRegister(with form data)
		alert('registration was a success');
		setAccountPage('login');
	} catch (err) {
		errorsElm.innerHTML = err.message
	}

});

*/