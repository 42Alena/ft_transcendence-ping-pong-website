import * as bcrypt from "bcryptjs";
import type *  as Types from '../types/domain';


// https://www.bcrypt.io/languages/typescript

//need AWAIT because of Promise
export async function hashPassword(
	passwordPlain: Types.PasswordPlain
): Promise<Types.PasswordHash> {
	const saltRounds = 12;
	return bcrypt.hash(passwordPlain, saltRounds);
}



//need AWAIT because of Promise
export function verifyPassword(
	passwordPlain: Types.PasswordPlain,
	passwordHash: Types.PasswordHash,

): Promise<boolean> {

	return bcrypt.compare(passwordPlain, passwordHash);
}

