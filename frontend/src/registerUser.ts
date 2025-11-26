
const reg : any = document.getElementById('register');

const errorMessageDiv : any = document.getElementById('reg-errors');
errorMessageDiv.classList.add("text-red");
 const successMessageDiv : any = document.getElementById('reg-success');
        successMessageDiv.textContent = 'Registration successful!';

reg.addEventListener('submit', async (event : any) => {
    event.preventDefault();

    console.log("button pressed");
    const formData = new FormData(event.target);
    const registerBody = {
        username: formData.get('reg-user_username'),
        displayName: formData.get('reg-user_displayName'),
        avatarUrl: formData.get('reg-user_avatar'),
        passwordPlain: formData.get('reg-user_password'),
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerBody),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            errorMessageDiv.textContent = `Error ${error.code}: ${error.error}`;
            errorMessageDiv.classList.add("block");
            errorMessageDiv.classList.remove("hidden");
            successMessageDiv.classList.add("hidden");
            successMessageDiv.classList.remove("remove");
            throw new Error(`Error ${error.code}: ${error.error}`);
        }

        const data = await response.json();
         errorMessageDiv.textContent = '';

        successMessageDiv.classList.add("block");
        successMessageDiv.classList.remove("hidden");
        successMess.classList.add("text-green");
        errorMessageDiv.classList.add("hidden");
        errorMessageDiv.classList.remove("block");
        console.log('Registered user:', data);
    } catch (error) {
        console.error('Error during registration:', error);
    }
});
