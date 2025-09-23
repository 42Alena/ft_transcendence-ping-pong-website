// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
//   - 2 == '2'  true // no strcit type checks, but - 2 === '2' false //type check

import *  as Types from '../types/types';
import * as Validate from '../utils/validators';
import { User } from './User';
import { UserManager } from './UserManager';

export class Chat {



  userManager: UserManager;
  chatMessages: Types.MessageBase[];


  constructor(userManager: UserManager) {
    this.userManager = userManager;
    this.chatMessages = [];
  }



  /*  private checkPrivateSender(obj: HasPrivateSender): User {
  private checkPrivateSender(object: HasPrivateSender): User {
   const sender = this.userManager.getUserById(object.senderId);
 
   if (!sender) {
     throw new Error("sender is not registered in UserManager");
   }
 
   if (sender.id === Types.SYSTEM_ID) {
     throw new Error("SystemId cannot be sender");
   }
 
   return sender;
 }
   } */

  /* 
  not system ID, must exist
   */
  private checkPrivateSender(object: Types.HasPrivateSender): User {


    Validate.ensureNonEmptyString(object.senderId, "sender");

    const sender = this.userManager.getUserById(object.senderId);

    if (!sender) {
      throw new Error("sender is not registered in UserManager");
    }

    // if (sender.id === Types.SYSTEM_ID) {
    //   throw new Error("SystemId cannot be sender");
    // }changed to:
Validate.ensureNotSystemId(sender.id, Types.SYSTEM_ID);
    return sender;
  }

  /* 
  receiver must exist, not system, not blocking sender
   */
  private checkPrivateReceiver(message: Types.MessagePrivate, sender: User): User {
    
    Validate.ensureNonEmptyString(sender.id, "sender");

    const receiver = this.userManager.getUserById(message.receiverId);


    if (!receiver) {
      throw new Error("receiver is not registered in UserManager");
    }

    if (receiver.id === Types.SYSTEM_ID) {
      throw new Error("SystemId cannot be receiver");
    }

    if (receiver.isBlocked(sender.id)) {
      throw new Error("blocked sender by receiver");
    }

    return receiver;
  }


  private checkPublicReceiver(message: Types.Message): void {
    if (message.receiverId !== 'all') {
      throw new Error("public message must have receiverId = 'all'");
    }
  }



  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: PrivateMsg;
  */
  sendPrivateMsg(message: Types.MessagePrivate) {

    Validate.ensureNonEmptyString(message.content, "message content");

    const sender = this.checkPrivateSender(message);

    this.checkPrivateReceiver(message, sender);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }


  /* 
 User sends public msg to public chat
    senderId: UserId //(not SystemId);       
    receiverId: UserId;    
    content: string; //not empty
    type: PyblicMsg;
  
  */
  sendPublicMsg(message: Types.PublicMessage) {

    Validate.ensureNonEmptyString(message.content, "public message");

    if (message.type !== 'PublicMsg')
      throw new Error("not public msg");

    if (message.receiverId !== 'all')
      throw new Error("public msg must receiverId='all'");

    const sender = this.checkPrivateSender(message);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }


  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: 'PrivateGameInviteMsg';
  */
  sendPrivateGameInviteMsg(message: Types.Message) {

    Validate.ensureNonEmptyString(message.content, "invite message");

    if (message.type !== 'PrivateGameInviteMsg')
      throw new Error("type not 'PrivateGameInviteMsg' msg");

    if (message.receiverId === 'all')
      throw new Error("must be UserId(private msg)");

    const sender = this.checkPrivateSender(message);

    this.checkPrivateReceiver(message, sender);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }



  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: 'PrivateGameInviteMsg';
  */
  sendTournamentMsg(message: Types.Message) {

    Validate.ensureNonEmptyString(message.content, "tounament message");
  

    if (message.type !== 'PrivateGameInviteMsg')
      throw new Error("type not 'PrivateGameInviteMsg' msg");

    if (message.receiverId === 'all')
      throw new Error("must be UserId(private msg)");

    const sender = this.checkPrivateSender(message);

    this.checkPrivateReceiver(message, sender);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }
}