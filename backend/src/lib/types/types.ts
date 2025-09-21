/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html

this types can be used for all project

Add as header at the top of the file:
import *  from '../types/UserTypes';

or what you  special need:

import { UserId, UserStatus, MatchResult } from './types/types';
*/

export type UserStatus = 'online' | 'offline';
export type GameResult = 'won' | 'lost';
export type UserId = string;
export type AvatarUrl = string;



export type MatchResult = {
	opponentId: UserId;
	date: Date;
	result: GameResult;
  };