
const logg : any = document.getElementById('login');

const errorMess : any = document.getElementById('log-errors');
errorMess.classList.add("text-red");
 const successMess : any = document.getElementById('log-success');
        successMess.textContent = 'Registration successful!';

logg.addEventListener('submit', async (event : any) => {
    event.preventDefault();

    console.log("button login pressed");
    const formData = new FormData(event.target);

    const LoginBody = {
        username: formData.get('login-user_username'),
        passwordPlain: formData.get('login-user_password'),
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/auth/login', {
            method: 'POST',
            body: JSON.stringify(LoginBody),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            errorMess.textContent = `Error ${error.code}: ${error.error}`;
            errorMess.classList.add("block");
            errorMess.classList.remove("hidden");
            successMess.classList.add("hidden");
            successMess.classList.remove("block");
            throw new Error(`Error ${error.code}: ${error.error}`);
        }

        const data = await response.json();
         errorMess.textContent = '';

        successMess.classList.add("block");
        successMess.classList.remove("hidden");
        successMess.classList.add("text-green");
        errorMess.classList.add("hidden");
        errorMess.classList.remove("block");
        console.log('Login user:', data);
    } catch (error) {
        console.error('Error during registration:', error);
    }
});
