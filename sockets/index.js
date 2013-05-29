

var web_io = require('websocket.io');
var socket_io = require('socket.io');

var regist = require('./regist');
var login = require('./login');
var friends = require('./friends');
var tweets = require('./tweets');
var photo = require('./photo');

var timer_id = -1;
var socket_num = 0;

exports.init = function(server,app) {
    var io = socket_io.listen(server);
    io.sockets.on('connection' , function(socket) {
		socket_num++;
        socket.on('disconnect' , function() {
			if (socket._user) {
				login.logout(socket, socket._user);
			}
			socket_num--;
			
			if (socket_num <= 0 && timer_id >= 0) {
				try { clearInterval(timer_id); } catch(e) {}
			}
        });
		//=== regist
		socket.on('regist validate' , function(datas) {
			regist.validate(socket, datas);
		});
        socket.on('regist save' , function(datas) {
            regist.save(socket, datas);
        });
		//=== login / logout
		socket.on('login' , function(datas) {
			login.login(socket, datas, function() {
                friends.sync(socket,true);
            });
		});
		socket.on('login session' , function(account) {
			login.login_sess(socket, account, function() {
                friends.sync(socket,true);
            });
		});
        socket.on('logout' , function(account) {
            login.logout(socket, account, function() {
				friends.sync(socket,true);
			});
        });
 		
		//=== sync friends 
		socket.on('friends fetch' , function() {
			friends.sync(socket);
		});

		//=== tweets 
		socket.on('tweet post', function(data) {
			tweets.save(socket, data);
		});
        socket.on('tweet fetch', function() {
            tweets.fetch(socket);
        });
        socket.on('tweet fetch before', function(tweet_id) {
            tweets.fetchBefore(socket, tweet_id);
        });
		//=== photo 
		socket.on('photo upload' , function(data) {
			photo.save(socket, data, function(path) {
				socket.emit('photo upload ok' , path);
				friends.sync(socket);
			}, function(errmsg) {
				socket.emit('photo upload error',errmsg);
			});
		});
		//=== timer for sync friends 
		//=== is it neseccery ?
//		if (socket_num == 1) {
//			timer_id = setInterval(function() {
//				friends.sync(socket, true);
///			}, 1000);
//		}
    });
	web_io.listen(app);
}

