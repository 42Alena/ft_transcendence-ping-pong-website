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


  /* 
  For private messages (user to user)
  sender must exist, not system
   */
  private checkPrivateSender(object: Types.HasPrivateSender): User {


    Validate.ensureNonEmptyString(object.senderId, "sender");

    const sender = this.userManager.getUserByIdOrThrow(object.senderId);

    Validate.ensureNotSystemId(sender.id, Types.SYSTEM_ID);

    return sender;
  }

  /* 
  For private messages (user to user)
   receiver must exist, not system, not blocking sender
   */
  private checkPrivateReceiver(message: Types.HasPrivateReceiver, sender: User): User {

    Validate.ensureNonEmptyString(message.receiverId, "receiver");

    const receiver = this.userManager.getUserByIdOrThrow(message.receiverId);

    Validate.ensureNotSystemId(receiver.id, Types.SYSTEM_ID);
    receiver.ensureNotBlockedByOrThrow(sender.id);

    return receiver;
  }



  /* 
   Send  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: PrivateMsg;
  */
  sendPrivateMessage(message: Types.MessagePrivate) {

    Validate.ensureNonEmptyString(message.content, "[sendPrivateMsg] message content");

    const sender = this.checkPrivateSender(message);

    this.checkPrivateReceiver(message, sender);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }


  /* 
 User sends public msg to public chat
    senderId: UserId //(not SystemId);       
    receiverId: 'all';    
    content: string; //not empty
    type: PyblicMsg;
  
  */
  sendPublicMessage(message: Types.MessagePublic) {

    Validate.ensureNonEmptyString(message.content, "[sendPublicMsg] public message");

    Validate.ensureReceiverIsAll(message.receiverId);

    const sender = this.checkPrivateSender(message);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }


  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId      //from interface(not SystemId);       
    receiverId: UserId;   //from interface  (if not blocked senderId)  
    content: string;      //not empty
    type: 'PrivateGameInviteMsg';
  */
  sendPrivateGameInviteMessage(message: Types.MessagePrivateGameInvite) {


    const sender = this.checkPrivateSender(message);
    const receiver = this.checkPrivateReceiver(message, sender);

    if (Validate.isEmptyString(message.content))
      message.content = Types.MESSAGE_GAME_INVITE;

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }



  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: SystemId    //from interface     
    receiverId: UserId    //from interface(who are scheduled to play next)   
    content: string;        //not empty
    type: 'Tournamentmsg'; //from interface
  */
  sendTournamentMessage(message: Types.MessageTournament) {

    Validate.ensureIsSystemId(message.senderId, Types.SYSTEM_ID);

    Validate.ensureNotSystemId(message.receiverId, Types.SYSTEM_ID);

    if (Validate.isEmptyString(message.content))
      message.content = Types.MESSAGE_TOURNAMENT_INVITE;

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it
  }
}
