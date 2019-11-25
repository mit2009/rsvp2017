var io, socketmap;
module.exports = {
    init: function (http) {
        io = require("socket.io")(http);
        socketmap = {};
        io.on("connection", function (socket) {
            console.log(socket.id + " connected");
            socket.on("init", function (username) {
                socketmap[username] = socket;
            });
            socket.on("disconnect", function () {
                console.log(socket.id + " disconnected");
            });
        });
    },
    addUser: function (user, socket) { return (socketmap[user] = socket); },
    getUser: function (user) { return socketmap[user]; },
    deleteUser: function (user) { return delete socketmap[user]; },
    getIo: function () { return io; },
};
//# sourceMappingURL=socket.js.map