
var util = require('./util');
var Sequelize = require('sequelize');
var Seq = require('./config').getDbInstance();


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
  "last_logout_dt" : Sequelize.DATE  
},options);
exports.User.sync({"force":true}).success(function() {
  Seq.query("UPDATE users SET status = 0 WHERE 1;");
});

exports.User.login = function(account,password,callback,callback_err) {
	var errors = [];
	if (! account || !password) {
		callback_err('Account or Password is empty.');
		return ;
	}
	exports.User.find({"where":{"account" : account}}).success(function(user) {
		if (user && user.password === util.md5(password)) {
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
			callback_err('A matched user does not exist.');
		}
	}).error(function(errmsg) {
		callback_err('An error occured while query to MySQL : ' + errmsg);
	});
};
exports.User.login_sess = function(account,callback,callback_err) {
    var errors = [];
    if (! account) {
        callback_err('Account or Password is empty.');
        return ;
    }
    exports.User.find({"where":{"account" : account}}).success(function(user) {
		if (user) {
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
			callback_err('A matched user does not exist.');
    }).error(function(errmsg) {
        callback_err('An error occured while query to MySQL : ' + errmsg);
    });
};

exports.User.logout = function(account,callback,callback_err) {
	if (! account) {
        callback_err('Account is empty.');
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
            callback_err('A matched user does not exist.');
    }).error(function(errmsg) {
        callback_err('An error occured while query to MySQL : ' + errmsg);
    });
};


