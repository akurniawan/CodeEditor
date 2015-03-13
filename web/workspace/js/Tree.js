var Tree = (function() {
		function Tree(tabs) {
			this.tree = "";
			this.tabs = tabs;
			this.createTree();
    };

		Tree.prototype.createTree = function() {
			var self = this;

			$("#projectTree").jstree({
				"core" : {
					data : {
						"url" : CE.serviceUri + "getFolderUser",
						"dataType" : "json"
					},
					"check_callback" : function(op, node, parent_node, pos, more) {
						if (op == "move_node") {
              if (more.dnd == undefined) {
                var type = node.icon.split("-")[1];
                var node = node.data;
                var access = node.access;
                var owner = node.owner;
                var pnode = parent_node.data;
                var paccess = pnode.access;

                if (access == "root" || access == "restricted" || access == "restricted-public" || owner == 0) {
                  var alert_message = "You can't move this " + type;
                  alert(alert_message);
                  return false;
                } else if (paccess == "root" || paccess == "restricted" || paccess == "restricted-public") {
                  if (paccess == "restricted-public")
                    if (access != "root" && access != "restricted" && access != "restricted-public") return true;
                  alert("You can't move into this folder");
                  return false;
                }
              }
						}
					},
				},
				'types' : {
					'default' : { 'icon' : 'jstree-folder' },
					'file' : { 'valid_children' : [], 'icon' : 'jstree-file' }
				},
				"contextmenu": {
					"items": function($node) {
						self.tree = $("#projectTree").jstree(true);
						var type = $node.type;

						return (type == "default" || type == "folder") ? self.folderAction($node) : self.fileAction($node);
					}
				},
				"plugins" : ["contextmenu", "dnd", "types"]
			}).on("rename_node.jstree", function(e, data) {
				var node = data.node;
				var type = node.icon.split("-")[1];
				var ext = (node.text.split(".").length > 1) ? node.text.split(".")[1] : "#";
				var name = (node.text.split(".").length > 1) ? node.text.split(".")[0] : node.text;

				if (type == "file")
					if (ext != "cpp" && ext != "java") {
						alert("File extension should be .cpp or .java");
						self.tree.edit(node);
						return;
					}

				var data = {
					previd : node.original.id,
					fileid : node.id,
					name : name,
					fileType : node.icon.split("-")[1],
					parents : node.parents,
					ext : ext
				}
				CE.http({
					method : "POST",
					url : CE.serviceUri + "findFileName",
					data : JSON.stringify(data)
				}).success(function(res) {
					if (res == 1) {
						alert("File name exist");
						self.tree.edit(node);
					} else
						CE.http({
							method : "POST",
							url : CE.serviceUri + "newNode",
							data : JSON.stringify(data)
						}).success(function(data) {
							CE.socket.emit("rename_node_s", {
								fileName : name + "." + ext,
								fileId:node.id
							});
						});
				});
			}).on("delete_node.jstree", function(e, data) {
				var node = data.node;
				var cf = confirm("Are you sure to delete this item?");
				if (cf) {
					CE.http({
						method : "GET",
						url : CE.serviceUri + "deleteNode/" + node.id
					}).success(function(data) {
            $("[aria-controls='tabs-" + node.id + "'] span.ui-icon-close").click();
            CE.socket.emit("delete_node_s", {
              fileId: node.id
            });
					});
				}
			}).on("move_node.jstree", function(e, data) {
				var node = data.node;
				var data = {
					fileid : node.id,
					parents : node.parents,
				}

				CE.http({
					method : "POST",
					url :CE.serviceUri + "moveNode",
					data : JSON.stringify(data)
				}).success(function(data) {
				})
			}).on("click.jstree", function (e, data) {
				var node = $(e.target).closest("li");
				var id = node[0].id;
				if(!$(node).children('a').children('i').hasClass('jstree-folder'))
          if ($("#tabs-" + id).length <= 0)
            self.tabs.addTab(id);
					// self.tabs.loadData(id);
			});
			$('body').removeClass('loading');
		};

		Tree.prototype.folderAction = function($node) {
			var self = this;
			return {
				"New": {
					"separator_before": false,
					"separator_after": false,
					"label": "New",
					"submenu" : {
						"create_folder" : {
							"separator_after" : true,
							"label" : "Folder",
							"action" : function(data) {
								var access = $node.data.access;
								if (access == "root" || access == "restricted") {
									alert("You can't create folder in this folder!");
									return;
								}
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.create_node(obj, {
									type : "default",
									data : {
										access : "public",
										owner : 1
									}
								}, "last", function (new_node) {
									setTimeout(function () {
										inst.edit(new_node);
									},0);
								});
							},
						},
						"create_file" : {
							"label" : "File",
							"action" : function(data) {
								var access = $node.data.access;
								if (access == "root" || access == "restricted") {
									alert("You can't create file in this folder!");
									return;
								}
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.create_node(obj, {
									type : "file",
									data : {
										access : "public",
										owner : 1
									}
								}, "last", function (new_node) {
									setTimeout(function () {
										inst.edit(new_node);
									},0);
								});
							}
						}
					}
				},
				"Edit" : {
					"separator_before": false,
					"separator_after": false,
					"label": "Edit",
					"submenu" : {
						"Rename": {
							"separator_before": false,
							"separator_after": false,
							"label": "Rename",
							"action": function (obj) {
								var access = $node.data.access;
								var owner = $node.data.owner;

								if (access == "root" || access == "restricted" || access == "restricted-public" || owner == 0) {
									alert("You can't rename this folder!");
									return;
								}
								self.tree.edit($node);
							}
						},
						"Remove": {
							"separator_before": false,
							"separator_after": false,
							"label": "Remove",
							"action": function (obj) {
								var access = $node.data.access;
								var owner = $node.data.owner;
								if (access == "root" || access == "restricted" || access == "restricted-public" || owner == 0) {
									alert("You can't remove this folder!");
									return;
								}
								self.tree.delete_node($node);
							}
						}
					}
				},
				"Upload" : {
					"separator_before" : false,
					"separator_after" : false,
					"label" : "Upload",
					"action" : function(data) {
						var access = $node.data.access;
						if (access == "root" || access == "restricted") {
							alert("You can't upload file in this folder!");
							return;
						}
						var id = $node.id;
						$('body').append('<form enctype="multipart/form-data" action="" method="post" id="formUpload"><input type="file" class="file"/></form>');
						$('input[type=file]').click();
						$('input[type=file]').on('change',function(event){
							var files = event.target.files;
							var data = new FormData();
							var temp = {};
							$.each(files, function(key,value){
								data.append(key,value);
							});
							var ext = files[0].name.split(".")[1];
							if(ext != undefined)
							{
								if (ext != "cpp" && ext != "java") {
									alert("File extension should be .cpp or .java");
									$("#formUpload").remove();
									return;
								}
							}else{
								alert("File extension should be .cpp or .java");
								$("#formUpload").remove();
								return;
							}

							$.ajax({
								method : "POST",
								url : CE.serviceUri + "uploadNode",
								data:data,
								cache :false,
								dataType :'json',
								secureUri : false,
								processData : false,
								contentType :false,
								success : function(data) {
									$node.parents.splice(0,0,$node.id);
									var tempData = {
										name : data.filename.split('.')[0],
										fileType : 'file',
										parents : $node.parents,
										ext : ext,
										content : data.content,
										date :new Date().getTime()
									}
									CE.http({
										method : "POST",
										url : CE.serviceUri + "findFileName",
										data : JSON.stringify(tempData)
									}).success(function(res) {
										if (res == 1) {
											alert("File name exist");
											$("#formUpload").remove();
											return;
										} else
											CE.http({
												method : "POST",
												url : CE.serviceUri + "newNode",
												data : JSON.stringify(tempData)
											}).success(function(data) {
												CE.http({
													method : "POST",
													url : CE.serviceUri + "insertFileContent/"+ data.$id,
													data : JSON.stringify(tempData)
												}).success(function(data) {
													self.tree.refresh();
												});
											});
									});
								}
							});

							$("#formUpload").remove();
						});
					}
				},
				"Download" : {
					"separator_before" : false,
					"separator_after" : false,
					"label" : "Download",
					"action" : function(data) {
						var id = $node.id;
						CE.http({
							method : "GET",
							url : CE.serviceUri + "downloadNode/" + id
						}).success(function(data) {
							location.href = CE.downloadUri + data.downloadid + ".zip";
						});
					}
				}
			}
		};

		Tree.prototype.fileAction = function($node) {
			var self = this;

			return {
				"Open" : {
					"separator_before" : false,
					"separator_after" : false,
					"label" : "Open",
					"action" : function(data) {
						var id = $node.id;
						self.tabs.loadData(id);
					}
				},
				"Edit" : {
					"separator_before": false,
					"separator_after": false,
					"label": "Edit",
					"submenu" : {
						"Rename": {
							"separator_before": false,
							"separator_after": false,
							"label": "Rename",
							"action": function (obj) {
								var access = $node.data.access;
								var owner = $node.data.owner;

								if (access == "root" || access == "restricted" || access == "restricted-public" || owner == 0) {
									alert("You can't rename this folder!");
									return;
								}
								self.tree.edit($node);
							}
						},
						"Remove": {
							"separator_before": false,
							"separator_after": false,
							"label": "Remove",
							"action": function (obj) {
								var access = $node.data.access;
								var owner = $node.data.owner;

								if (access == "root" || access == "restricted" || access == "restricted-public" || owner == 0) {
									alert("You can't remove this folder!");
									return;
								}
								self.tree.delete_node($node);
							}
						}
					}
				},
				"Download" : {
					"separator_before" : false,
					"separator_after" : false,
					"label" : "Download",
					"action" : function(data) {
						var id = $node.id;
						CE.http({
							method : "GET",
							url : CE.serviceUri + "downloadNode/" + id
						}).success(function(data) {
							location.href = CE.downloadUri + data.downloadid + ".zip";
						});
					}
				}
			}
		};

		return Tree;
})();
