// Used information from links
//  https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
import *  as Types from '../types/types';
import { User } from './User';

export class UserManager{

	users: Map<Types.UserId, User>;

	constructor(){
		this.users = new Map<Types.UserId, User>;
	}

	getUserById(userId: Types.UserId):  User | null {
		return this.users.get(userId) ?? null;
	}

	saveUser(newUser: User){
		this.users.set(newUser.id, newUser);
	}

	
}