
const reg : any = document.getElementById('register');

const errorMessageDiv : any = document.getElementById('reg-errors');
errorMessageDiv.classList.add("text-red");
 const successMessageDiv : any = document.getElementById('success-page');
        // successMessageDiv.textContent = 'Registration successful!';

reg.addEventListener('submit', async (event : any) => {
    event.preventDefault();

    console.log("button pressed");
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
const formData = new FormData(event.target);
    const registerBody = {
        username: formData.get('reg-user_username'),
        displayName: formData.get('reg-user_displayName'),
        avatarUrl: formData.get('reg-user_avatar'),
        passwordPlain: formData.get('reg-user_password'),
    };

const myRequest = new Request("http://127.0.0.1:3000/auth/register", {
  method: "POST",
  body: JSON.stringify(registerBody),
  headers: myHeaders,
});
    try {
        const response = await fetch(myRequest);
        if (!response.ok) {
            
            throw new Error(`Response status ${response.status}`);
        }
        else
        {
            const data = await response.json();
            errorMessageDiv.textContent = '';
            successMessageDiv.classList.add("flex");
            successMessageDiv.classList.remove("hidden");
            errorMessageDiv.classList.add("hidden");
            errorMessageDiv.classList.remove("block");
            reg.classList.add("hidden");
            reg.classList.remove("flex");
            console.log('Registered user:', data);
        }
    } catch (error : any) {
        console.error('Error during registration:', error.message);
    }
});
