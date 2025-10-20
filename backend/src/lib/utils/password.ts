import * as bcrypt from "bcryptjs";
import type *  as Types from '../lib/types/types';


// https://www.bcrypt.io/languages/typescript
export async function hashPassword(passwordPlain: Types.PasswordPlain): Promise < Types.PasswordHash > {
	const saltRounds = 12;
	return bcrypt.hash(passwordPlain, saltRounds);
}

export function verifyPassword(passwordHash: Types.PasswordHash, passwordPlain: Types.PasswordPlain): Promise<boolean> {
	return bcrypt.compare(passwordPlain, passwordHash);
}