import type *  as Types from '../types/api';

export function isEmptyString(value: string): boolean {
	return !value || value.trim() === "";
}

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


function normalizeAvatar(v: unknown): string | null {
	return typeof v === "string" && v.trim() !== "" ? v : null;
  }
  
  function validateUsername(u: string): string | null {
	if (typeof u !== "string") return "Username must be a string";
	if (u.length < 3 || u.length > 20) return "Username must be 3–20 chars";
	if (!/^[a-zA-Z0-9_]+$/.test(u)) return "Only letters, numbers, underscore";
	return null;
  }
  
  function validateDisplayName(n: string): string | null {
	if (typeof n !== "string") return "Display name must be a string";
	if (n.length < 3 || n.length > 30) return "Display name must be 3–30 chars";
	return null;
  }
  
  function validatePassword(pw: string, username: string): string | null {
	if (typeof pw !== "string") return "Password must be a string";
	if (pw.length < 8) return "Password must be at least 8 chars";
	if (!/[A-Z]/.test(pw)) return "Need an uppercase letter";
	if (!/[a-z]/.test(pw)) return "Need a lowercase letter";
	if (!/\d/.test(pw)) return "Need a number";
	if (!/[^\w\s]/.test(pw)) return "Need a special character";
	if (pw.toLowerCase().includes(username.toLowerCase()))
	  return "Password must not contain username";
	return null;
  }
  
  function bad(res: FastifyReply, error: string, field?: string, code?: string) {
	return res.code(400).send({ error, field, code } as Types.ApiError);
  }



/* 
// OLD: from first version with Classes. Leave here in case I need later

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
 */