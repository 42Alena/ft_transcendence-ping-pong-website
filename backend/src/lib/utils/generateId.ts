import { randomBytes } from "crypto"



export function generateId(){
 return randomBytes(12).toString('hex')

}
