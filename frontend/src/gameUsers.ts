async function sendMatchResult(type : string, round : string, player1 : string, player2 : string, score1 : string, score2 : string)
{
	const match = {
    mode: type,
    tournamentRound: round,
    player1Alias: player1,
    player1Score: score1,
    player2Alias: player2,
    player2Score: score2
  };
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(`${BACKEND_URL}/games/normal/save`, {
    method: "POST",
    body: JSON.stringify(match),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
        if(response.status != 204)
        {
          const data = await response.json();
        }
      }
  }
  catch (error) {
    console.error("Error during registration:", error);
  }
};

async function sendMatchTournamentResult(type : string, round : string, player1 : string, player2 : string, score1 : number, score2 : number)
{
	const match = {
    mode: type,
    tournamentRound: round,
    player1Alias: player1,
    player1Score: score1,
    player2Alias: player2,
    player2Score: score2
  };
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const myRequest = new Request(`${BACKEND_URL}/games/tournament/save`, {
    method: "POST",
    body: JSON.stringify(match),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      if(response.status != 204)
        {
          const data = await response.json();
        }
      }
  }
  catch (error) {
    console.error("Error during registration:", error);
  }
};

async function tournamentNotification(player : string)
{
  const playerToNotify = {
    displayName : player
  };
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const myRequest = new Request(`${BACKEND_URL}/chat/messages/tournament`, {
    method: "POST",
    body: JSON.stringify(playerToNotify),
    credentials: "include",
    headers: myHeaders,
  });
  try {
    const response = await fetch(myRequest);
    console.log(response);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    } else {
      }
  }
  catch (error) {
    console.error("Error during registration:", error);
  }
};