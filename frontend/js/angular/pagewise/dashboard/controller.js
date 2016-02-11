module
.controller('dashboardCtrl', function($scope, $http, $resource, Session){
	Session.checkToken('owner');
	$scope.onLogout = function(){
		Session.logOut();
	}
});