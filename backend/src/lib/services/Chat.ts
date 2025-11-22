// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
//   - 2 == '2'  true // no strcit type checks, but - 2 === '2' false //type check

import { messageToDbRow } from '../mappers/chat_db';
import *  as Domain from '../types/domain';
import * as Validate from '../utils/validators';
import { db } from './DB';
import { User } from './User';
import { UserManager } from './UserManager';

export class Chat {


  userManager: UserManager;
  // chatMessages: Types.MessageBase[];

  dbTableMessages: any;

  constructor(userManager: UserManager) {

    // this.chatMessages = [];
    this.userManager = userManager;

    // Typed table factories (//= () => anonym fkt =factory fkt). returns a fresh query builder for `messages`
    this.dbTableMessages = () => db('messages');
  }


  private async saveMessageInDB(message: Domain.MessageChat): Promise<void> {

    const dbMessageRow = messageToDbRow(message);
    console.debug("Saving message", dbMessageRow)   //TODO: comment out, for tests now

    await this.dbTableMessages().insert(dbMessageRow);
  }


  /* 
  For private messages (user to user)
  sender must exist, not system
   */
  private async checkPrivateSender(sender: Domain.HasPrivateSender): Promise<User> {


    Validate.ensureNonEmptyString(sender.senderId, "sender");

    const sender = await this.userManager.getUserById(sender.senderId);

    if (!sender)
      return { ok: false, reason: "not_me" };

    Validate.ensureNotSystemId(sender.id, Domain.SYSTEM_ID);

    return sender;
  }


  /* 
  For private messages (user to user)
   receiver must exist, not system, not blocking sender
   */
  private async checkPrivateReceiver(message: Domain.HasPrivateReceiver, sender: User): Promise<User> {

    Validate.ensureNonEmptyString(message.receiverId, "receiver");

    const receiver = await this.userManager.getUserByIdOrThrow(message.receiverId);

    Validate.ensureNotSystemId(receiver.id, Domain.SYSTEM_ID);
    receiver.ensureNotBlockedByOrThrow(sender.id);

    return receiver;
  }



  /* chan
   Send  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: PrivateMsg;
  */
  async sendPrivateMessage(message: Types.MessagePrivate) {

    Validate.ensureNonEmptyString(message.content, "[sendPrivateMsg] message content");

    const sender = await this.checkPrivateSender(message);

    this.checkPrivateReceiver(message, sender);

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it

  }




  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId      //from interface(not SystemId);       
    receiverId: UserId;   //from interface  (if not blocked senderId)  
    content: string;      //not empty
    type: 'PrivateGameInviteMsg';
  */
  async sendPrivateGameInviteMessage(message: Types.MessagePrivateGameInvite) {


    const sender = await this.checkPrivateSender(message);
    const receiver = await this.checkPrivateReceiver(message, sender);

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
