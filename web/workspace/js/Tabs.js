var Tabs = (function() {
	function Tabs(user, userid) {
		var self = this;
		this.tabs = $("#tabs").tabs({
			activate : function(e, ui) {
        self.currentFileID = ui.newPanel.selector.split("-")[1];
				self.loadData(self.currentFileID);
			}
		});
		this.tabTitle = $('#tab_title');
		this.tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
		this.totalTabs = 0;
		this.user = user;
    this.userid = userid;
    this.doc = "";
		this.chat = new Chat();
    this.collaborators = new Collaborators();
		this.tab_nav();
	};

	Tabs.prototype.loadData = function(nodeId) {
		var self = this;
		CE.http({
			method : "GET",
			url : CE.serviceUri + "getFileContent/" + nodeId,
		}).success(function(data) {
      if (self.doc != "" && self.doc != undefined && self.doc != null)
        self.doc.close();
      $("title").text(data[0].filename);
      $("[href=#tabs-" + self.currentFileID + "]").text(data[0].filename);
			self.fileName = data[0].filename;
			self.ext = data[0].fileext;
      self.owner = data[0].owner;
      self.loadEditor();
			self.chat.init(self.userid, self.user, self.currentFileID);
      self.collaborators.loadCollaborators(data[0].isOwner, data[0].fileid);
		});

		this.action();
	};

	Tabs.prototype.addTab = function(currentFileID) {
		var tabTitle = this.tabTitle,
			tabTemplate = this.tabTemplate,
      self = this;

    this.currentFileID = currentFileID;
		var label = this.fileName,
			id = "tabs-" + this.currentFileID,
			li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label)),
			websiteframe = '<div id="editor-'+this.currentFileID+'" class="editorStyle"></div>';

		this.tabs.find(".ui-tabs-nav").append(li);
		this.tabs.append("<div id='" + id + "' class='tabs'>" + websiteframe + "</div>");

		this.tab_nav();
		this.tabs.tabs("refresh");
		$('[href=#'+id+']').click();

		this.totalTabs++;
	};

  Tabs.prototype.loadEditor = function() {
    var self = this;
    var option = {
      origin : CE.originShareJS
    };
    $("#editor-" + this.currentFileID).remove();
    $("#tabs-" + this.currentFileID).append('<div id="editor-'+this.currentFileID+'" class="editorStyle"></div>');
		var editor = ace.edit("editor-" + this.currentFileID);
		editor.setTheme("ace/theme/monokai");
    sharejs.open(this.currentFileID, 'text', option, function(error, doc) {
      self.doc = doc;
			doc.attach_ace(self.user, editor);
		});
		var mode = "";
		if (this.ext == "cpp") mode = "ace/mode/c_cpp";
		else if (this.ext == "java") mode = "ace/mode/java";
		editor.getSession().setMode(mode);
  };

	Tabs.prototype.tab_nav = function() {
		var tab_nav_width = 100;
		var tab_nav_inside = $('.ins').outerWidth();
		$('.ins ul li').each(function(){
			var tab_nav_li_width = $(this).outerWidth();
			tab_nav_width = tab_nav_width + tab_nav_li_width;
		});
		$('.ins ul').width( tab_nav_width );

		if( tab_nav_inside > tab_nav_width ){
			$('#tabs .button-mover').hide();
		} else {
			$('#tabs .button-mover').show();
			// Rearrange the order based on .active -> .active always at the leftest
			$('.ins ul li.active').nextAll('li').prependTo('.ins ul');
			$('.ins ul li.active').prependTo('.ins ul');
		}
	};

	Tabs.prototype.action = function() {
		var self = this;
		// delete tabs
		$( "span.ui-icon-close").click(function() {
			var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
			$( "#" + panelId ).remove();
			self.tabs.tabs( "refresh" );
			self.totalTabs--;
			if (self.totalTabs == 0) {
				$("title").text("Code Editor");
				self.currentFileID = "";
			}
		});

		this.tabs.bind( "keyup", function( event ) {
			if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
				var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
				$( "#" + panelId ).remove();
				self.tabs.tabs( "refresh" );
			}
		});

		$('#tabs .prev').on( 'click', function(e){
			e.preventDefault();
			var distance = 0 - $('#tabs ul li:last').outerWidth();
			$('#tabs ul li:last').prependTo('#tabs ul').css('margin-left', distance).animate({ 'margin-left' : 0 }, 200, function(){
				$('#tabs ul li:first').css('margin-left', '');
			});
		});
		$('#tabs .next').on( 'click', function(e){
			e.preventDefault();
			var distance = 0 - $('#tabs ul li:first').outerWidth();
			$('#tabs ul li:first').animate({ 'margin-left' : distance }, 200, function(){
				$(this).appendTo('#tabs ul').css('margin-left', '' );
			});
		});
	};

	return Tabs;
})();
