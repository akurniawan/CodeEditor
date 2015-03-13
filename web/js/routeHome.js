var mainModule = angular.module("mainModule", ["ngRoute"]);

function routeConfig($routeProvider, $controllerProvider) {
	mainModule.registerCtrl = $controllerProvider.register;
	var route = $routeProvider;
	route.when("/", {
		redirectTo: "home"
	}).when("/home", {
		templateUrl: "view/home.html"
	}).when("/features", {
		templateUrl: "view/features.html"
	}).when("/contact", {
		templateUrl: "view/contact.html"
	});
}
mainModule.config(routeConfig);
mainModule.directive("navBar", function() {
	return {
		restrict: 'E',
		templateUrl: "view/template/headerHome.html"
	}
});
