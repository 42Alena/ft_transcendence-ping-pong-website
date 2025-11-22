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


  private async saveMessageInDB(message: Domain.NewMessageChat): Promise<void> {

    const dbMessageRow = messageToDbRow(message);
    console.debug("Saving message", dbMessageRow)   //TODO: comment out, for tests now

    await this.dbTableMessages().insert(dbMessageRow);
  }


  private async sendUserToUserMessage(
    senderId: Domain.PrivateSenderId,
    receiverId: Domain.PrivateSenderId,
    type: Domain.MessageTypeChat,
    content: Domain.MessageContent,
    meta: Domain.Meta,

  ): Promise<Domain.SendMessageResult> {

    const contentError = Validate.validateMessageContent(content);
    if (contentError)
      return { ok: false, reason: "invalid_content" };


    if (!Validate.isSystemId(senderId))
      return { ok: false, reason: "system" };

    if (!Validate.isSystemId(receiverId))
      return { ok: false, reason: "system" };


    const sender = await this.userManager.getUserById(senderId);

    if (!sender)
      return { ok: false, reason: "not_me" };


    const receiver = await this.userManager.getUserById(receiverId);

    if (!receiver)
      return { ok: false, reason: "not_me" };



    if (await this.userManager.isBlocked(receiver.id, sender.id)) {
      return { ok: false, reason: "blocked" };
    }


    const message: Domain.NewMessageChat = {

      // id: generateId() as Domain.MessageId,     // or with it for MessageChat
      type,                    // one of MessageTypeChat
      senderId,
      receiverId,
      content,
      meta,
      // createdAt: unixTimeNow(),                 // or with it for MessageChat
    };

    await this.saveMessageInDB(message);

    return { ok: true };
  }




  /* chat
   Send  private msg to private chat, if not blocked by another user
    senderId: UserId //(not SystemId);       
    receiverId: UserId(if not blocked senderId);    
    content: string; //not empty
    type: PrivateMsg;
  */
  async sendPrivateMessage(
    senderId: Domain.PrivateSenderId,
    receiverId: Domain.PrivateSenderId,
    content: Domain.MessageContent,

  ): Promise<Domain.SendMessageResult> {

    return this.sendUserToUserMessage(
      // id: generateId() as Domain.MessageId,     // or with it for MessageChat
      senderId,
      receiverId,
      "PrivateMessage",                    // one of MessageTypeChat
      content,
      null,         //meta: null,
      // createdAt: unixTimeNow(),                 // or with it for MessageChat
    );
  }




  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId      //from interface(not SystemId);       
    receiverId: UserId;   //from interface  (if not blocked senderId)  
    content: string;      //not empty
    type: 'PrivateGameInviteMsg';
  */
  async sendPrivateGameInviteMessage(
    senderId: Domain.PrivateSenderId,
    receiverId: Domain.PrivateSenderId,
    content: Domain.MessageContent,

  ): Promise<Domain.SendMessageResult> {

    return this.sendUserToUserMessage(
      // id: generateId() as Domain.MessageId,     // or with it for MessageChat
      senderId,
      receiverId,
      "PrivateGameInviteMessage",                    // one of MessageTypeChat
      Domain.MESSAGE_GAME_INVITE,                   //content,
      null,         //meta: null,
      // createdAt: unixTimeNow(),                 // or with it for MessageChat
    );
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

    const error = Validate.validateMessageContent(message.content);
    if (error) {
      return { ok: false, reason: "invalid_content" as const };
    }

    message.content = Types.MESSAGE_TOURNAMENT_INVITE;

    this.chatMessages.push(message); // TODO(later): send message through WebSocket instead of only saving it
  }
}
