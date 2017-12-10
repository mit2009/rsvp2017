var socket = io.connect('http://localhost:3001');
var $html = $('<div></div>')
socket.on('tweet', function (data) {
  var image = '';
  if (data.media) {
    image = `<img src="${data.media}">`
  }
//   var text = "";
//   var index = 0;
//   while (index < data.text.length) {
//     for (var entityType in data.entities) {
//         var entities = data.entities[entityType];
//         for (var entity of entities) {
//             if (entity.indices[0] === index) {
//                 // move index to after the entity
//                 index = entity.indices[1];
//                 switch (entityType) {
//                     case "hashtags":

//                 }
//             }
//         }
//     }
//   }
  $('.content').append($(`<div class="tweet">
    ${data.text}
    ${image}
  </div>`));
});