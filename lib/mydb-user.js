
var util = require('./util');
var Sequelize = require('sequelize');
var Seq = require('./config').getDbInstance();

var is_force = true;

var options = {
  "timestamps" : false ,
  "underscored" : true ,
  "feeezeTableName" : true
};
//=== User
exports.User = Seq.define('user' , {
  "account" : {
	"type"		: Sequelize.STRING,
	"allowNull" : false ,
	"unique" 	: true 
  } , 
  "password" : { 
	"type" : Sequelize.STRING, 
	"allowNull" : false 
  } , 
  "name" : {	
	"type" : Sequelize.STRING ,
	"allowNull" : false , 
	"unique" : true 
  }, 
  "email" : {
    "type" : Sequelize.STRING ,
    "allowNull" : false ,
    "unique" : true
  },
  "status" : { 
	"type" : Sequelize.INTEGER ,
	"allowNull" : false 
  }, 
  "ins_dt" : Sequelize.DATE , 
  "last_login_dt" : Sequelize.DATE , 
  "last_logout_dt" : Sequelize.DATE ,  
  "photo_path" : Sequelize.STRING 
//  "photo_bin" : Sequelize.TEXT ,  //BLOB がない
//  "photo_type" : Sequelize.STRING  
},options);
exports.User.sync({"force" : is_force}).success(function() {
  Seq.query("UPDATE users SET status = 0 WHERE 1;");
});

exports.User.login = function(account,password,callback,callback_err) {
	var errors = [];
	if (! account || !password) {
		callback_err('アカウント、またはパスワードが入力されていませn。');
		return ;
	}
	exports.User.find({"where":{"account" : account}}).success(function(user) {
		if (user && user.password === util.md5(password)) {
			if (user.status == 1) {
				callback_err('このユーザーは別の端末からログイン済みです。');
				return;
			}
			user.status = 1;
			user.last_login_dt = new Date();
			user.save().success( function() {
				user.last_login_dt = util.dateformat(user.last_login_dt);
				user.last_logout_dt = util.dateformat(user.last_logout_dt);
				callback(user);
			}).error(function(errmsg) {
				callback_err('An error occured while query to MySQL : ' + errmsg);
			});
		} else {
			callback_err('アカウント、またはパスワードが異なります。');
		}
	}).error(function(errmsg) {
		callback_err('An error occured while query to MySQL : ' + errmsg);
	});
};
exports.User.login_sess = function(account,callback,callback_err) {
    var errors = [];
    if (! account) {
        callback_err('アカウントが空です。');
        return ;
    }
    exports.User.find({"where":{"account" : account}}).success(function(user) {
		if (user) {
            if (user.status == 1) {
                callback_err('このユーザーは別の端末からログイン済みです。');
                return;
            }
            user.status = 1;
			user.last_login_dt = new Date();
            user.save().success( function() {
                user.last_login_dt = util.dateformat(user.last_login_dt);
                user.last_logout_dt = util.dateformat(user.last_logout_dt);

                callback(user);
            }).error(function(errmsg) {
                callback_err('An error occured while query to MySQL : ' + errmsg);
            });
		} else 
			callback_err('ログインに失敗しました。');
    }).error(function(errmsg) {
        callback_err('An error occured while query to MySQL : ' + errmsg);
    });
};

exports.User.logout = function(account,callback,callback_err) {
	if (! account) {
        callback_err('ログアウトするアカウントが空です。');
        return ;
    }
    exports.User.find({"where":{"account" : account}}).success(function(user) {
        if (user) {
            user.status = 0;
            user.last_logout_dt = new Date();
            user.save().success( function() {
                user.last_login_dt = util.dateformat(user.last_login_dt);
                user.last_logout_dt = util.dateformat(user.last_logout_dt);
                callback(user);
            }).error(function(errmsg) {
                callback_err('An error occured while query to MySQL : ' + errmsg);
            });
        } else
            callback_err('該当のユーザーはいませんでした。');
    }).error(function(errmsg) {
        callback_err('An error occured while query to MySQL : ' + errmsg);
    });
};
exports.User.updatePhoto = function(account, path, callback,callback_err) {
    exports.User.find({"where":{"account" : account}}).success(function(user) {
        if (user) {
            user.photo_path = path;
            user.save().success( function() {
                callback();
            }).error(function(errmsg) {
                callback_err('An error occured while query to MySQL : ' + errmsg);
            });
        } else
            callback_err('該当のユーザーはいませんでした。');
    }).error(function(errmsg) {
        callback_err('An error occured while query to MySQL : ' + errmsg);
    });
};

