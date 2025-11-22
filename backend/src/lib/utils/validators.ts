import type *  as Domain from '../types/api';
import { SYSTEM_ID } from '../types/domain';


const RESERVED = new Set(['admin', 'root', 'null', 'system', 'api', 'me',
	'ai',
	SYSTEM_ID,
]);

//________STRING____________________
export function isEmptyString(value: string): boolean {
	return !value || value.trim() === "";
}

export function normalizeString(input?: string | null): string | null {
	return input ? String(input).trim() : null;
}

//_________________NAME_____________________

export function normalizeName(name: string): string {
	// Defensive: handle unexpected values gracefully
	if (typeof name !== "string") return "";
  
	return name
	  .normalize("NFKC")  // unify Unicode forms and compatibility chars
	  .trim()             
  }


export function validateName(name: string): string | null {

	if (name.length < 3 || name.length > 15) return "Length: 3–15 chars";

	if (RESERVED.has(name.toLowerCase())) return 'Reserved word';

	// ^ = start of string; [A-Za-z] = first char must be a letter (A–Z or a–z)
	if (!/^[A-Za-z]/.test(name)) return "Must start with a letter";

	// ^ = start; \w = [A-Za-z0-9_]; + = one or more; $ = end. Whole string is only letters/digits/underscore
	if (!/^\w+$/.test(name)) return "Only letters, digits, _";

	return null;
}


/* 
  - **Minimum length:** 8 characters  
  - Must include **letters** and **numbers**  
  - Recommended: add **one uppercase** or **special** character  
  - Must **not contain** username or display name (case-insensitive)  
   */
export function validatePassword(pw: string, username: string, displayName: string): string | null {

	if (pw.length < 8) return 'Password must be at least 8 characters';

	// no letter: (!/[A-Za-z]/) or no digit: (!/\d/) 
	if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Must include letters and numbers';


	const p = pw.toLowerCase();
	const u = username.toLowerCase();
	const d = displayName.toLowerCase();

	if (u && p.includes(u)) return 'Password must not contain username';
	if (d && p.includes(d)) return 'Password must not contain display name';

	return null;
}






/* 
// OLD: from first version with Classes. Leave here in case I need later

/* 
not empty string
fieldname: "username", "senderId", "message content"...
*/
export function ensureNonEmptyString(value: string, fieldName: string): void {
	if (isEmptyString(value)) {
		throw new Error(`${fieldName} cannot be empty`);
	}
}

export function ensureNotSystemId(userId: string, systemId: string): void {
	if (userId === systemId) {
		throw new Error("SystemId cannot be used here");
	}
}


export function ensureIsSystemId(userId: string, systemId: string): void {
	if (userId !== systemId) {
		throw new Error("Only SystemId can be used here");
	}
}

export function ensureReceiverIsAll(receiverId: string): void {
	if (receiverId !== 'all') {
		throw new Error("receiverId must be 'all'");
	}
}
