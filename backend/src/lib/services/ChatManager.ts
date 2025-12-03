// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
//   - 2 == '2'  true // no strcit type checks, but - 2 === '2' false //type check

import { messageFromDbRow, messageToDbRow } from '../mappers/chat_db';
import { ReceiverId, SenderId } from '../types/api';
import { MessageDbRowSenderReceiver } from '../types/db';
import *  as Domain from '../types/domain';
import * as Validate from '../utils/validators';
import { db } from './DB';
import { UserManager } from './UserManager';
import { User } from './User';           // class used only here
// import { userFromDbRow } from '../mappers/user_db';


export class ChatManager {


  userManager: UserManager;
  // chatMessages: Types.MessageBase[];
  dbTableUser: any;
  dbTableMessages: any;

  constructor(userManager: UserManager) {

    // this.chatMessages = [];
    this.userManager = userManager;

    // Typed table factories (//= () => anonym fkt =factory fkt). returns a fresh query builder for `messages`
    this.dbTableMessages = () => db('messages');
    this.dbTableUser = () => db<User>('users');
  }


  private async isCommunicationBlocked(
    senderId: Domain.SenderId,
    receiverId: Domain.PrivateReceiverId
  ): Promise<boolean> {

    if (await this.userManager.isBlocked(receiverId, senderId))
      return true;

    if (await this.userManager.isBlocked(senderId, receiverId))
      return true;

    return false;
  }

  private async saveMessageInDB(message: Domain.NewMessageChat): Promise<void> {

    const dbMessageRow = messageToDbRow(message);
    console.debug("Saving message", dbMessageRow)   //TODO: comment out, for tests now

    await this.dbTableMessages().insert(dbMessageRow);
  }


  private async sendUserToUserMessage(
    message: Domain.NewMessageChat

  ): Promise<Domain.SendMessageResult> {

    const { senderId, receiverId, content } = message;
    const contentError = Validate.validateMessageContent(content);
    if (contentError)
      return { ok: false, reason: "invalid_content" };


    //TODO: uncomment checks if need later. For now OK
    // if (Validate.isSystemId(senderId))   
    //   return { ok: false, reason: "system" };

    // if (Validate.isSystemId(receiverId))
    //   return { ok: false, reason: "system" };


    const sender = await this.userManager.getUserById(senderId);

    //Sender not found or not authenticated
    if (!sender)
      return { ok: false, reason: "not_me" };


    const receiver = await this.userManager.getUserById(receiverId);

    if (!receiver)
      return { ok: false, reason: "no_receiver" };


    if (await this.isCommunicationBlocked(sender.id, receiver.id)) {
      return { ok: false, reason: "blocked" };
    }

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
    receiverId: Domain.PrivateReceiverId,
    content: Domain.MessageContent,

  ): Promise<Domain.SendMessageResult> {

    const msg: Domain.NewPrivateMessage = {
      type: "PrivateMessage",
      senderId,
      receiverId,
      content,
      // meta: null,
    };

    return this.sendUserToUserMessage(msg);
  }




  /* 
   User sends  private msg to private chat, if not blocked by another user
    senderId: UserId      //from interface(not SystemId);       
    receiverId: UserId;   //from interface  (if not blocked senderId)  
    content: fixed text on backend (MESSAGE_GAME_INVITE)
    type: 'PrivateGameInviteMsg';
  */
  async sendPrivateGameInviteMessage(
    senderId: Domain.PrivateSenderId,
    receiverId: Domain.PrivateReceiverId,
  ): Promise<Domain.SendMessageResult> {


    const msg: Domain.NewGameInviteMessage = {
      type: "PrivateGameInviteMessage",
      senderId,
      receiverId,
      content: Domain.MESSAGE_GAME_INVITE,
      // meta: null,   
    };

    return this.sendUserToUserMessage(msg);
  }



  /* 
    Systems sends to user
    senderId: SystemId    //from interface     
    receiverId: UserId    //from interface(who are scheduled to play next)   
    content: string;        //not empty
    type: 'Tournamentmsg'; //from interface

     

Example meta JSON of the message:
    {
  "kind": "next_match",
  "tournamentId": "t123",
  "matchId": "m5",
  "player1": { "id": "realUserId123", "alias": "Alena42" },
  "player2": { "id": null, "alias": "AI_1" }
}

  */
  async sendTournamentMessage(
    receiverId: Domain.PrivateReceiverId,
    // meta: Domain.MetaTournamentNextMatch,

  ): Promise<Domain.SendMessageResult> {


    const receiver = await this.userManager.getUserById(receiverId);

    if (!receiver)
      return { ok: false, reason: "no_receiver" };



    const msg: Domain.NewTournamentMessage = {
      type: "TournamentMessage",
      senderId: Domain.SYSTEM_ID,
      receiverId,
      content: Domain.MESSAGE_TOURNAMENT_INVITE,
      // meta,
    };

    await this.saveMessageInDB(msg);

    return { ok: true };

  }


