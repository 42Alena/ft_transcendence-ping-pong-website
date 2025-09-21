import *  as Types from '../types/types';
import { User } from './User';

export class UserManager{

	users: User[];

	constructor(){
		this.users = [];
	}

	get userById(userId: Types.UserId)   {
		return this.users.has(userId);
	}
}