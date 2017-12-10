var socket = io.connect('http://localhost:3001');
var $html = $('<div></div>')
socket.on('tweet', function (data) {
  var image = '';
  if (data.media) {
    image = `<img src="${data.media}">`
  }
  $('.content').append($(`<div class="tweet">
    ${data.text}
    ${image}
  </div>`));
});