  /* 
  return:
  [
  { userId: "u_42", displayName: "Alice", avatarUrl: "..." },
  { userId: "u_17", displayName: "Bob",  avatarUrl: "..." },
  ...
]
  newest messages first
  .join //where I am sender 1,2 =3, rename(rename 'users as sender' this table inside this query)

  */
  async getChatConversations( //TODO change to all users who i wrote or who me wrote
    meId: Domain.UserId,

  ): Promise<Domain.ChatConversationsResult> {


    const me = await this.userManager.getUserById(meId);

    //Sender not found or not authenticated
    if (!me)
      return { ok: false, reason: "not_me" };



    const messageRows = await this.dbTableMessages()
      .distinct()   // take unique names https://knexjs.org/guide/query-builder.html#clearhaving
      .where({ senderId: meId })
      .orWhere({ receiverId: meId })
      .select(
        'senderId',
        'receiverId'
      ) as MessageDbRowSenderReceiver[];


    //collect all unique IDs
    const uniqueNotMeIds = new Set<Domain.UserId>();

    for (const row of messageRows) {
      const { senderId, receiverId } = row;

      const otherId = senderId === meId ? receiverId : senderId;

      if (otherId !== meId) {
        uniqueNotMeIds.add(otherId);
      }
    }
    if (uniqueNotMeIds.size === 0)
      return { ok: true, conversations: [] };


    const idsArray = Array.from(uniqueNotMeIds);

    // 4) Load users for these ids

    const conversations = await this.dbTableUser()
      .whereIn("id", idsArray)
      .select("id", "displayName", "avatarUrl") as Domain.ChatConversations[];


    return { ok: true, conversations };

  }

  /* list Users+Avatars for conversation */
  async getConversations( //TODO change to all users who i wrote or who me wrote
    meId: Domain.UserId,

  ): Promise<Domain.ChatConversationsResult> {


    const me = await this.userManager.getUserById(meId);

    //Sender not found or not authenticated
    if (!me)
      return { ok: false, reason: "not_me" };



    const messageRows = await this.dbTableMessages()
      .distinct()   // take unique names https://knexjs.org/guide/query-builder.html#clearhaving
      .where({ senderId: meId })
      .orWhere({ receiverId: meId })
      .select(
        'senderId',
        'receiverId'
      ) as MessageDbRowSenderReceiver[];


    //collect all unique IDs
    const uniqueNotMeIds = new Set<Domain.UserId>();

    for (const row of messageRows) {
      const { senderId, receiverId } = row;

      const otherId = senderId === meId ? receiverId : senderId;

      if (otherId !== meId) {
        uniqueNotMeIds.add(otherId);
      }
    }
    if (uniqueNotMeIds.size === 0)
      return { ok: true, conversations: [] };


    const idsArray = Array.from(uniqueNotMeIds);

    // 4) Load users for these ids

    const conversations = await this.dbTableUser()
      .whereIn("id", idsArray)
      .select("id", "displayName", "avatarUrl") as Domain.ChatConversations[];


    return { ok: true, conversations };

  }


  /* list Users+Avatars for conversation */
  async getConversationWith( //TODO change to all users who i wrote or who me wrote
    senderId: Domain.PrivateSenderId,
    receiverId: Domain.PrivateReceiverId,

  ): Promise<Domain.ChatConversationWithResult> {

    if (senderId === Domain.SYSTEM_ID) {

      const receiver = await this.userManager.getUserById(receiverId);

      //Sender not found or not authenticated
      if (!receiver)
        return { ok: false, reason: "no_receiver" };
    }
    else {

      const sender = await this.userManager.getUserById(senderId);

      //Sender not found or not authenticated
      if (!sender)
        return { ok: false, reason: "not_me" };

      const receiver = await this.userManager.getUserById(receiverId);

      //Sender not found or not authenticated
      if (!receiver)
        return { ok: false, reason: "no_receiver" };
    }


    const rows = await this.dbTableMessages()
      .where((qb: Knex.QueryBuilder) => {
        qb.where({ senderId, receiverId }); // me -> other
      })
      .orWhere((qb: Knex.QueryBuilder) => {
        qb.where({ senderId: receiverId, receiverId: senderId }); // other -> me
      })
      .orderBy('createdAt', 'asc');

    const conversations = rows.map(messageFromDbRow);

    return { ok: true, conversations };
  }

}
