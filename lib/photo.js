
var fs = require('fs');
var util = require('./util');



exports.save = function(account,data,callback,callback_err) {
	if (! data.bin || ! data.type) {
		callback_err('データが不正です。');
		return false;
	}
	var path;
	try {
		var tail = (("" + data.type).split('/'))[1].toLowerCase();
    	if (tail == "jpeg")
    	    tail = "jpg";
 		if (tail != "jpg" && tail != "gif" && tail != "png") {
			throw '拡張子が不正です。';
		}
     	path = 'public/photos/' + account + '.' + tail ;
	} catch(e) {
		if (typeof e == "string") 
			callback_err(e);
		else
			callback_err('データが不正です。');
	}
	var ws = fs.createWriteStream(path);
	ws.on('drain',function() {})
		.on('error' , function(errmsg) {
			callback_err(errmsg);
		})
		.on('close' , function() {
			callback(path);
		})
		.on('pipe' , function(src){});
	ws.write(data.bin, 'binary');
	ws.end();
};


