module
.controller('loginCtrl', function($scope, $http, $resource, $window, $location, User, Login, Session){

	var session_obj = Session.getCookie();
	if (!(session_obj == null || session_obj == undefined)){
		if (session_obj.user.role == "admin")
			$window.location.href = "admin.html";
		else
			$window.location.href = "dashboard.html";
	}

	$scope.validation_activity = {invalid:false, msg:""};
	$scope.submission_activity = {submitting: false};
	$scope.info_obj = {};

	$scope.onLogin = function(valid){
		if (!valid){
			$scope.validation_activity.invalid = true;
			$scope.validation_activity.msg = "Invalid input. Please try again.";
			return;
		}

		$scope.submission_activity.submitting = true;
		var login_params = {};

		login_params.email = $scope.info_obj.email;
		login_params.password = $scope.info_obj.password;

		Login.save(login_params, function(success_obj){
			Session.setInitialInfo(success_obj);
			if (success_obj.user.role == "owner")
				$window.location.href = "dashboard.html";
			else
				$window.location.href = "admin.html";
		}, function(fail_obj){
			$scope.submission_activity.submitting = false;
			$scope.validation_activity.invalid = true;
			$scope.validation_activity.msg = "Invalid Credentials";
		});
	}

});