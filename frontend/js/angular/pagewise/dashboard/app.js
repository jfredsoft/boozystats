module = angular.module('angDashboard', ['ngRoute', 'ngResource', 'ngCookies', 'ngMessages', 'highcharts-ng', '720kb.datepicker']);

module.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'templates/dashboard/main.html',
		controller: 'mainCtrl'
	})
	.when('/growth', {
		templateUrl: 'templates/dashboard/growth.html',
		controller: 'growthCtrl'
	})
	.when('/demograph', {
		templateUrl: 'templates/dashboard/demograph.html',
		controller: 'demographCtrl'
	})
	.when('/pattern', {
		templateUrl: 'templates/dashboard/pattern.html',
		controller: 'patternCtrl'
	})
	.when('/setting', {
		templateUrl: 'templates/dashboard/setting.html',
		controller: 'settingCtrl'
	});
});