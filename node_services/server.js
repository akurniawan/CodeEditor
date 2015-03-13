var Server = (function() {
  var _this;
  function Server(io, socket) {
    _this = this;
    _this.userLists = {};
    _this.io = io;
    _this.socket = socket;
  };

  Server.prototype.isLogin_s = function(data) {
    _this.userLists[_this.socket.id] = data.userId;
		_this.io.emit("isLogin_c", data);
  };

  Server.prototype.isLogout_s = function(data) {
		_this.io.emit("isLogout_c", data);
  };

  Server.prototype.init_chat = function(data) {
		if (_this.socket.room == data.room) return;
		_this.socket.leave(_this.socket.room);
		_this.socket.join(data.room);
		_this.socket.room = data.room;
  };

  Server.prototype.delete_chat_s = function(data) {
    _this.io.emit("delete_chat_c", data);
  };

  Server.prototype.chat_on_server = function(data) {
		_this.io.to(socket.room).emit("chat_on_client", data);
  };

  Server.prototype.add_collaborators_s = function(data) {
		_this.io.emit("add_collaborators_c", data);
  };

  Server.prototype.delete_collaborators_s = function(data) {
		_this.io.emit("delete_collaborators_c", data);
  };

  Server.prototype.rename_node_s = function(data) {
		_this.io.emit("rename_node_c", data);
  };

  Server.prototype.delete_node_s = function(data) {
    _this.io.emit("delete_node_c", data);
  };

  Server.prototype.disconnect = function(data) {
    var self = _this;
		_this.io.emit("disconnected_from_socket_c", {userid : self.userLists[self.socket.id]});
  };

  return Server;
})();

exports.Server = Server;
