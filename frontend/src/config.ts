// same hostname is important for cookies! if frontend is localhost:8080 then backend needs to be localhost:3000
// if frontend is 127.0.0.1:8080 then backend will use 127.0.0.1:3000 for cookies to work

var backendPort =
  window.location.protocol === "https:" ? window.location.port : "3000";
var BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

// (window as any).BACKEND_URL = BACKEND_URL;
console.log("Detected BACKEND url", BACKEND_URL);