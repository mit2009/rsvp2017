var socket = io.connect('http://localhost:8092');
var $html = $('<div></div>')
socket.on('tweet', function (data) {
    var images = '';
    var text = "";
    var index = 0;
    var tweetText = data.tweet.retweeted ? data.tweet.retweeted_status.text : data.text;
    var entities = data.tweet.retweeted ? data.tweet.retweeted_status.entities : data.entities;
    var extended_entities = data.tweet.retweeted ? data.tweet.retweeted_status.extended_entities : data.tweet.extended_entities;
    //   console.log(data);
    while (index < tweetText.length) {
        entityChecker: {
            for (var entityType in entities) {
                var entitiesList = entities[entityType];
                for (var entity of entitiesList) {
                    if (entity.indices[0] === index) {
                        // move index to after the entity
                        switch (entityType) {
                            case "hashtags":
                                index = entity.indices[1];
                                text += `<a href="https://twitter.com/hashtag/${entity.text}">${entity.text}</a>`;
                                break entityChecker;
                            case "urls":
                                index = entity.indices[1];
                                text += `<a href="${entity.url}">${entity.display_url}</a>`;
                                break entityChecker;
                            case "user_mentions":
                                index = entity.indices[1];
                                text += `<a href="https://twitter.com/${entity.screen_name}">@${entity.screen_name}</a>`;
                                break entityChecker;
                            case "media":
                                index = entity.indices[1];
                                for (var media of extended_entities.media) {
                                    if (media.indices[0] === entity.indices[0] && media.indices[1] === entity.indices[1]) {
                                        images += `<a href="${media.url}" target="_blank" class="tweet-image"><img class="tweet-media" src="${media.media_url}" /></a>`;
                                    }
                                }
                                break entityChecker;
                        }
                    }
                }
            }
            // if we're here, then we didn't match anything, so add the current character and move on
            text += tweetText.charAt(index);
            index += 1;
        }
    }
    var maybeRetweeter = "";
    if (data.tweet.retweeted) {
        maybeRetweeter = `<div class="retweeted">Retweeted from <a href="https://twitter.co/${data.tweet.retweeted_status.user.screen_name}">@${data.tweet.retweeted_status.user.screen_name}</a>`;
    }
    var tweeter = data.tweet.retweeted ? data.tweet.retweeted_status.user : data.tweet.user;
    var parsedText = text.replace(/\n/g, "<br />");
    $('.content').append($(`<div class="tweet">
    <div class="left-col">
    <a href="https://twitter.co/${tweeter.screen_name}"><img width="48px" height="auto" src="${tweeter.profile_image_url}" /></a>
    </div>
    <div class="right-col">
    <a class="timestamp" href="https://twitter.com/009minions/status/${data.id}">${moment(data.timestamp).format("MMM DD, hh:mm A")}</a>
    ${maybeRetweeter}
    <div class="tweet-text">${parsedText}</div>
    ${images}
    </div>
  </div>`));
});