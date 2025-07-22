```mermaid
flowchart TD
  %% COLORS for teammates
  classDef alena fill:#e7f1ff,stroke:#0d6efd,stroke-width:1px,color:#0d6efd
  classDef luis fill:#d1e7dd,stroke:#198754,stroke-width:1px,color:#198754
  classDef sveva fill:#fff3cd,stroke:#ffc107,stroke-width:1px,color:#856404
  classDef shared fill:#f8f9fa,stroke:#6c757d,stroke-dasharray: 5 5

  %% START
  Start([User opens ft_transcendence.com]) --> NGINX[Static Server (Nginx/Docker)]

  %% FRONTEND FLOW
  NGINX --> FE1[Load index.html]
  FE1 --> FE2[Login UI]:::luis
  FE2 --> BE1[POST /login API]:::luis
  BE1 --> BE2[Verify password + issue JWT]:::luis
  BE2 --> BE3[2FA validation]:::luis
  BE3 --> FE4[Homepage: Friends + Chat + Settings]
  BE3 -->|Failed| FE2

  %% WEBSOCKET FLOW
  FE4 --> WS1[Connect WebSocket]:::alena
  WS1 --> WS_JOIN[Join Game Room]:::alena
  FE4 --> ChatUI[Chat UI Panel]:::alena
  ChatUI --> WS2[Send Chat Message]:::alena
  WS2 --> WS_BROADCAST[Broadcast to Room]:::alena

  %% CHAT INVITE FLOW
  ChatUI --> INVITE[Invite Friend to Match]:::alena
  INVITE --> GameChoice

  %% GAME SELECTION
  FE4 --> GameChoice[Select Game Mode]
  GameChoice -->|vs Player| FE6[Game Canvas]:::sveva
  GameChoice -->|vs AI| AI_LOGIC[AI Opponent Logic]:::sveva

  %% GAME ENGINE FLOW
  FE6 --> G1[Game Sync: Paddle + Ball]:::sveva
  G1 --> WS3[Emit Move Event]:::alena
  WS3 --> WS_BROADCAST
  WS_BROADCAST --> FE6
  FE6 --> G2[Collision & Scoring]:::sveva
  G2 --> G3[Game Over → Calculate Score]:::sveva
  G3 --> BE6[Save Match to DB]:::luis

  %% AI LOGIC
  AI_LOGIC --> G1
  AI_LOGIC --> AI_REFRESH[Refresh every 1 second]:::sveva

  %% DISCONNECT HANDLING
  WS1 -->|Disconnect| FE4
  FE6 -->|Player leaves| G3

  %% SHARED MODULES
  FE1 --> SH1[Shared: constants.js]:::shared
  BE1 --> SH1
  G1 --> SH1
  WS1 --> SH2[Shared: socket_events.js]:::shared

  %% PROJECT FILES
  subgraph ProjectFiles[Project Files]
    Docs[docs/: system, auth, sockets, ai...]
    Tasks[tasks/: TODO, DONE, PLAN per teammate]
  end

  %% CLASS ASSIGNMENTS
  class ChatUI,WS1,WS2,WS3,WS_BROADCAST,INVITE alena
  class BE1,BE2,BE3,BE6 luis
  class G1,G2,G3,FE6,AI_LOGIC,AI_REFRESH sveva
  class SH1,SH2 shared
```
