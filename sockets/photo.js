
var mydb = require('../lib/mydb');
var photo = require('../lib/photo');
var util = require('../lib/util');
exports.save = function(socket,data,callback,callback_err) {
	if (! socket._user) 
		return;
	photo.save(socket._user, data ,function(path) {
		console.log('photo saved ' + path);
		
		path = util.basename(path);
		console.log('basename ' + path);
		mydb.User.updatePhoto( socket._user, path , function() {
			callback(path);
		} , function() {
			callback_err(errmsg);
		});
	},function(errmsg) {
		console.log('photo save failed ' + errmsg);
		callback_err(errmsg);
	} );
};

