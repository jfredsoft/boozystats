module
.controller('mainCtrl', function($scope, $resource, URL){
	$scope.nav_activity.current_page_index = 0;

	$scope.load_activity = {loading: false};

	loadBusinessData($scope.globals.user_info.bussiness_code);
	function loadBusinessData(biz_code){
		if ($scope.globals.business_obj != null) return;

		$scope.load_activity.loading = true;
		$resource(URL.generateURL('/business/'+biz_code)).get({}, function(data){
			var obj_business = data.businesses[0];
			$scope.globals.business_obj = obj_business;
			$scope.load_activity.loading = false;
		});
	}
});