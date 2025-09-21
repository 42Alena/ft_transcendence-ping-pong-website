// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
//   - 2 == '2'  true // no strcit type checks, but - 2 === '2' false //type check

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
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: PyblicMsg;
  */
  sendPrivateMsg(message: Types.Message) {

    if (!message.content || message.content.trim() === "") {
      throw new Error("cannot send empty message");
    }

    if (message.type !== 'PrivateMsg')
      throw new Error("type not private msg");

    if (message.receiverId === 'all')
      throw new Error("cannot send private to all");

    const receiver = this.userManager.getUserById(message.receiverId);
    if (!receiver)
      throw new Error("no receiver");


    const sender = this.userManager.getUserById(message.senderId);
    if (!sender)
      throw new Error("no sender");

    if (sender.id === Types.SYSTEM_ID)
      throw new Error("no SystemId sender");

    if (receiver.isBlocked(sender.id))
      throw new Error("blocked sender by receiver");

    if (receiver.id === Types.SYSTEM_ID)
      throw new Error("no SystemId receiver");


    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }


  /* 
 User send public msg to public chat
    senderId: UserId //(not SystemId);       
    receiverId: UserId;    
    content: string; //not empty
    type: PyblicMsg;
  
  */
  sendPublicMsg(message: Types.Message) {

    if (!message.content || message.content.trim() === "") {
      throw new Error("cannot send empty message");
    }

    if (message.type !== 'PublicMsg')
      throw new Error("not public msg");

    if (message.receiverId !== 'all')
      throw new Error("public msg must receive 'all'");

    const sender = this.userManager.getUserById(message.senderId);

    if (!sender)
      throw new Error("no sender");

    if (sender.id === Types.SYSTEM_ID)
      throw new Error("no SystemId sender");

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }

}