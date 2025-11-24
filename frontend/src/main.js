const userData = {
    username: "alice",
    displayName: "Alice",
    passwordPlain: "Str0ngPass!",
    avatarUrl: null
};

const login = {
    username : "alice",
    passwordPlain  :"Str0ngPass!",
}
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

async function getData() {
  const url = "http://localhost:3000/auth/register";
  try {
    const response = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(userData)},)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

getData();