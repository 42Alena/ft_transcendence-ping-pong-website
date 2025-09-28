
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
