var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

var config = require('../config');

tweets = {};

module.exports = function(io) {
  var client = new Twitter(config);

  io.on("connection", function(socket) {
    processTweets = function (tweets) {
      for (i in tweets) {
        // socket.emit("tweet", i);
        processTweet(tweets[i]);
      }
    }

    processTweet = function (tweet) {
      id = tweet.id;
      tweets[id] = {
        id: tweet.id_str,
        timestamp: tweet.created_at,
        entities: tweet.entities,
        text: tweet.text,
        tweet: tweet,
      }
      media = tweet.entities.media;
      if (media) {
        tweets[id].media = media[0].media_url
      }
      socket.emit("tweet", tweets[id]);
      // console.log(tweets[id]);
    }

    client.get('statuses/user_timeline', { count: 10, screen_name: "009minions" }, function (error, tweets, response) {
      // console.log(tweets);
      processTweets(tweets)
    });

    client.stream('statuses/filter', { follow: "3659410877" }, function (stream) {
      stream.on('data', function (event) {
        processTweet(event);
      });

      stream.on('error', function (error) {
        console.log(error);
      });
    });
  })


  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.render('index', { title: 'Express' });
  });

  router.get('/tweets', function(req, res, next) {
    res.json(tweets);
  });

  return router;
};
