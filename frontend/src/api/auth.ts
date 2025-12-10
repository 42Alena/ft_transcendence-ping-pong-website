// if typescript uses "export" functionality, 
// browser needs to include it with type="module":
// <script src="dist/chat.js" type="module"></script>


import type *  as Types from './types.js';

//(luis added to make it work with certs)
//const SERVER = 'http://localhost:3000'
const SERVER = window?.location?.origin ?? 'http://localhost:3000'


//called "CLIENT SDK" or API BACKEND INTEGRATION, function that caled backend

// using jsdoc 
/** 
 * [{username: 'Alena',displayName: "akurmyza", , pasword: "fksadjfkl", avatar: "default.png"}] 
 * 
 * @example
 *    const res = await apiAuthRegister({
 *       username: "aa",
 *       displayName: "BB"
 *    })
 * 
 * @params {Types.RegisterBody} data
 * @returns {{ success: true, data: any } | {success: false, errors: any}}
 */
export async function apiAuthRegister(data: Types.RegisterBody) {
	const payload = JSON.stringify(data) // string  JSON

	const response = await fetch(`${SERVER}/user/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: payload,
	})

	// check response status code
	console.log(response.status, response.statusText, response.ok)

	// console.log(response)

	//only 1 time can be read from stream
	const responseBody = await response.json() as Types.UserPublic; // parsed payload;

	// if res.error ... res.field
	// if 400 -> throw error
	//parse json??
	// either show errorrs, or succes


	if (response.status !== 200) {
		return {
			succes: false,
			errors: responseBody
		}
		// throw new ApiError(responseRegister)
	}


	return { success: true, data: responseBody }
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
registerForm.addEventListener("submit", async (event: any) => {
	const errorsElm = document.getElementById('reg-errors')

	// reset errors before submit
	errorsElm.innerHTML = ''

	event.preventDefault()
	console.log('disable reg form submission');

	const r = await apiAuthRegister(with form data)

	if (r.success) {
		alert('registration was a success');
		setAccountPage('login');
	 else
		errorsElm.innerHTML = r.errors


});

*/