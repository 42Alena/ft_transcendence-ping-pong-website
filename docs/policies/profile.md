# Profile Page requirements

### profiles must be visible only to authenticated users
	Public (no login): main page /, login /login, register /register.

	Private (login required): /profile/:id (any profile), chat, friends, matches.

# 🧍‍♀️ MY PROFILE (own profile view)

### **Header**

| Element                    | Required by     | Description                                                |
| -------------------------- | --------------- | ---------------------------------------------------------- |
| **Avatar**                 | User Management | User’s profile picture (default if none).                  |
| **Display Name**           | User Management | Public name shown everywhere (chat, matches, friend list). |
| **Online / Offline Badge** | User Management | Shows current user status.                                 |

🚫 **Not shown here:** username, edit buttons, stats, or actions.
Those belong to the **tabs** below.

---

### **Navigation Bar (Tabs)**

1. **Account / Settings**
2. **Friends**
3. **Matches**

---

### **Account / Settings Tab**

| Field              | Editable        | Required by     | Description                                                    |
| ------------------ | --------------- | --------------- | -------------------------------------------------------------- |
| **Username**       | ❌ Read-only     | User Management | Internal login name, visible only to the owner (never public). |
| **Display Name**   | ✅ Editable      | User Management | Public name that appears in profile, chat, and match history.  |
| **Avatar**         | ✅ Editable      | User Management | Update public profile picture.                                 |
| **Password**       | ✅ Editable      | User Management | Change account password.                                       |
| **Delete Account** | ✅ Action Button | GDPR            | Permanently delete user data (mandatory for GDPR).             |

---

### **Friends Tab**

| Element             | Required by     | Description                                                           |
| ------------------- | --------------- | --------------------------------------------------------------------- |
| **Friends List**    | User Management | Show avatar, display name, and online/offline status for each friend. |
| **Remove Friend**   | User Management | Unfriend a user.                                                      |
| **Block / Unblock** | Live Chat       | Restrict or allow chat/game interactions.                             |

---

### **Matches Tab**

| Element                   | Required by     | Description                                   |
| ------------------------- | --------------- | --------------------------------------------- |
| **Match History**         | User Management | List past matches: opponent, date, and score. |
| **Wins / Losses Summary** | User Management | Display total user statistics.                |

---

# 👤 OTHER USER’S PROFILE (opened from chat or search)

### **Header**

| Element                    | Required by     | Description                             |
| -------------------------- | --------------- | --------------------------------------- |
| **Avatar**                 | User Management | Target user’s avatar (default if none). |
| **Display Name**           | User Management | Public name.                            |
| **Online / Offline Badge** | User Management | Show user’s status.                     |

🚫 **Not shown here:** username, settings icon, edit buttons, or stats.

---

### **Navigation Bar (Tabs)**

* **Friends**
* **Matches**
  *(Hide Account/Settings tab)*

---

### **Friends Tab**

| Element                 | Required by     | Description                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------- |
| **Friendship Status**   | User Management | Show if user is already a friend.                             |
| **Add / Remove Friend** | User Management | Manage friendship.                                            |
| **Block / Unblock**     | Live Chat       | Block or unblock this user.                                   |
| **Invite to Play**      | Live Chat       | Send game invitation (only appears on other users’ profiles). |

---

### **Matches Tab**

| Element                   | Required by     | Description                         |
| ------------------------- | --------------- | ----------------------------------- |
| **Match History**         | User Management | Show opponent, date, and score.     |
| **Wins / Losses Summary** | User Management | Display user’s statistics (public). |

---

# ✅ COMPLIANCE SUMMARY

| Module                       | Mandatory Features Covered                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Standard User Management** | Avatar, display name, friends list with online/offline status, match history, wins/losses, editable info (display name, avatar, password). |
| **Live Chat**                | Profiles openable from chat, block/unblock users, invite to play.                                                                          |
| **GDPR**                     | Delete account (complete data removal).                                                                                                    |

---

**Frontend instruction:**

* Header = only **Avatar + Display Name + Status**.
* Tabs below contain everything else (Account/Settings, Friends, Matches).
* “Invite to Play” button = only on **other user’s profile**.
* Friendship = **mutual** (backend inserts both directions).
* Username = only in **Account/Settings** (read-only, private).

---
# profiles must be visible only to authenticated users



# Access rules

* **Public (no login):** main page **/**, login **/login**, register **/register**.
* **Private (login required):** **/profile/:id** (any profile), chat, friends, matches.

# Redirects (SPA)



* **After successful registration →** `/profile/{me}?tab=settings`
* **After login →** `/`
* **Click “My Profile” (menu) →** `/profile/{me}`
* **Click a username (chat/friends/matches) →** `/profile/{id}`
* **Open any `/profile/:id` while unauthenticated →** `/login`
* **After account deletion →** `/` *(or `/login` if you also clear auth there)*
* **Profile not found →** `/not-found` *(or show a 404 view)*

(No redirect after saving settings; stay on the same tab.)


# Backend enforcement (must)

* Protect API routes:

  * `GET /users/:id/profile` → **401** if no/invalid auth.
  * `GET /me/settings` → **401** if no auth.
* Never return `username` in public profile payloads.
* Compute flags server-side: `isSelf`, `friendshipStatus`, `canInvite`, `isBlockedByMe`, `hasBlockedMe`.

# Frontend conditionals (display only after auth)

* Render profile page **only after** successful fetch of `/users/:id/profile`.
* If fetch returns **401**, route to **/login**.
