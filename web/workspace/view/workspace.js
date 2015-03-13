workspace.registerCtrl("workspace", function($scope, $http) {
	var socket = io.connect("192.168.0.101:5665");
	var editor = new Editor(socket, $http);
});
