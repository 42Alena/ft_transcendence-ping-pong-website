
# HTTP response status codes

 https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status

```
	HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:

    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
```

---

# 🌐 HTTP Status Classes (from MDN)

HTTP response status codes indicate whether a specific HTTP request has been successfully completed.
Responses are grouped in five classes:

* **Informational responses (100–199)**
* **Successful responses (200–299)**
* **Redirection messages (300–399)**
* **Client error responses (400–499)**
* **Server error responses (500–599)**

> For ft_transcendence we only use **2xx**, **4xx**, and **5xx**.
> * **2xx** → success (`GET`, `POST`, `DELETE`, etc.).
> * **4xx** → client mistakes (auth, validation, rate limits, bad input).
> * **5xx** → server faults (should appear only during dev/testing).
---

## ✅ 2xx — Successful responses

|    HTTP | MDN Reason Phrase | When we use it (examples)                                                                                                                    |
| ------: | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **200** | OK                | General success for `GET` routes (user profile, user list, chat messages, threads, tournaments, match history, settings, GDPR export ready). |
| **201** | Created           | Resource created via `POST`: new user registered, message sent, game invite created, match result stored.                                    |
| **204** | No Content        | State changes with no response body: friend added/removed, user blocked/unblocked, logout successful, profile updated (PUT).                 |

---

## ⚠️ 4xx — Client error responses

|    HTTP | MDN Reason Phrase                | `code` (our JSON)              | Typical triggers in ft_transcendence                                                                                                                                                                        |
| ------: | -------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | Bad Request                      | `bad_request`                  | Missing required field, malformed JSON, invalid query (`after` not ISO date), wrong content-type, file without filename, invalid enum (game mode).                                                          |
| **401** | Unauthorized                     | `bad_credentials`              | Login failed: username/password mismatch, empty fields, password not matching hash.                                                                                                                         |
| **401** | Unauthorized                     | `jwt_invalid`                  | JWT missing, expired, or invalid on any protected API (`/user/me`, `/chat/*`, `/friends/*`, `/tournament/*`).                                                                                               |
| **403** | Forbidden                        | `forbidden`                    | Accessing another user’s private data (`/user/:id/settings`), deleting another account, updating non-owned resource.                                                                                        |
| **403** | Forbidden                        | `blocked_by_user`              | Attempting to message, invite, or friend someone who blocked you.                                                                                                                                           |
| **404** | Not Found                        | `not_found` / `user_not_found` | User ID doesn’t exist, chat thread missing, tournament ID invalid, match record deleted, blocked user not in DB.                                                                                            |
| **409** | Conflict                         | `username_taken`               | Registration username already exists in DB.                                                                                                                                                                 |
| **409** | Conflict                         | `display_name_taken`           | Display name not unique (frontend and tournament use unique alias).                                                                                                                                         |
| **409** | Conflict                         | `already_friends`              | Adding friend when already friends.                                                                                                                                                                         |
| **409** | Conflict                         | `not_friends`                  | Removing friend that doesn’t exist.                                                                                                                                                                         |
| **409** | Conflict                         | `already_blocked`              | Trying to block already-blocked user.                                                                                                                                                                       |
| **409** | Conflict                         | `not_blocked`                  | Trying to unblock someone not blocked.                                                                                                                                                                      |
| **409** | Conflict                         | `already_reported`             | Duplicate match result submission or duplicate game save.                                                                                                                                                   |
| **409** | Conflict                         | `conflict`                     | General duplicate action (multiple invites in <5s, same payload already exists, repeated profile update).                                                                                                   |
| **413** | Payload Too Large                | `avatar_too_large`             | Avatar file too big (max 1 MB), multipart upload exceeds limit.                                                                                                                                             |
| **415** | Unsupported Media Type           | `avatar_type_not_allowed`      | Wrong file type (not `image/png` or `image/jpeg`).                                                                                                                                                          |
| **422** | Unprocessable Content *(Entity)* | `validation_error`             | Field validation failed: username too short/long, displayName contains invalid chars, password too weak, avatar URL invalid, message empty or too long, invalid match score, missing required GDPR consent. |
| **426** | Upgrade Required                 | `upgrade_required_tls`         | Plain HTTP/WSS attempt (backend configured for HTTPS/WSS only).                                                                                                                                             |
| **429** | Too Many Requests                | `too_many_requests`            | Spam or flood: user sends >10 messages/10 s, too many login attempts, repeated invites, excessive avatar uploads.                                                                                           |
| **451** | Unavailable For Legal Reasons    | `account_deleted_gdpr`         | Accessing account or profile after GDPR erasure request completed.                                                                                                                                          |

---

### Example payload (422)

```json
{
  "error": "Validation failed",
  "code": "validation_error",
  "details": {
    "username": ["too_short","bad_chars"],
    "displayName": ["taken"],
    "passwordPlain": ["too_weak"],
    "text": ["too_long"],
    "avatar": ["type_not_allowed"]
  }
}
```

---

## 💥 5xx — Server error responses

|    HTTP | MDN Reason Phrase     | `code` (our JSON) | Typical triggers in ft_transcendence                                                                                                                                           |
| ------: | --------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **500** | Internal Server Error | `internal_error`  | DB failure (SQLite locked or schema error), uncaught Fastify exception, bcrypt/hash crash, file system write error (avatars), unhandled async rejection, misconfigured `.env`. |

---

## 📦 JSON error shape (all responses)

```json
{
  "error": "short human text",
  "code": "kebab_case_identifier",
  "details": { /* optional per-field info */ }
}
```

---





