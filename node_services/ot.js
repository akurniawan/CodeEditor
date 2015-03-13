var connect = require('connect'),
    sharejs = require('share').server;

var server = connect(),
	options = {
		db: { type: 'mongo' },
		browserChannel: { cors: "*" }
	};

sharejs.attach(server, options);

server.listen(6556, function(){
    console.log('Ot server has running');
});
