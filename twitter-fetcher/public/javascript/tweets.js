var socket = io.connect('http://localhost:3001');
socket.on('tweet', function (data) {
  console.log(data);
});