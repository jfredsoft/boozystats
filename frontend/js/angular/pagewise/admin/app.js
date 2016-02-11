module = angular.module('angAdmin', ['ngRoute', 'ngResource', 'ngCookies', 'ngMessages']);

module.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'templates/admin/users.html',
		controller: 'userCtrl'
	})
	.when('/area', {
		templateUrl: 'templates/admin/areas.html',
		controller: 'areaCtrl'
	})
	.when('/business', {
		templateUrl: 'templates/admin/business.html',
		controller: 'businessCtrl'
	})
	.when('/settings', {
		templateUrl: 'templates/admin/settings.html'
	});
});