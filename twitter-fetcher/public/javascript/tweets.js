var socket = io.connect('http://localhost:3001');
var $html = $('<div></div>')
socket.on('tweet', function (data) {
  var image = '';
  if (data.media) {
    image = `<img src="${data.media}">`
  }
  var text = "";
  var index = 0;
  while (index < data.text.length) {
    entityChecker: {
        for (var entityType in data.entities) {
            var entities = data.entities[entityType];
            for (var entity of entities) {
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
                    }
                }
            }
        }
        // if we're here, then we didn't match anything, so add the current character and move on
        text += data.text.charAt(index);
        index += 1;
    }
  }
  $('.content').append($(`<div class="tweet">
    ${text}
    ${image}
  </div>`));
});