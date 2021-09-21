const defaultOptions = {
	gametype: "ffa",
	private: "false",
  maxWordFrequency: 500,
  minWordFrequency: 100,
	freqMarginStart: 4,
	freqMarginScale: 50,
	startingLives: 3,
	startingTime: 20,
	maxTime: 5,
	minTime: 1,
	timeMarginStart: 4,
	timeMarginScale: 1,
	lengthBonusStart: 8,
	lengthBonusEnd: 14,
	lengthBonusMin: 1,
	lengthBonusMax: 2,
};

var sqlite = require("better-sqlite3");
var wordListDb = new sqlite("./word_list.db");

function getSubstring(frequency) {
	let sql =
		"SELECT * FROM substrings WHERE frequency>? ORDER BY RANDOM() LIMIT 1";
	var row = wordListDb.prepare(sql).get(frequency);
	return row.substring;
}

function checkWord(usedWords, word, substring) {
  if (usedWords.contains(word)) {
		return {status:false, error:"Word already used."};
  }
	let sql = "SELECT * FROM words WHERE word=?";
	var row = wordListDb.prepare(sql).get(word);
	if (row && word.includes(substring)) {
		return {status:true};
	} else {
		return {status:false, error:"Word doesn't exist."};
	}
}

const Player = require("./Player");
const { sendClient } = require("../globalFunctions");

class Match {
	constructor(players, options) {
		this.started = false;
		if (options) {
			this.options = { ...defaultOptions, ...options };
		} else {
			this.options = defaultOptions;
		}
		this.players = players.map(
			(player) => new Player(player.client, player.data, this.options)
		);
		this.round = 0;
		this.combo = 0;
		this.currentPlayer = 0;
		this.id = this.options.id;
		this.substring = "";
    this.usedWords = []
		this.sendAll("matchData", {
			players: players.map((player) => player.data.identity),
			options: this.options,
		});
		if (this.options.gametype == "ranked") {
			this.startGame();
	  }
	}
	sendAll(type, payload) {
		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i];
			sendClient(player.client, type, payload);
		}
	}
	playerLost(player) {
		this.sendAll("lostLife", player.identity);
		this.nextRound();
	}
	gameOver(winner) {
		console.log("GAME OVER");
		this.sendAll("gameOver", { winner: winner.identity });
	}
	nextRound() {
		if (this.players.filter((player) => player.lives != 0).length == 1) {
			this.gameOver(this.players.find((player) => player.lives != 0));
			return;
		}
		do {
			this.currentPlayer++;
			this.currentPlayer %= this.players.length;
		} while (this.players[this.currentPlayer].lives == 0);

		this.round++;

    var frequency = this.options.maxWordFrequency
    if (this.combo > this.options.freqMarginStart) {
      frequency = Math.max(this.options.maxWordFrequency -
      (this.combo - this.options.freqMarginStart) * this.options.freqMarginScale ,this.options.minWordFrequency)
      this.sendAll("difficultyUp", {
        frequency
      });
    }
    console.log(frequency);
		this.substring = getSubstring(frequency);

		var player = this.players[this.currentPlayer];
		this.sendAll("startTurn", {
			player: player.identity,
			substring: this.substring,
			time: player.remainingTime,
		});
		this.players[this.currentPlayer].startTurn(this);
	}
	startGame() {
		this.started = true;
		this.sendAll("startGame", { roomId: this.options.id });
		setTimeout(() => {
			this.nextRound();
		}, 3000);
	}
	calculateTime(word) {
		var bonusMultiplier = 1;
		if (word.length > this.options.lengthBonusStart) {
			var lengthRange =
				this.options.lengthBonusEnd - this.options.lengthBonusStart;
			var bonusRange =
				this.options.lengthBonusMax - this.options.lengthBonusMin;
			bonusMultiplier =
				Math.min(
					((word.length - this.options.lengthBonusStart) / lengthRange) *
						bonusRange,
					bonusRange
				) + bonusRange;
		}
		var modifiedAddedTime = this.options.maxTime;
		if (this.combo > this.options.timeMarginStart) {
			modifiedAddedTime = Math.max(
				this.options.maxTime -
					(this.combo - this.options.timeMarginStart) * this.options.timeMarginScale,
				this.options.minTime
			);
		}
		return [modifiedAddedTime, bonusMultiplier];
	}
	submitWord(identity, word, substring) {
		word = word.toLowerCase();
		var player = this.players[this.currentPlayer];
		if (identity != player.identity) {
			return;
		}
    var check = checkWord(word, substring)
		if (!check.status) {
			this.sendAll("failedSubmit", { identity, reason:check.error });
			return;
		}
		var addedTimes = this.calculateTime(word);
		this.combo++;
    this.usedWords.push(word)
		player.endTurn(this, ...addedTimes);
	}
}

module.exports = Match;
