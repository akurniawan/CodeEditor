var Chat = (function() {
	function Chat() {
		this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		this.action();

		this.countChat=0;
		this.tempLoad=0;
	};

	Chat.prototype.init = function(userid, username, fileid) {
		var self = this;
		CE.http({
			method : "GET",
			url : CE.serviceUri + "loadChatMessages/" + fileid,
		}).success(function(data) {
			$(".templatechat").remove();
			self.user = username;
      self.userid = userid;
			self.fileid = fileid;
			self.tempLoad = 0;
			CE.socket.emit("init_chat", { room : fileid });
			for (var i = 0; i < data.length; ++i)
				self.addNewChatMessages(data[i]);
		});
	};

	Chat.prototype.action = function() {
		var self = this;
		CE.socket.on("chat_on_client", function(msg) {
			self.tempLoad++;
			self.addNewChatMessages(msg);
		}).on("delete_chat_c", function(msg) {
      $("#chat-" + msg.chatid).remove();
    });
		$('.burger').click(function(){
			self.countChat = 0;
			$('.notification').text(self.countChat);
			$(".notification").hide();
		});
		$("#chats").keypress(function(e) {
			var _this = this;
			if (e.which == 13) {
				e.preventDefault();
				var date = new Date();
				var msg = {
					fileid : self.fileid,
					message : $(this).val(),
					date : date.getDate().toString() + " " + self.month[date.getMonth()].toString() + " " + date.getFullYear().toString() + ", " + date.getHours().toString() + ":" + date.getMinutes().toString(),
					sender : self.user,
				}

				CE.http({
					method : "POST",
					url : CE.serviceUri + "insertChatMessages",
					data : JSON.stringify(msg)
				}).success(function(data) {
          msg.chatid = data.res.chatid;
          msg.senderid = data.res.senderid;
					CE.socket.emit("chat_on_server", msg);
					$(_this).val('');
				});
			}
		});
	};

	Chat.prototype.addNewChatMessages = function(data) {
    var self = this;
		var tmp = $("#chattemplate").clone().css("display", "").removeAttr("id").addClass("templatechat").attr("id", "chat-" + data.chatid);
		$(".sender", tmp).text(data.sender);
		$(".date", tmp).text(data.date);
		$(".contentChat", tmp).text(data.message);
    if (data.senderid == self.userid)
      $(".close", tmp).click(function() {
        var id = $(this).closest("div").attr("id").split("-")[1];
        var cf = confirm("Are you sure to delete this message?");
        if (cf) {
          CE.http({
            method: "POST",
            url: CE.serviceUri + "deleteChatMessages",
            data: JSON.stringify({
              fileid: self.fileid,
              chatid: id
            })
          }).success(function(data) {
            CE.socket.emit("delete_chat_s", {chatid: id});
          })
        }
      });
    else $(".close", tmp).remove();
		$("#listChat").append(tmp);
		$("#listChat").animate({ scrollTop: $('#listChat')[0].scrollHeight}, 0);

		if($('.sb-right').hasClass('sb-active'))
			this.countChat = 0;
		else if(self.tempLoad != 0) {
			$(".notification").show();
			this.countChat++;
		}
		$('.notification').text(this.countChat);
	};

	return Chat;
})();
