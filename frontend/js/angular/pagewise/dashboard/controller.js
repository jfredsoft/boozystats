module
.controller('dashboardCtrl', function($scope, $http, $resource, Session, Pages, Commonstore, BusinessOverall){
	Session.checkToken('owner');
	Session.setHTTPToken();

	$scope.nav_activity = {current_page_index:0, arr_pages:Pages.arr_pages};
	$scope.globals = {
		overall: {
			counts: Commonstore.count,
			synched: Commonstore.synched
		},
		user_info: Session.getUserObj(),
		business_obj: null
	};

	loadInitialStats($scope.globals.user_info.bussiness_code);

	$scope.onPageChange = function(index){
		$scope.nav_activity.current_page_index = index;
	}
	$scope.menuFilter = function (item){
		return item.main;
	}
	$scope.onLogout = function(){
		Session.logOut();
	}

	function loadInitialStats(biz_code){
		if (!$scope.globals.overall.synched)
		{
			BusinessOverall.get({biz_code: biz_code}, function(result){
				Commonstore.synched = $scope.globals.overall.synched = true;
				Commonstore.updateClickCount(result.clicks);
				Commonstore.updateViewCount(result.views);
			});
		}
	}
});