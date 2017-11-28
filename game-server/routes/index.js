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
  var sessionKey = req.body.sessionId;
  var score = req.body.score;
  var name = req.body.name;
  var color = req.body.color;
  if (sessionKey == null || score == null || name == null) {
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
        && isValidScore(snapshot.val().startTime, now, score)) {
        // yay we're valid, make a transaction to update the score
        sessionRef.transaction(function(currentSession) {
          if (currentSession == null || currentSession.score == null) {
            return {
              startTime: currentValue.startTime,
              endTime: moment(now).toISOString(),
              name: name.toUpperCase(),
              color: color != null ? color.toUpperCase() : "WHITE",
              score,
            };
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
        res.send({ error: "Invalid session key" });
      }
    });
  }
});

router.get("/scores/:numScores?", function(req, res) {
  firebase.database().ref("games").once("value", function(snapshot) {
    // scores indexed by name, only recording the max for the name. case insensitive
    var maxGameScores = {};
    snapshot.forEach(function(childSnapshot) {
      var gameData = childSnapshot.val();
      if (gameData.score !== undefined &&
        gameData.endTime !== undefined &&
        gameData.startTime !== undefined &&
        moment(gameData.endTime).isAfter(gameData.startTime)) {
        if (maxGameScores[gameData.name] === undefined) {
          maxGameScores[gameData.name] = gameData;
        } else if (maxGameScores[gameData.name].score < gameData.score) {
          maxGameScores[gameData.name] = gameData;
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

function isValidScore(startTime, endTime, proposedScore) {
  // todo
  return true;
}

module.exports = router;
