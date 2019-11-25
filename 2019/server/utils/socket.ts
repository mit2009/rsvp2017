let io, socketmap;

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    socketmap = {};
    io.on("connection", (socket) => {
      console.log(`${socket.id} connected`);

      socket.on("init", (username) => {
        socketmap[username] = socket;
      });

      socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
      });
    });
  },

  addUser: (user, socket) => (socketmap[user] = socket),
  getUser: (user) => socketmap[user],
  deleteUser: (user) => delete socketmap[user],
  getIo: () => io,
};
