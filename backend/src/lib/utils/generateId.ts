import { randomBytes } from "crypto"



export function generateId(){
 return randomBytes(12).toString('hex')

}

export function generateAccessToken(){
	return randomBytes(64).toString('hex') 
}