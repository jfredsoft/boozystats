module = angular.module('angRegister', ['ngRoute', 'ngResource', 'ngCookies', 'ngMessages']);

module.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'templates/sign/register.html',
		controller: 'registerCtrl'
	})
	.when('/success/:email', {
		templateUrl: 'templates/sign/success.html',
		controller: 'successCtrl'
	});
});