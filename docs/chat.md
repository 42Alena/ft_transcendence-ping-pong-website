# create ID
```bash
😸node
> const crypto = require("crypto")
> crypto.random
# crypto.randomBytes     crypto.randomFill      crypto.randomFillSync  crypto.randomInt       crypto.randomUUID
> crypto.randomBytes(12).toString('hex')
# 'e2210f2a7b65c23a57e3a5e1'
```
 From frontend button/actions:
  
- get messages common chat
- get messages private chat
- get names for  private chat

-get my profile
-get my notification
-get userProfile by id (must be in routes chat, and frontend)
- get all Users
- get get friends
- get blocked

curl localhost:3000/chat
curl localhost:3000/chat/channels
