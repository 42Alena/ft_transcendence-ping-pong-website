// detect if we are inside https docker env or just local
const base_url = (window.location.protocol === 'https:') ?
	window.location.href :   // https://localhost:8443/ without hash
	`http://${window.location.hostname}:3000`;
// same hostname is important for cookies! if frontend is localhost:8080 then backend needs to be localhost:3000
// if frontend is 127.0.0.1:8080 then backend will use 127.0.0.1:3000 for cookies to work

var BACKEND_URL = (base_url.split('#')[0]).replace(/\/$/, ''); // remove trailing / and '#'

// (window as any).BACKEND_URL = BACKEND_URL;
console.log('Detected BACKEND url', BACKEND_URL);