module
.controller('userCtrl', function($scope, $resource, User, Business, Userstore, Bizstore){
	$scope.nav_activity.current_page_index = 0;

	$scope.load_activity = {loading:false, count_to_load: 2};
	$scope.edit_activity = {target_index: -1, temp_obj: {}, editing: false};
	$scope.create_activity = {temp_obj:{}, editing: false, invalid:false, msg:""};
	$scope.arr_users = [];
	$scope.arr_business = [];
	$scope.dict_business = {};

	markLoading(true);
	loadUserList();
	loadBusinessList();

	$scope.$watch('load_activity.count_to_load', function(newVal, oldVal){
		if (newVal == 0){
			markLoading(false);
		}
	}, true);

	$scope.onRemove = function(index){
		markLoading(true);
		User.delete({user_id: $scope.arr_users[index].id}, function(result){
			Userstore.removeUser(index);
			markLoading(false);
		});
	}
	$scope.onStartEdit = function(index){
		$scope.edit_activity.temp_obj = Object.create($scope.arr_users[index]);
		if ($scope.edit_activity.temp_obj.is_enabled == true)
			$scope.edit_activity.temp_obj.is_enabled = "true";
		else
			$scope.edit_activity.temp_obj.is_enabled = "false";

		$scope.edit_activity.target_index = index;
		$scope.edit_activity.editing = true;
	}
	$scope.onFinishEdit = function(save){
		if (save){
			console.log("Do something");
			var user_endpoint = new User();
			user_endpoint.id = $scope.edit_activity.temp_obj.id;
			user_endpoint.bussiness_code = $scope.edit_activity.temp_obj.bussiness_code;
			user_endpoint.is_enabled = ($scope.edit_activity.temp_obj.is_enabled == "true")?true:false;

			markLoading(true);
			user_endpoint.$update({}, function(result_obj){
				$scope.edit_activity.editing = false;
				$scope.arr_users[$scope.edit_activity.target_index].bussiness_code = $scope.edit_activity.temp_obj.bussiness_code;
				$scope.arr_users[$scope.edit_activity.target_index].is_enabled = ($scope.edit_activity.temp_obj.is_enabled == "true")?true:false;
				markLoading(false);
				$scope.edit_activity.editing = false;	
			});
		}else{
			$scope.edit_activity.editing = false;
		}
	}
	$scope.onCreateStart = function(){
		$scope.create_activity.temp_obj = {};
		$scope.create_activity.temp_obj.is_enabled = 'true';
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

			if ($scope.create_activity.temp_obj.password != $scope.create_activity.temp_obj.confirm_password){
				$scope.create_activity.invalid = true;
				$scope.create_activity.msg = "Please confirm password again.";
				return;	
			}

			var post_params = {};

			post_params.username = $scope.create_activity.temp_obj.username;
			post_params.email = $scope.create_activity.temp_obj.email;
			post_params.password = $scope.create_activity.temp_obj.password;
			post_params.bussiness_code = $scope.create_activity.temp_obj.bussiness_code;
			post_params.is_enabled = ($scope.create_activity.temp_obj.is_enabled == "true")?true:false;
			post_params.role = "owner";

			markLoading(true);
			User.save(post_params, function(success_obj){
				post_params.id = success_obj.id;
				Userstore.pushUser(Object.create(post_params));
				$scope.create_activity.editing = false;
				markLoading(false);
			}, function(fail_obj){
				markLoading(false);
				$scope.create_activity.invalid = true;
				$scope.create_activity.msg = "Error connecting DB. Please try again.";
			});
		}
	}

	function loadUserList(){
		if (Userstore.synched){
			$scope.arr_users = Userstore.getUser();
			$scope.load_activity.count_to_load --;
		}else{
			
			User.get({}, function(result_obj){
				var arr_users = result_obj.users;
				for (var i in arr_users){
					Userstore.pushUser(arr_users[i]);
				}
				$scope.arr_users = Userstore.getUser();
				$scope.load_activity.count_to_load --;
			});
		}
	}
	function loadBusinessList(){
		if (Bizstore.synched){
			$scope.arr_business = Bizstore.getBusiness();
			$scope.dict_business = Bizstore.getBusinessDict();
			$scope.load_activity.count_to_load --;
		}else{
			Business.get({}, function(result_obj){
				var arr_biz = result_obj.businesses;
				for (var i in arr_biz){
					Bizstore.pushBusiness(arr_biz[i]);
				}
				$scope.arr_business = Bizstore.getBusiness();
				$scope.dict_business = Bizstore.getBusinessDict();
				$scope.load_activity.count_to_load --;

				console.log($scope.arr_business);
			});
		}
	}

	function markLoading(is_loading){
		$scope.load_activity.loading = is_loading;
	}
});