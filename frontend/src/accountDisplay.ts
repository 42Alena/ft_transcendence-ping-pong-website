const registerPage : any = document.getElementById("registerPage");
const loginPage : any = document.getElementById("loginPage");
const profilePage : any = document.getElementById("profilePage");
const choicePage : any = document.getElementById("pageChoice");
const submitButton : any = document.getElementById("submitRegButton");
const signupForm : any = document.getElementById("signup");

function setProfilePage(text : string)
{
	if (text == "login")
	{
		loginPage.style.display = "flex";
		choicePage.style.display = "none";
		registerPage.style.display = "none";
		profilePage.style.display = "none";

	}
	else if (text = "register")
	{
		registerPage.style.display = "flex";
		choicePage.style.display = "none";
		loginPage.style.display = "none";
		profilePage.style.display = "none";
	}
	else
	{
		profilePage.style.display = "flex";
		choicePage.style.display = "none";
		loginPage.style.display = "none";
		registerPage.style.display = "none";
	}
}

submitButton.addEventListener("click", (event : any) => {

	console.log("clicked");
	console.log("create form data");
	let formData = new FormData(signupForm);

	for(let [name, value] of formData) {
  console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
}
 alert('Registration complete');
});


