var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twitter = require('twitter');

var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var client = new Twitter(config);

/*

client.get('search/tweets', {q: '%40009minions'}, function(error, tweets, response) {
  for (i in tweets.statuses) {
    console.log(tweets.statuses[i].text)
  }
});
*/

tweets = {};

processTweets = function (tweets) {
  for (i in tweets) {
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
  console.log(tweets[id]);
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
    throw error;
  });
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
app.use('/users', users);

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
