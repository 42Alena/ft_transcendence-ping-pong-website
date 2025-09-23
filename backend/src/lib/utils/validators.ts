
  /* 
 not empty string
 fieldname: "username", "senderId", "message content"...
  */
  export function ensureNonEmptyString(value: string, fieldName: string): void {
	if (!value || value.trim() === "") {
	  throw new Error(`${fieldName} cannot be empty`);
	}
  }
  
  export function ensureNotSystemId(userId: string, systemId: string): void {
	if (userId === systemId) {
	  throw new Error("SystemId cannot be used here");
	}
  }

//   export function ensureNotSystemId(userId: string, systemId: string)
//   {

//   }