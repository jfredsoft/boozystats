module
.controller('registerCtrl', function($scope, $http, $resource, $window, $location, User){
	$scope.info_obj = {};
	$scope.submission_activity = {submitting: false};
	$scope.validation_activity = {invalid: false, msg: ""};
	$scope.onSubmit = function(valid){
		if (!valid){
			$scope.validation_activity.invalid = true;
			$scope.validation_activity.msg = "Invalid input. Please try again.";
			return;
		}
		if ($scope.info_obj.password != $scope.info_obj.password_confirm){
			$scope.validation_activity.invalid = true;
			$scope.validation_activity.msg = "Please confirm password again.";
			return;	
		}
		var post_params = {};

		post_params.username = $scope.info_obj.username;
		post_params.email = $scope.info_obj.email;
		post_params.password = $scope.info_obj.password;
		post_params.role = "owner";

		$scope.submission_activity.submitting = true;
		User.save(post_params, function(success_obj){
			$scope.submission_activity.submitting = false;
			$window.location.href = "register.html#/success/"+post_params.email;
		}, function(fail_obj){
			$scope.submission_activity.submitting = false;
			$scope.validation_activity.invalid = true;
			$scope.validation_activity.msg = "Error connecting DB. Please try again.";
		});
	};

	//Supportive functions

})
.controller('successCtrl', function($scope, $location, $routeParams, $window){
	$scope.email = $routeParams.email;
	$scope.onLogin = function(){
		$window.location.href = "index.html";
	}
});