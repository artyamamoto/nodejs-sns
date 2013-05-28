

var mydb = require('../lib/mydb');
var util = require('../lib/util');

exports.login = function(socket,datas,callback){
	mydb.User.login(datas.account || "", datas.password || "" , function(user) {
		socket._user = datas.account;	// _user
		socket.emit('login ok' , user);
		if (callback)
			callback();
	}, function(errmsg) {
		socket._user = null;
		socket.emit('login error' , errmsg);
	});	
};
exports.login_sess = function(socket,account,callback){
    mydb.User.login_sess(account, function(user) {
		socket._user = account;			// _user

        socket.emit('login session ok' , user);
		if (callback)
			callback();
    }, function(errmsg) {
		socket._user = null;
        socket.emit('login session error' , errmsg);
    });
};
exports.logout = function(socket,account,callback){
    mydb.User.logout(account, function(user) {
		socket._user = null;
        socket.emit('logout ok');
		
		if (callback)
			callback();
    }, function(errmsg) {
		socket._user = null;
        socket.emit('logout error' , errmsg);
    });
};


