

var mydb = require('../lib/mydb');


exports.sync = function(socket,is_broadcast){
	if (! socket._user && !is_broadcast) 
		return;	

	mydb.User.findAll().success(function(friends) {
		if (socket._user)
			socket.emit('friends sync',friends);
		if (is_broadcast)
			socket.broadcast.emit('friends sync' , friends);
	}).error(function(errmsg) {
		socket.emit('friends sync error' , errmsg);
	});
};


