var workspace = angular.module("workspace", ["ngRoute"]);

function routeConfig($routeProvider, $controllerProvider) {
	workspace.registerCtrl = $controllerProvider.register;
	$routeProvider.when("/", {
		redirectTo : "editor"
	}).when("/editor", {
		templateUrl : "view/workspace.html"
	});
}
workspace.config(routeConfig);