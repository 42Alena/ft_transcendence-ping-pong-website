import assert from "assert";
import { Chat } from "../src/lib/services/Chat";
import { User } from "../src/lib/services/User";
import { UserManager } from "../src/lib/services/UserManager";
import * as Types from "../src/lib/types/types";

function runChatTests() {
  const userManager = new UserManager();
  const alice = new User("Alice", "u1");
  const bob = new User("Bob", "u2");
  userManager.saveUser(alice);
  userManager.saveUser(bob);

  const chat = new Chat(userManager);

  // 1. Public message
  chat.sendPublicMessage({
    type: "PublicMsg",
    senderId: alice.id,
    receiverId: "all",
    content: "Hello world!"
  });
  assert.strictEqual(chat.chatMessages.length, 1);

  // 2. Private message
  chat.sendPrivateMessage({
    type: "PrivateMsg",
    senderId: alice.id,
    receiverId: bob.id,
    content: "Hi Bob"
  });
  assert.strictEqual(chat.chatMessages.length, 2);

  // 3. Blocked user cannot send private msg
  bob.blockId(alice.id);
  assert.throws(() => {
    chat.sendPrivateMessage({
      type: "PrivateMsg",
      senderId: alice.id,
      receiverId: bob.id,
      content: "Still there?"
    });
  });

  // ✅ unblock before testing game invite
  bob.unblockId(alice.id);

  // 4. Private game invite auto-fills content if empty
  chat.sendPrivateGameInviteMessage({
    type: "PrivateGameInviteMsg",
    senderId: alice.id,
    receiverId: bob.id,
    content: "" // should be replaced with default invite text
  });
  const lastInvite = chat.chatMessages[chat.chatMessages.length - 1] as Types.MessagePrivateGameInvite;
  assert.strictEqual(lastInvite.content, Types.MESSAGE_GAME_INVITE);

  // 5. Tournament system message
  chat.sendTournamentMessage({
    type: "TournamentMsg",
    senderId: Types.SYSTEM_ID,
    receiverId: alice.id,
    content: "" // should be replaced with default tournament text
  });
  const lastTournament = chat.chatMessages[chat.chatMessages.length - 1] as Types.MessageTournament;
  assert.strictEqual(lastTournament.content, Types.MESSAGE_TOURNAMENT_INVITE);

  // 6. Empty public message → throws
  assert.throws(() => {
    chat.sendPublicMessage({
      type: "PublicMsg",
      senderId: alice.id,
      receiverId: "all",
      content: ""
    });
  });
}

runChatTests();
console.log(":) Chat tests passed :) ");
