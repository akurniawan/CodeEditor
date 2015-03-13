#!/usr/bin/env node

var http = require('http')
  , io = require('socket.io')
  , pty = require('pty.js');

server = http.createServer();
server.listen(8080);

io = io.listen(server, {
	log : false
});

var term = [],
	s = [],
	idx = 0;

io.on('connection', function(socket) {
	socket.on("type", function(param) {
		s.push(socket);
		term.push(pty.fork('/Users/akurniawan/Sites/web/akurniawan.github.io/CodeEditor/compile/compile.sh', [param.name, param.ext, param.folderid], {
		  name: require('fs').existsSync('/usr/share/terminfo/x/xterm-256color')
			? 'xterm-256color'
			: 'xterm',
		  cols: 80,
		  rows: 24,
		  cwd: process.env.HOME
		}));
		idx = term.length - 1;
		// console.log(idx);
		term[idx].on('data', function(data) {
			socket.emit('data', {
				id : idx,
				term : data
			});
		});

		socket.on('data', function(data) {
			// console.log(data.id);
			term[data.id].write(data.term);
			idx = data.id;
		}).on('disconnect', function() {
			var i = s.indexOf(socket);
			term.splice(i, 1);
			s.splice(i, 1);
		});

		socket.emit("ready");
		socket.emit("send_id", idx);
	});
});

console.log("TERMINAL IS RUNNING!");
