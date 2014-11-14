//
// GameStatsService: Maintains game statistics required thru out the application. Normally, we would interact with an API of some sort,
//  but here we will simply use some static data. There will be the ability to create a game which can be started, udpated, and finished.
//  As a new game is finished, it will affected the rankings.
//
//  Public API:
//
//    rankings: List of plays ranked from highest to lowest.
//    gameFactory: Create a new game    
//
angular.module('myApp.services.GameStats', []).factory('GameStatsService', [
	function() {

    var logPrefix = 'myApp.services.GameStats: ';

    //
    // game: Represents our game.
    //
    //  methods:
    //    gameFactory(player1, player2): Use this method to create a new game.
    //  attributes:
    //    id: Unique ID to identify each game. Integer.
    //    player1
    //    player2
    //    score1
    //    score2
    //    status: 
    //      0 -> not started, 
    //      1 -> being played,
    //      2 -> already played and completed
    //
    var nextGameID = 0;
    var gamePrototype = {
      NOT_STARTED: 0,
      PLAYING: 1,
      PLAYED: 2,
      startGame: function() {
        this.status = (this.status === this.NOT_STARTED) ? this.PLAYING : this.status;
      },
      updateGame: function(player) {
        if (this.status === this.PLAYING) {
          if (this.player1 === player) {
            this.score1 = this.score1 + 1;
          }
          else if (this.player2 === player) {
            this.score2 = this.score2 + 1;
          }
        }
      },
      finishGame: function() {
        if (this.status === this.PLAYING) {
          this.status = this.PLAYED;
          onGameFinished(this);
        }
      }
    };
    function gameFactory(player1, player2) {
      var o = Object.create(gamePrototype);

      o.id = nextGameId;
      nextGameId++;
      o.player1 = player1;
      o.player2 = player2;
      o.score1 = 0;
      o.score2 = 0;
      o.status = o.NOT_STARTED;
      return o;
    }

    //
    // played: Scores for games previously played. Most recently finished games 
    //  go to the beginning.
    //
    var played = [
      { "player1": "Alex", "score1": 4, "player2": "Cathy", "score2": 5 },
      { "player1": "Alex", "score1": 1, "player2": "Cathy", "score2": 5 },
      { "player1": "Alex", "score1": 2, "player2": "Cathy", "score2": 5 },
      { "player1": "Alex", "score1": 0, "player2": "Cathy", "score2": 5 },
      { "player1":  "Alex", "score1": 6, "player2": "Cathy",  "score2": 5 },
      { "player1":  "Alex", "score1": 5, "player2": "Cathy",  "score2": 2 },
      { "player1":  "Alex", "score1": 4, "player2": "Cathy",  "score2": 0 },
      { "player1":  "Joel" ,  "score1": 4, "player2": "Cathy",  "score2": 5 },
      { "player1":  "Tim" , "score1": 4, "player2": "Alex", "score2": 5 },
      { "player1":  "Tim" , "score1": 5, "player2": "Alex", "score2": 2 },
      { "player1":  "Alex", "score1": 3, "player2": "Tim",    "score2": 5 },
      { "player1":  "Alex", "score1": 5, "player2": "Tim",    "score2": 3 },
      { "player1":  "Alex", "score1": 5, "player2": "Joel",   "score2": 4 },
      { "player1":  "Joel" , "score1": 5, "player2": "Tim",   "score2": 2 }
    ];

    //
    // playing: Scores for games being played. Same structure as pastScores,
    //  but a hash of game.id -> game.
    //
    var playing = {};

    //
    // rankings: array of rankings. 
    //
    //  ranking:
    //    player: name
    //    wins: integer
    //    loses: integer
    //
    function Ranking(player, wins, loses, ties) {
      this.player = player;
      this.wins = wins;
      this.loses = loses;
      this.ties = ties;
    }
    Ranking.prototype.update = function(score, otherScore) {
      if (score > otherScore) {
        this.wins = this.wins + 1;
      }
      else if (score < otherScore) {
        this.loses = this.loses + 1;
      }
      else {
        this.ties = this.ties + 1;
      }
    };
    var rankings = [];
    //
    //  rankingsByPlayer: Simply a hash of ranking.player -> ranking
    //    Allows us to lookup ranking for a player, and determing whether
    //    we have a new player to add to rankings.
    //
    var rankingsByPlayer = {}

    //
    // updateRankings
    //
    function updateRankings(game) {
      var lp = logPrefix.replace(': ', '.updateRanings: ');

      console.log(lp + 'Rankings being updated...');

      var ranking;
      if (rankingsByPlayer.hasOwnProperty(game.player1)) {
        ranking = rankingsByPlayer[game.player1];
        ranking.update(game.score1, game.score2);
      }
      else {
        var w = game.score1 > game.score2 ? 1 : 0;
        var l = game.score1 < game.score2 ? 1 : 0;
        var t = game.score1 === game.score2;
        ranking = new Ranking(game.player1, w, l, t);
        rankingsByPlayer[game.player1] = ranking;
        rankings.push(ranking);
      }
      if (rankingsByPlayer.hasOwnProperty(game.player2)) {
        ranking = rankingsByPlayer[game.player2];
        ranking.update(game.score2, game.score1);
      }
      else {
        var w = game.score2 > game.score1 ? 1 : 0;
        var l = game.score2 < game.score1 ? 1 : 0;
        var t = game.score2 === game.score1;
        ranking = new Ranking(game.player2, w, l, t);
        rankings.push(ranking);
      }
      rankings.sort(function(r1, r2) {
        if (r1.wins > r2.wins) {
          return -1;
        }
        else if (r1.wins < r2.wins) {
          return 1;
        }
        else {
          if (r1.loses < r2.loses) {
            return -1;
          }
          else if (r1.loses > r2.loses) {
            return 1;
          }
          else {
            //
            // look at num played. More played wins.
            //
            var p1 = r1.wins + r1.loses + r1.ties;
            var p2 = r2.wins + r2.loses + r2.ties;
            return (p1 > p2) ? -1 : (p1 < p2) ? 1 : 0;
          }
        }
      });
    }

    function onGameFinished(game) {
      var lp = logPrefix.replace(': ', '.onGameFinshed: ');

      console.log(lp + 'Game w / id - ' + game.id + ' finished, will update rankings...');

      if (playing.hasOwnProperty(game.id)) {

        var g = playing[game.id];

        delete playing[game.id];
        played.shift(g);

        updateRankings(g);
      }
    }

    return {
      rankings: rankings,
      gameFactory: gameFactory
    };

  }
]);
