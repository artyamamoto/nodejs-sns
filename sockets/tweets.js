

var mydb = require('../lib/mydb');
var limit = 15;

exports.fetchBefore = function(socket,tweet_id) {
	mydb.Tweet.count().success(function(c) {
	    mydb.Tweet.fetchBefore(tweet_id ,limit, function(tweets) {
            socket.emit('tweet fetch before ok' , tweets, c);
        }, function(errmsg) {
            socket.emit('tweet fetch before error', errmsg);
        });
	}).error(function(errmsg) {
		socket.emit('tweet fetch before error', errmsg);
	});
};
exports.fetch = function(socket) {
	mydb.Tweet.count().success(function(c) {
		mydb.Tweet.fetch(0,limit, function(tweets) {
			socket.emit('tweet fetch ok' , tweets, c);
		}, function(errmsg) {
			socket.emit('tweet fetch error', errmsg);
		});
	}).error(function(errmsg) {
		socket.emit('tweet fetch error', errmsg);
	});
};


exports.save = function(socket,data) {
	//=== validate 
	if (! socket._user) {
		socket.emit('tweet post error' , 'ログインしていません。');
		return false;
	}
	if (!data.message) {
		socket.emit('tweet post error' , 'つぶやきが入力されていません。');
		return false;
	} else if (("" + data.message).length > 200) {
		socket.emit('tweet post error' , 'つぶやきは200文字以内で入力してください。');
		return false;
	}
	//=== select 
	var account = socket._user;
    mydb.User.find({"where":{"account" : account}}).success(function(user) {
        if (user) {
			/**** 
            user.status = 1;
            user.last_login_dt = new Date();
            user.save().success( function() {
                callback(user);
            }).error(function(errmsg) {
                callback_err('An error occured while query to MySQL : ' + errmsg);
            }); ***/
			var tweetdata = {
				"user_account" : user.account , 
				"message" : data.message , 
				"color": data.color , 
				"ins_dt" : new Date() 
			};
			var tweet = mydb.Tweet.build(tweetdata)
			tweet.save()
			.success(function() {
				socket.emit('tweet post ok' , tweet);
				socket.broadcast.emit('tweet post prepend' , tweet);
			}).error(function(errmsg) {
				socket.emit('tweet post error','An error occured while query to MySQL : ' + errmsg);
			});
        } else {
			socket.emit('tweet post error','該当のユーザーデータが見つかりません。');
		}
    }).error(function(errmsg) {
        socket.emit('tweet post error','An error occured while query to MySQL : ' + errmsg);
    });
};
exports.sync = function(socket,is_broadcast){
	if (! socket._user)
		return;
	mydb.User.findAll().success(function(friends) {
		socket.emit('friends sync',friends);
		if (is_broadcast)
			socket.broadcast.emit('friends sync' , friends);
	}).error(function(errmsg) {
		socket.emit('friends sync error' , errmsg);
	});
};


