var Collaborators = (function() {
  function Collaborators() {};

  Collaborators.prototype.loadCollaborators = function(owner, fileid) {
    var self = this;
    this.owner = owner;
    this.currentFileID = fileid;
    this.allColor = [];
    CE.http({
      method : "GET",
      url : CE.serviceUri + "getCollaboratorsList/" + fileid
    }).success(function(data) {
      $(".newcollaborators").remove();
      for (var i = 0; i < data.length; ++i)
        self.addCollaborators(data[i]);
    });
  };

  Collaborators.prototype.addCollaborators = function(d) {
    var self = this;
    var t = $("#iTemplateCollaboratorsList").clone().css("display", "").removeAttr("id").removeClass("looptemplate").addClass("newcollaborators");

    $(".friendList", t).addClass("friendList-" + d._id);
    $(".friend", t).attr({
      nama : d.userName,
      src : d.picture
    });
    $(".nameFriend", t).text(d.userName);
    if (d.isLogin == 1) {
      $(".status", t).addClass("online");
      $(".status > span", t).addClass("iconOnline");
    } else {
      $(".status", t).addClass("offline");
      $(".status > span", t).addClass("iconOffline");
    }
    var tempName = d.userName.replace(" ","_");
    $('.colorCollaborators',t).addClass(tempName);
    if (self.owner == 1) {
      $('.close', t).attr("f-id", d._id).click(function() {
        var c = confirm("Are you sure to remove him/her as collaborators?");
        var ce = this;
        var friendId = $(this).attr("f-id");
        if (c) {
          CE.http({
            method : "POST",
            url : CE.serviceUri + "removeCollaborators",
            data : JSON.stringify({
              userid : friendId,
              fileid : self.currentFileID
            })
          }).success(function(data) {
            $(ce).closest('div').remove();
					  CE.socket.emit("delete_collaborators_s", {
              userId : friendId,
              fileid : self.currentFileID,
              filename : $("[href=#tabs-" + self.currentFileID + "]").text()
            });
          });
        }
      });
    } else $(".close", t).remove();

    $("#list-tag").append(t);
	
	var color=self.getRandomColor();
	
	$('head style').append('.' + tempName + '::before{background-color:' + color + '}');

  $('head style').append('.' + tempName + '{background-color:' + color + '}');
  };
  Collaborators.prototype.getRandomColor = function(){
      var self = this;
      var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
      if($.inArray(randomColor,self.allColor) != -1)
        self.getRandomColor();
      else
        self.allColor.push(randomColor);
      return randomColor;

  };
  return Collaborators;
})();
