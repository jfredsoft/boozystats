module
.controller('areaCtrl', function($scope, $resource, Areastore, Area){
	$scope.nav_activity.current_page_index = 1;

	$scope.load_activity = {loading:false, count_to_load: 1};
	$scope.edit_activity = {target_index: -1, temp_obj: {}, editing: false};
	$scope.create_activity = {temp_obj:{}, editing: false, invalid:false, msg:""};
	$scope.arr_areas = [];

	markLoading(true);
	loadAreaList();

	$scope.$watch('load_activity.count_to_load', function(newVal, oldVal){
		if (newVal == 0){
			markLoading(false);
		}
	}, true);

	$scope.onRemove = function(index){
		markLoading(true);
		Area.delete({area_id: $scope.arr_areas[index].id}, function(result){
			Areastore.removeArea(index);
			markLoading(false);
		});
	}

	$scope.onStartEdit = function(index){
		$scope.edit_activity.temp_obj = Object.create($scope.arr_areas[index]);
		$scope.edit_activity.target_index = index;
		$scope.edit_activity.editing = true;
	}
	$scope.onFinishEdit = function(save){
		if (save){
			var area_endpoint = new Area();
			area_endpoint.id = $scope.edit_activity.temp_obj.id;
			area_endpoint.name = $scope.edit_activity.temp_obj.name;

			markLoading(true);
			area_endpoint.$update({}, function(result_obj){
				$scope.edit_activity.editing = false;
				$scope.arr_areas[$scope.edit_activity.target_index].name = $scope.edit_activity.temp_obj.name;
				markLoading(false);
				$scope.edit_activity.editing = false;	
			});
		}else{
			$scope.edit_activity.editing = false;
		}
	}
	$scope.onCreateStart = function(){
		$scope.create_activity.temp_obj = {};
		$scope.create_activity.invalid = false;
		$scope.create_activity.editing = true;
	}
	$scope.onCreate = function(submit, valid){
		if (!submit){
			$scope.create_activity.editing = false;
		}else{
			$scope.create_activity.invalid = false;
			if (!valid){
				$scope.create_activity.invalid = true;
				$scope.create_activity.msg = "Invalid input. Please try again.";
				return;
			}

			var post_params = {};

			post_params.name = $scope.create_activity.temp_obj.name;

			markLoading(true);
			Area.save(post_params, function(success_obj){
				post_params.id = success_obj.id;
				Areastore.pushArea(Object.create(post_params));
				$scope.create_activity.editing = false;
				markLoading(false);
			}, function(fail_obj){
				markLoading(false);
				$scope.create_activity.invalid = true;
				$scope.create_activity.msg = "Error connecting DB. Please try again.";
			});
		}
	}

	function loadAreaList(){
		if (Areastore.synched){
			$scope.arr_areas = Areastore.getArea();
			$scope.load_activity.count_to_load --;
		}else{
			Area.get({}, function(result_obj){
				var arr_areas = result_obj.areas;
				for (var i in arr_areas){
					Areastore.pushArea(arr_areas[i]);
				}
				$scope.arr_areas = Areastore.getArea();
				$scope.load_activity.count_to_load --;
			});
		}
	}
	function markLoading(is_loading){
		$scope.load_activity.loading = is_loading;
	}
});