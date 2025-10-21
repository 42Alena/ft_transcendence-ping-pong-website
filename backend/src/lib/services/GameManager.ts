
	/* 
	
	* 
	from USER class. Need adapt
	
	
		//________Game
		addMatch(opponentId: Types.UserId, result: Types.GameResult) {
			this.matchHistory.push({
				opponentId: opponentId,
				date: new Date(),
				result: result
			});
		}
	
		get resultWon(): number {
			const wins = this.matchHistory.filter(match => match.result == "won");
			return wins.length;
		}
	
		get resultLost(): number {
			const lose = this.matchHistory.filter(match => match.result == "lost");
			return lose.length;
		}
	
	
	*/