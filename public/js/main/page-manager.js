var PageManager = new (function() {
	var self = this;
	var $ = $ || jQuery;
	
    self.setSocket = function(sock) {
        self.socket = sock;
		self.socket.on('friends sync' , function(friends) {
			self.syncFriendList(friends);
		});
    };	
	self.showLogin = function(type) {
		$('#page-login').show();
        $('#page-mypage').hide();
		$('#friend-list').hide();
		$('#mypage-menu').hide();
				
		$("#page-login input[name=\"account\"]").val($.cookie("login-account-val"));
		$("#page-login input[name=\"password\"]").val("");
		
		self.hideTweets();
		self.hideFriendList();
	};
	self.showMypage = function() {
		$('#page-login').hide();
        $('#page-mypage').show();
		$('#mypage-menu').show();
		
		var user = LoginManager.getUser();
		$("#page-mypage .user-name").text(user.name);
		$("#page-mypage .user-login").text(dateformat(user.last_login_dt));
		$("#page-mypage .user-logout").text(dateformat(user.last_logout_dt));

		self.showTweets();
		
		// self.showFriendList();
	};
	self.showTweets = function() {
		$("#page-tweets").show();
		if (! $("#page-tweets").data("init")) {
			TweetsManager.init();
			$("#page-tweets").data("init", 1);
		}
	};
	self.hideTweets = function() {
		$("#page-tweets").hide();
		$("#page-tweets").data("init",0);
	};	
	/* self.showFriendList = function() {
		if ($("#friend-list .loading").is(":visible")) {
			$("#friend-list ul" ).html("");
			$("#friend-list .loading").show();
			$("#friend-list").show();
		}
		self.socket.emit('friends fetch');
	}; */
	self.hideFriendList = function() {
		$("#friend-list ul" ).html("");
        $("#friend-list .loading").show();
        $("#friend-list").hide();
	}
	self.syncFriendList = function(friends) {		
		if (! LoginManager.isLogin()) 
			return ;
		
	//	if (! self.isFriendUpdated(friends)) 
	//		return;
		
		$("#friend-list .loading").hide();
		$("#friend-list ul").html("");
		$("#friend-list").show();

		self.users = {};
		
		for (var i in friends) {
			var friend = friends[i];
			// console.log($.dump(friend));
			if (friend.status) 
				friend.status_img = '<img src="/images/status_green.gif" />';
			else 
				friend.status_img = '<img src="/images/status_red.gif"/>';
			
			$("#friend-list ul").append($("#tmpl-friend").tmpl(friend));
			
			self.users[friend.account] = friend;
		}
		TweetsManager.syncTweetsUsers(self.users);
	};
/*	self.isFriendUpdated = function(friends) {
		return true;
	}; */
	return self;
})();
