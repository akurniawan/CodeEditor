var Editor = (function() {
	function Editor(socket, http) {
		this.currentUser = "";
		this.FB = window.fbAsyncInit;
		CE.socket = socket;
		CE.http = http;
		$('body').addClass('loading');
		// starting editor
		this.init();
		this.initializeSocket();
	};

	Editor.prototype.initializeSocket = function() {
		var self = this;
		CE.socket.on("isLogin_c", function(data) {
      $(".status", $(".friendList-" + data.userId)).removeClass("offline").removeClass("online").addClass("online");
      $(".status > span", $(".friendList-" + data.userId)).removeClass("iconOffline").removeClass("iconOnline").addClass("iconOnline");
		}).on("isLogout_c", function(data) {
      $(".status", $(".friendList-" + data.userid)).removeClass("offline").removeClass("online").addClass("offline");
      $(".status > span", $(".friendList-" + data.userid)).removeClass("iconOffline").removeClass("iconOnline").addClass("iconOffline");
		}).on("disconnected_from_socket_c", function(data) {
      CE.http({
        method: "GET",
        url: CE.serviceUri + "disconnected/" + data.userid
      }).success(function() {
        $(".status", $(".friendList-" + data.userid)).removeClass("offline").removeClass("online").addClass("offline");
        $(".status > span", $(".friendList-" + data.userid)).removeClass("iconOffline").removeClass("iconOnline").addClass("iconOffline");
      });
		}).on("add_collaborators_c", function(data) {
			$("#projectTree").jstree(true).refresh();
			if (data.currentFile == self.tab.currentFileID)
				self.tab.collaborators.loadCollaborators(self.tab.collaborators.owner, self.tab.currentFileID);
		}).on("delete_collaborators_c", function(data) {
      if (data.userId == self.currentUser) {
        alert("You have been removed from " + data.filename);
        $("#projectTree").jstree(true).refresh();
        if (data.fileid == self.tab.currentFileID) {
          $("[aria-controls='tabs-" + data.fileid + "'] span.ui-icon-close").click();
          self.tab.collaborators.loadCollaborators(self.tab.collaborators.owner, self.tab.currentFileID);
        }
      }
		}).on("rename_node_c", function(data) {
			$("#projectTree").jstree(true).refresh();
			$('.ui-state-default').each(function(index){
				if($('a',this).attr('href').split('-')[1] === data.fileId){
					$('a',this).text(data.fileName);
				}
			});
		}).on("delete_node_c", function(data) {
     $("[aria-controls='tabs-" + data.fileId + "'] span.ui-icon-close").click();
			$("#projectTree").jstree(true).refresh();
    });
	};

	Editor.prototype.activateAllResponse = function() {
		this.action();
		this.loadMyProfile();
	};

	Editor.prototype.action = function() {
		$("li").click(function(e) {
			e.preventDefault();
			$("li").removeClass("selected");
			$(this).addClass("selected");
		});
		$.slidebars();
		$("#sb-site").on("swiperight", function() {
			$(".sb-left").addClass('sb-active');
		});
	}

	Editor.prototype.init = function() {
		var self = this;

		if (window.sessionStorage.temp != "Anonymous")
			self.initFB();
		else
			self.activateAllResponse();
	};

	Editor.prototype.initFB = function() {
		var self = this;

		window.fbAsyncInit = function() {
			FB.init({
				appId: CE.appID,
				xfbml: true,
				version: 'v2.0'
			});
			FB.getLoginStatus(function(response) {
				if(response.status !== 'connected')
					window.location.href = CE.baseUri;
				else
					window.sessionStorage.fbtoken = response.authResponse.accessToken;
			});
			FB.Event.subscribe('auth.authResponseChange', function(response) {
				self.activateAllResponse();
				self.logoutAuth();
				self.addCollaboratorsFB();
			})
		};
		(function(d) {
			var js, id = 'facebook-jssdk',
				ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		}(document));
	};

	Editor.prototype.logoutAuth = function() {
		var self = this;

		$('#logout').click(function() {
			if(window.location.href.indexOf('?') == -1) {
				FB.logout(function(){
					CE.http({
						method : "POST",
						url : CE.serviceUri + "logout"
					}).success(function(data) {
						window.sessionStorage.fbtoken = '';
						window.location.href = CE.baseUri;
						CE.socket.emit("isLogout_s", {userid : data.userId});
					});
				});
			} else if(window.location.href.split("?")[1].split('#') != 'mobile') {
				var FB_LOGOUT_URL = 'https://www.facebook.com/logout.php';
				var logoutRedirectURL = baseURL =
						location.protocol + '//' +
						location.hostname +
						(location.port ? ':' + location.port : '') +
						window.location.pathname.replace('workspace/','?mobile');
				FB.logout(function(){
					CE.http({
						method : "POST",
						url : CE.serviceUri + "logout"
					}).success(function(data) {
						window.sessionStorage.fbtoken = '';
						window.open(
							FB_LOGOUT_URL + '?access_token=' + 	window.sessionStorage.fbtoken + '&next=' + logoutRedirectURL,
							'_blank',
							'location=no'
						);
						CE.socket.emit("isLogout_s", {userid : data.userId});
					});
				});

			}
		});
	};

	Editor.prototype.loadMyProfile = function() {
		var self = this;
		if (window.sessionStorage.temp == "Anonymous")
			self.loadProfileAnonymous();
		else
			self.loadProfileFromFB();
	};

	Editor.prototype.loadProfileAnonymous = function() {
		var self = this;
		$("#profilePicture").attr("src", 'images/no-avatar_male.jpg');
		$('#profileName').text('Anonymous');
		this.currentUser = "Anonymous";
		$('#list-tag button').remove();
		$('#logout').attr('src','images/logout.png');
		$('#logout').click(function(){
			if (window.location.href.indexOf('?') == -1) {
				CE.http({
					method : "POST",
					url : CE.serviceUri + "logout"
				}).success(function(data) {

					window.sessionStorage.temp = '';
					window.location.href = CE.baseUri;
					CE.socket.emit("isLogout_s", {userid : data.userId});
				});
			} else if(window.location.href.split("?")[1].split('#') != 'mobile') {
				CE.http({
					method : "POST",
					url : CE.serviceUri + "logout"
				}).success(function(data) {
					window.sessionStorage.temp = '';
					window.location.href = CE.baseUri+'?mobile';
					CE.socket.emit("isLogout_s", {userid : data.userId});
				});
			}
		});
		var sendData = {
			userid : 'Anonymous',
			username : 'Anonymous',
			useremail : "",
			userimage : 'images/no-avatar_male.jpg'
		};
		CE.http({
			method : "POST",
			url : CE.serviceUri + "login",
			data : JSON.stringify(sendData)
		}).success(function(data) {
			CE.socket.emit("isLogin_s", {userId : sendData.id});
			self.currentUser = sendData.id;
			self.tab = new Tabs(sendData.username, sendData.id);
			self.tree = new Tree(self.tab);
			self.code = new Code(self.tab);

		});
	};

	Editor.prototype.loadProfileFromFB = function() {
		var self = this;

		FB.api("/me/picture", {
				"height": "80",
				"type": "normal",
				"width": "80"
		}, function(response) {
			var imageUrl = response.data.url;
			$("#profilePicture").attr("src", imageUrl);
			FB.api('/me', function(response) {
				var sendData = {
					userid : response.id,
					username : response.name,
					useremail : (response.email == undefined) ? "" : response.email,
					userimage : imageUrl
				};
				CE.http({
					method : "POST",
					url : CE.serviceUri + "login",
					data : JSON.stringify(sendData)
				}).success(function(data) {
					CE.socket.emit("isLogin_s", {userId : response.id});
					$('#profileName').text(response.name);
					self.currentUser = response.id;
					self.tab = new Tabs(response.name, response.id);
					// $('#list-tag button').remove();
					self.tree = new Tree(self.tab);
					self.code = new Code(self.tab);
				});
			});
		});
	};

	Editor.prototype.addCollaboratorsFB = function() {
		var self = this;

		$('#searchFriend').facebookAutocomplete({
			maxSuggestions: 12,
			onpick: function(friend) {
				if (friend != undefined) {
					if (self.tab.currentFileID == "" || self.tab.currentFileID == undefined) {
						alert("You have to choose file to collaborate first");
						return;
					}
					var cf = confirm("Are you sure to add your friend as collaborators?");
					if (cf) {
						CE.http({
							method : "POST",
							url : CE.serviceUri + "addCollaborators",
							data : JSON.stringify({
								userid : friend.id,
								fileid : self.tab.currentFileID
							})
						}).success(function(data) {
              if (data.status == "success") {
                var sendData = {
                  _id : friend.id,
                  userName : friend.name,
                  picture : friend.picture,
                  isLogin : data.statusOnline
                }
                self.tab.collaborators.addCollaborators(sendData);
                CE.socket.emit("add_collaborators_s", {currentFile : self.tab.currentFileID});
              }
						});
					}
				}
			}
		});
	};

	return Editor;
})();
