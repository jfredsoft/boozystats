module
.controller('adminCtrl', function($scope, $http, $resource, Pages, User, Session){
	Session.checkToken('admin');
	Session.setHTTPToken();

	$scope.nav_activity = {current_page_index:0, arr_pages:Pages.arr_pages};

	$scope.onPageChange = function(index){
		$scope.nav_activity.current_page_index = index;
	}
	$scope.onLogout = function(){
		Session.logOut();
	}
});