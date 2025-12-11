// detect if we are inside https docker env or just local
export const BACKEND_URL = (window.location.protocol === 'https:') ?
	new URL('/backend', window.location.href).href :   // https://localhost:8443/backend
	'http://localhost:3000';

(window as any).BACKEND_URL = BACKEND_URL;
console.debug('Detected BACKEND url', BACKEND_URL);