
var Photo = new (function () {
	var self = this;
	var $ = $ || jQuery;

	var locked = false;
		
	self.setSocket = function(sock) {
		self.socket = sock;
		
        // file upload
        $("#form-photo-btn").on("click" , function() {
			if (locked) 
				return;
            $("#form-photo").click();
        });
        $("#form-photo").on("change" , function(event) {
			locked = true;
            try {
                var file = event.target.files[0];
                var fileReader = new FileReader();
                var type = file.type;
                var data = {};
                fileReader.readAsBinaryString(file);
                fileReader.onload = function(evt) {
                    data.bin = evt.target.result;
                    data.type = type;
                    //console.log($.dump(data));
                    self.socket.emit('photo upload' , data);
					locked = false;
                };
            } catch(e) {
                alert(e);
				locked = false;
            }
        });
		self.socket.on('photo upload ok' , function(path) {
			if (path)
				$("#page-mypage .user-photo").html('<a href="/photos/' + path + '" target="_blank"><img src="/photos/' + path + '" /></a>');
			else 
				$("#page-mypage .user-photo").html('<img src="/images/no-photo.jpg" />');
				
		});
		self.socket.on('photo upload error' , function(errmsg) {
			alert('ファイルのアップロード時にエラーが発生しました。' + errmsg);
		});

	};
	
	return self;	
});

