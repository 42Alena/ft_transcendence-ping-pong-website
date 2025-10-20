import { randomBytes } from "crypto"



export function generateId(){
 return randomBytes(12).toString('hex')
}


export function generateSessionToken(){
	return randomBytes(64).toString('hex') 
}

