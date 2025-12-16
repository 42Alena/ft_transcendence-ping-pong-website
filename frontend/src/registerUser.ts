const reg: any = document.getElementById("registerForm");
const errorUsername: any = document.getElementById("reg-usernama_error");
const errorDisplayName: any = document.getElementById("reg-displayName_error");
const errorPaassword : any = document.getElementById("reg-password_error");
const displayInput: any = document.getElementById("reg-display");
const passwordInput: any = document.getElementById("reg-password");
const successRegPage: any = document.getElementById("success-display");
const loginButtonRedirect : any = document.getElementById("login-button");

loginButtonRedirect.addEventListener("click", () => {
  successRegPage.classList.add("hidden");
  successRegPage.classList.remove("flex");
  handleClickEvent('login');
})
reg.addEventListener("submit", async (event: any) => {
  event.preventDefault();
errorUsername.classList.add("hidden");
errorUsername.classList.remove("block");
errorDisplayName.classList.add("hidden");
errorDisplayName.classList.remove("block");
errorPaassword.classList.add("hidden");
errorPaassword.classList.remove("block");
successRegPage.classList.add("hidden");
successRegPage.classList.remove("flex");
  console.log("button pressed");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const formData = new FormData(reg);
  const registerBody = {
    username: formData.get("reg-user_username"),
    displayName: formData.get("reg-user_displayName"),
    passwordPlain: formData.get("reg-user_password"),
  };

  const myRequest = new Request(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(registerBody),
    headers: myHeaders,
    credentials : "include"
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    console.log(response.json);
    const data = await response.json();
    if (!response.ok) {
      if (data.field == "username") {
        errorUsername.classList.add("block");
        errorUsername.classList.remove("hidden");
        errorUsername.textContent = data.error;
      } else if (data.field == "displayName") {
        errorDisplayName.classList.add("block");
        errorDisplayName.classList.remove("hidden");
        errorDisplayName.textContent = data.error;
      } else {
        errorPaassword.classList.add("block");
        errorPaassword.classList.remove("hidden");
        errorPaassword.textContent = data.error;
      }
      throw new Error(`Response status ${response.status}`);
    } else {
        errorUsername.classList.add("hidden");
        errorUsername.classList.remove("block");
        errorDisplayName.classList.add("hidden");
        errorDisplayName.classList.remove("block");
        errorPaassword.classList.add("hidden");
        errorPaassword.classList.remove("block");
        successRegPage.classList.add("flex");
        successRegPage.classList.remove("hidden");
        regP.hidden=true;
      reg.reset();
      console.log("Registered user:", data);
    }
  } catch (error: any) {
    console.error("Error during registration:", error.message);
  }
});
