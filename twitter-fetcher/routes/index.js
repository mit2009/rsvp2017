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
        text: tweet.text
      }
      media = tweet.entities.media;
      if (media) {
        tweets[id].media = media[0].media_url
      }
      socket.emit("tweet", tweets[id]);
      // console.log(tweets[id]);
    }
    
    client.get('statuses/user_timeline', { screen_name: "009minions" }, function (error, tweets, response) {
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
    res.render('index', { title: 'Express' });
  });
  
  router.get('/tweets', function(req, res, next) {
    res.json(tweets);
  });

  return router;
};
