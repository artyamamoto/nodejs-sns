


jQuery(function() {
	var inputs = {};

	$('#regist-form input[name]').each(function() {
		var $input = $(this);
		var name = $input.attr('name');
		$input.before('<div class="form-error form-error-' + name + '"></div>');
		
		inputs[name] = $input;
	});

	var socket = io.connect('http://' + location.host );
	socket.on('connect' , function() {
		console.log('connected.');
	});
	$("#regist-form").submit(function() {
		var $form = $(this);
		var data = {};
		for (var name in inputs)
			data[name] = inputs[name].val();

		$('.form-error').html('');
		$('.form-submit').hide();
		$('.form-loading').show();
		
		socket.emit('regist validate' , data);
		return false;
	});
	socket.on('regist validate error' , function(errors) {
		for (var i in errors) {
			var k = errors[i][0];
			var errmsg = errors[i][1];
			$('<div />').text(errmsg).appendTo('.form-error-' + k);
		}
		$('.form-submit').show();
		$('.form-loading').hide();
	});
	socket.on('regist validate ok' , function(datas) {
		if (! confirm('入力された内容で登録してよろしいでしょうか？'))
			return;
		socket.emit('regist save' , datas);
	});
	socket.on('regist save ok' , function(user) {
        $('.form-submit').show();
        $('.form-loading').hide();
		location.href = '/regist/complete';
	});
	socket.on('regist save error' , function(errors) {
        for (var i in errors) {
            var k = errors[i][0];
            var errmsg = errors[i][1];
            $('<div />').text(errmsg).appendTo('.form-error-' + k);
        }
        $('.form-submit').show();
        $('.form-loading').hide();
	});
});
