module
.controller('businessCtrl', function($scope, Business, Area, Bizstore, Areastore){
	$scope.nav_activity.current_page_index = 2;

	$scope.load_activity = {loading:false, count_to_load: 2};
	$scope.edit_activity = {target_index: -1, temp_obj: {}, editing: false};
	$scope.create_activity = {temp_obj:{}, editing: false, invalid:false, msg:""};
	$scope.arr_biz = [];
	$scope.arr_area = [];
	$scope.dict_area = {};

	markLoading(true);	
	loadBusinessList();
	loadAreaList();

	$scope.$watch('load_activity.count_to_load', function(newVal, oldVal){
		if (newVal == 0){
			markLoading(false);
		}
	}, true);

	$scope.onRemove = function(index){
		markLoading(true);
		Business.delete({biz_id: $scope.arr_biz[index].id}, function(result){
			Bizstore.removeBusiness(index);
			markLoading(false);
		});
	}
	$scope.onStartEdit = function(index){
		$scope.edit_activity.temp_obj = Object.create($scope.arr_biz[index]);
		if ($scope.edit_activity.temp_obj.area_id == '' || $scope.edit_activity.temp_obj.area_id == null)
			$scope.edit_activity.temp_obj.area_id = '';
		else
			$scope.edit_activity.temp_obj.area_id = $scope.edit_activity.temp_obj.area_id + "";
		$scope.edit_activity.target_index = index;
		$scope.edit_activity.editing = true;
	}
	$scope.onFinishEdit = function(save){
		if (save){
			var biz_endpoint = new Business();
			biz_endpoint.id = $scope.edit_activity.temp_obj.id;
			biz_endpoint.name = $scope.edit_activity.temp_obj.name;
			biz_endpoint.area_id = $scope.edit_activity.temp_obj.area_id*1;

			markLoading(true);
			biz_endpoint.$update({}, function(result_obj){
				$scope.edit_activity.editing = false;
				$scope.arr_biz[$scope.edit_activity.target_index].name = $scope.edit_activity.temp_obj.name;
				$scope.arr_biz[$scope.edit_activity.target_index].area_id = $scope.edit_activity.temp_obj.area_id*1;
				markLoading(false);
				$scope.edit_activity.editing = false;	
			});
		}else{
			$scope.edit_activity.editing = false;
		}
	}
	$scope.onCreateStart = function(){
		$scope.create_activity.temp_obj = {};
		$scope.create_activity.temp_obj.area_id = '';
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
			post_params.code = $scope.create_activity.temp_obj.code;
			post_params.area_id = $scope.create_activity.temp_obj.area_id * 1;

			markLoading(true);
			Business.save(post_params, function(success_obj){
				post_params.id = success_obj.id;
				Bizstore.pushBusiness(Object.create(post_params));
				$scope.create_activity.editing = false;
				markLoading(false);
			}, function(fail_obj){
				markLoading(false);
				$scope.create_activity.invalid = true;
				$scope.create_activity.msg = "Error connecting DB. Please try again.";
			});
		}
	}

	function loadBusinessList(){
		if (Bizstore.synched){
			$scope.arr_biz = Bizstore.getBusiness();
			$scope.load_activity.count_to_load --;
		}else{
			Business.get({}, function(result_obj){
				var arr_biz = result_obj.businesses;
				for (var i in arr_biz){
					Bizstore.pushBusiness(arr_biz[i]);
				}
				$scope.arr_biz = Bizstore.getBusiness();
				$scope.load_activity.count_to_load --;
			});
		}
	}
	function loadAreaList(){
		if (Areastore.synched){
			$scope.arr_area = Areastore.getArea();
			$scope.dict_area = Areastore.getAreaDict();
			$scope.load_activity.count_to_load --;
		}else{
			Area.get({}, function(result_obj){
				var arr_areas = result_obj.areas;
				for (var i in arr_areas){
					Areastore.pushArea(arr_areas[i]);
				}
				$scope.arr_area = Areastore.getArea();
				$scope.dict_area = Areastore.getAreaDict();
				$scope.load_activity.count_to_load --;
			});
		}
	}

	function markLoading(is_loading){
		$scope.load_activity.loading = is_loading;
	}
});