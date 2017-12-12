var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twit = require('twit');
var moment = require("moment");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require("./config");

server.listen(8092);

var index = require('./routes/index');

var client = new Twit(config);

tweets = {};

function processTweets(tweets) {
  for (i in tweets) {
    // socket.emit("tweet", i);
    processTweet(tweets[i]);
  }
}

function processTweet(tweet) {
  if (tweet.user.id_str === "3659410877") {
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
    io.emit("tweet", tweets[id]);
  }
  // console.log(tweets[id]);
}

client.get('statuses/user_timeline', { screen_name: "009minions" }, function (error, tweets, response) {
  // console.log(tweets);
  processTweets(tweets)
});

var stream = client.stream("statuses/filter", { follow: "3659410877" });
stream.on("tweet", function(tweet) {
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
  console.log("EMITTING TO SOCKETS!", tweet.text);
  io.emit("tweet", tweets[id]);
})

stream.on("limit", function(limitMessage) {
  console.error("Limiting:", limitMessage);
});

stream.on("disconnect", function(disconnectMessage) {
  console.error("Disconnected!", disconnectMessage);
});

stream.on("connect", function(connectMessage) {
  console.log("Connected!");
});

stream.on('reconnect', function (request, response, connectInterval) {
  console.log("Reconnecting in", connectInterval / 1000, "seconds...");
});

io.on('connection', function(socket) {
  var sortedTweets = Object.keys(tweets).map(function(tweetId) {
    return tweets[tweetId];
  }).sort(function(tweetA, tweetB) {
    if (moment(tweetA.timestamp).isAfter(moment(tweetB.timestamp))) {
      return 1;
    } else if (moment(tweetA.timestamp).isBefore(moment(tweetB.timestamp))) {
      return -1;
    } else {
      return 0;
    }
  })
  for (var tweet of sortedTweets) {
    socket.emit("tweet", tweet);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
