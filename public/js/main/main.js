
var socket = null;
jQuery(function($) {
    $('#diary-form input[name]').each(function() {
        var $input = $(this);
        var name = $input.attr('name');
        $input.before('<div class="form-error form-error-' + name + '"></div>');
    });

	var socket = io.connect('http://' + location.host );
    socket.on('connect' , function() {
        console.log('connected.');
		$('#socket-connecting').hide();
		
		LoginManager.setSocket(socket);
		PageManager.setSocket(socket);
		TweetsManager.setSocket(socket);
		
		if (LoginManager.cookie.get('login')) {
			socket.emit('login session' , LoginManager.cookie.get('login') );
		} else {
			PageManager.showLogin();
		}
	});
});
