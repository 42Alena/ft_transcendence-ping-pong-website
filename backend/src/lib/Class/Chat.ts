import *  as Types from '../types/types';
import { User } from './User';

export class Chat {




  chatMessages: Types.Message[];

  constructor() {

    this.chatMessages = [];
  }

  sendPrivateMsg(message: Types.Message) {
    // if(message.type == 'PrivateMsg' || message.type == 'PrivateGameInviteMsg'){
    // if(user is bocked...)

  }
}

