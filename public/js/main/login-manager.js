
var LoginManager = new (function() {
	var self = this;
	self.user = null;
	
	self.setSocket = function(sock) {
		self.socket = sock;
        $('#login-form').live("submit",function() {
            var $form = $(this);
			if (! $form.find('input[name="account"]').val() || 
				! $form.find('input[name="password"]').val())
			{
				$('<div />').text('アカウント、またはパスワードが入力されていません。').appendTo('.form-error-login');
				return false;
			}	
			
            var datas = {
                "account" : $form.find('input[name="account"]').val(),
                "password" : $form.find('input[name="password"]').val()
            };
            $.cookie("login-account-val" , datas.account, {"expire" : 365});
            $('.form-error').html('');
			
			$("#login-form .form-submit").hide();
			$("#login-form .form-loading").show();
			
            self.socket.emit('login' , datas );
            return false;
        });
		//=== login ===========
		//=== show errors 
        self.socket.on('login error' , function(errmsg){
            $('<div />').text(errmsg).appendTo('.form-error-login');

			$("#login-form .form-submit").show();
			$("#login-form .form-loading").hide();

        } );
		//=== login ok
        self.socket.on('login ok' , function(user) {
			$("#login-form .form-submit").show();
			$("#login-form .form-loading").hide();
            
			self.setUser(user);
            PageManager.showMypage();
        });
		//=== session =====================
		//=== login session error
        self.socket.on('login session error' , function(errmsg) {
            PageManager.showLogin();
        });
		//=== login session ok
        self.socket.on('login session ok' ,function(user) {
            self.setUser(user);
            PageManager.showMypage();
        }); 
		//=== logout ======================
        $("#logout").live("click",function() {
            if (self.isLogin()) {
                if (! confirm ('ログアウトしてよろしいでしょうか？'))
                    return false;
                self.socket.emit('logout' , LoginManager.getUser().account);
            }
            return false;
        });
        self.socket.on('logout ok' , function (){
              self.logout();
              PageManager.showLogin();
        });
        self.socket.on('logout error' , function(errmsg) {
            alert('logout error:' + errmsg);
        });

	};
	self.setUser = function(user) {
		self.user = user;
		self.cookie.set(self.user.account);
	};
	self.getUser = function() {
		return self.user;
	};
	self.isLogin = function() {
		return self.user !== null;
	};
	self.logout = function() {
		self.user = null;
		self.cookie.set("");
	};
	self.cookie = {
		"set" : function(v){ $.cookie('login',v, {expire:365}); } , 
		"get" : function() { return $.cookie('login'); } 
	};
	return self;	
});

