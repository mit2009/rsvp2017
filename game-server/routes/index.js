var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var moment = require("moment");

var serviceAccount = require("../config/productmangame-firebase-adminsdk.json");

var firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://productmangame.firebaseio.com"
});

router.post('/start', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  var initialData = {
    startTime: new Date(),
  };
  var newSession = firebase.database().ref().child("games").push().key;
  firebase.database().ref(`games/${newSession}`).update(initialData).then(function() {
    res.send({ sessionId: newSession });
  }, function(error) {
    res.send({ error });
  });
});

router.post("/end", function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  var sessionKey = req.body.sessionId;
  var score = req.body.score;
  var name = req.body.name;
  var color = req.body.color;
  if (sessionKey == null || score == null) {
    res.send({ error: "Incomplete data" });
  } else {
    var sessionRef = firebase.database().ref(`games/${sessionKey}`);
    var now = new Date();
    sessionRef.once("value").then(function(snapshot) {
      // exists and was not ended before
      var currentValue = snapshot.val();
      if (currentValue != null
        && currentValue.score == null
        && currentValue.startTime != null
        && score !== undefined
        && !isNaN(score)
        && moment(now).isAfter(moment(currentValue.startTime))
        && isValidScore(currentValue.startTime, now, score)) {
        // yay we're valid, make a transaction to update the score
        const scoreData = {
          startTime: currentValue.startTime,
          endTime: moment(now).toISOString(),
          color: color != null ? color.toUpperCase() : "WHITE",
          score,
        };
        if (name !== undefined) {
          scoreData.name = name.toUpperCase().slice(0, 15);
        }
        sessionRef.transaction(function(currentSession) {
          if (currentSession == null || currentSession.score == null) {
            return scoreData;
          } else {
            // someone else has snuck in a score, abort transaction
            return;
          }
        }, function(error, committed, snapshot) {
          if (error) {
            res.send({ error });
          } else if (!committed) {
            res.send({ error: "Unable to save score since score already exists." });
          } else {
            res.send({ success: true });
          }
        });
      } else {
        res.send({ error: "Invalid session key or score" });
      }
    });
  }
});

router.post("/updateName", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  var name = req.body.name;
  var sessionId = req.body.sessionId;
  if (name != null && sessionId != null) {
    firebase.database().ref(`games/${sessionId}`).update({ name: name.toUpperCase().slice(0, 15) }).then(function() {
      res.send({ success: true });
    }, function(error) {
      res.send({ error });
    })
  } else {
    res.send({ error: "Name is required." });
  }
})

router.get("/scores/:numScores?", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  firebase.database().ref("games").once("value", function(snapshot) {
    // scores indexed by name, only recording the max for the name. case insensitive
    var maxGameScores = {};
    snapshot.forEach(function(childSnapshot) {
      var gameData = childSnapshot.val();
      if (gameData.score !== undefined &&
        gameData.name !== undefined &&
        gameData.name.length > 0 &&
        gameData.endTime !== undefined &&
        gameData.startTime !== undefined &&
        moment(gameData.endTime).isAfter(gameData.startTime)) {
        if (maxGameScores[gameData.name] === undefined ||
          maxGameScores[gameData.name].score < parseInt(gameData.score, 10)) {
          maxGameScores[gameData.name] = { ...gameData, score: parseInt(gameData.score, 10) };;
        }
      }
    });
    var scores = Object.keys(maxGameScores)
      .map(function(key) {
        return maxGameScores[key];
      })
      .sort(function(gameA, gameB) {
        if (gameA.score > gameB.score) {
          return -1;
        } else if (gameA.score < gameB.score) {
          return 1;
        } else {
          return moment(gameA.startTime).isBefore(gameB.startTime) ? -1 : 1;
        }
      });
    var numScores = req.params.numScores;
    if (numScores !== undefined) {
      numScores = parseInt(numScores, 10);
      if (!isNaN(numScores)) {
        scores = scores.slice(0, numScores);
      }
    }
    res.send({ scores });
  });
});

// router.get("/delete/:sessionId", function(req, res) {
//   firebase.database().ref("games/" + req.params.sessionId).remove().then(function() {
//     res.send({ success: true });
//   });
// })

function isValidScore(startTime, endTime, proposedScore) {
  var millisecondsPassed = moment(endTime).diff(moment(startTime), "milliseconds");
  var baseScore = Math.floor(millisecondsPassed / 42);
  var tickToDebris = 30;
  var gemScore = baseScore;
  var numGems = 0;
  while (gemScore > 0) {
    gemScore -= tickToDebris;
    numGems += 1;
    tickToDebris = Math.max(1, tickToDebris - 1);
  }
  var parsedProposedScore = parseInt(proposedScore, 10);
  return baseScore > 30 ? baseScore + Math.floor(numGems / 8) * 1000 + numGems + 100 >= parsedProposedScore : baseScore >= parsedProposedScore;
}

module.exports = router;
