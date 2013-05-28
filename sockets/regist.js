
var reg = require('../routes/regist');
exports.validate = function(socket,datas) {
	reg.RegistForm.validate(datas, function() {
		socket.emit('regist validate ok',datas);
	}, function(errors) {
		socket.emit('regist validate error', errors );
	});
}
exports.save = function(socket,datas) {
    reg.RegistForm.save(datas, function(user) {
        socket.emit('regist save ok', user);
    }, function(errors) {
        socket.emit('regist validate error', errors );
    });	
};

