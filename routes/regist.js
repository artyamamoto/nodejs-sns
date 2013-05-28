
/*
 * GET home page.
 */
var util = require('../lib/util');
var mydb = require('../lib/mydb');
var async = require('async');
var RegistForm = new (function() {
	var self = this;
	self.validate = function(datas,callback,callback_err) {
		var errors = [];
		var errcnts = 0;
	
		async.series([
			// account 
			function(next) {
				if (! datas.account) 
					errors.push(['account', 'アカウントは必須です。']) && next();
				else if (! ( "" + datas.account).match(/^[a-zA-Z0-9]{3,8}$/)) 
					errors.push(['account', 'アカウントは3-8 文字の半角英数で入力してください。']) && next();
				else {
					mydb.User.find({"where":{ "account" : datas.account }}).success(function(user) {
						if (user) {
							errors.push(['account' ,'このアカウントはすでに登録されています。']);
						}
						next();
					}).error(function(errmsg) {
						errors.push(['account' ,'An error has occured while query MySQL. :' + errmsg]);
						next();
					});
				}
			} , 
			// password 
			function(next) {
				if ( !datas.password) {
					errors.push(['password' , 'パスワードは必須です。']);
				}
				next();
			} , 
			// name 
			function(next) {
                if (! datas.name)
                    errors.push(['name', 'お名前は必須です。']) && next();
                else {
                    mydb.User.find({"where":{ "name" : datas.name }}).success(function(user) {
                        if (user) {
                            errors.push(['name' ,'このお名前はすでに登録されています。']);
                        }
                        next();
                    }).error(function(errmsg) {
                        errors.push(['name' ,'An error has occured while query MySQL. :' + errmsg]);
                        next();
                    });
                }
			} , 
			// email 
			function(next) {
                if (! datas.email)
                    errors.push(['email', 'メールアドレスは必須です。']) && next();
                else { 
                    mydb.User.find({"where":{ "email" : datas.email }}).success(function(user) {
                        if (user) {
                            errors.push(['email' ,'このメールアドレスはすでに登録されています。']);
                        }
                        next();
                    }).error(function(errmsg) {
                        errors.push(['email' ,'An error has occured while query MySQL. :' + errmsg]);
                        next();
                    });
                }
			}
		], function() {
			if (errors.length <= 0)
				callback();
			else 
				callback_err(errors);
		});
				
	}
	self.save = function(datas,callback,callback_err) {
		self.validate(datas, function() {
			mydb.User.build({
				"account" : datas.account , 
				"name" : datas.name , 
				"email" : datas.email ,
				"password" : util.md5(datas.password),
				"status" : 0 ,
				"ins_dt" : new Date() 
			}).save()
			.success(function() {
				mydb.User.find({"where":{"account":datas.account}}).success(function(user) {
					callback(user);
				}).error(function(errmsg) {
					callback_err([['general', 'An error has occured while insert into MySQL table. :' + errmsg]]);
				});
			}).error(function(errmsg) {
				callback_err([['general', 'An error has occured while insert into MySQL table. :' + errmsg]]);
			});
		}, function(errors) {
			// socket.emit('regist validate error', errors );
			callback_err(errors);
		});
	};
	return self;
});

exports.RegistForm = RegistForm;
exports.form = function(req, res){
  res.render('regist', { title: 'Registration' });
};
exports.complete = function(req, res) {
  res.render('regist-complete', { title : "Registration"});
}; 
