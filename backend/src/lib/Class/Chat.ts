// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

import *  as Types from '../types/types';
import { User } from './User';
import { UserManager } from './UserManager';

export class Chat {



  userManager: UserManager;
  chatMessages: Types.Message[];


  constructor(userManager: UserManager) {
    this.userManager = userManager;
    this.chatMessages = [];
  }

  /* 
  Not allow:
  - to all
  - if blocked seder by receiver
  */
  sendPrivateMsg(message: Types.Message) {

    if (message.receiverId === 'all')
      throw new Error("cannot send private to all");

    const receiver = this.userManager.getUserById(message.receiverId);
    if (!receiver)
      throw new Error("no receiver");


    const sender = this.userManager.getUserById(message.senderId);
    if (!sender)
      throw new Error("no sender");

    if (message.type == 'PrivateMsg' || message.type == 'PrivateGameInviteMsg') {
      if (receiver.isBlocked(sender.id))
        throw new Error("blocked sender by receiver");
    }

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }

}