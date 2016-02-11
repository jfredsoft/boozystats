module
.service('Session', ['$http', '$cookies', '$window', function($http, $cookies, $window){
	this.setInitialInfo = function(info_obj){
		$cookies.putObject('bz_session', info_obj);
		$http.defaults.headers.common['x-access-token'] = info_obj.token;
	};
	this.setHTTPToken = function(){
		var obj_cookie = $cookies.getObject('bz_session');
		$http.defaults.headers.common['x-access-token'] = obj_cookie.token;
	};
	this.getUserObj = function(){
		var obj_cookie = $cookies.getObject('bz_session');
		return obj_cookie.user;
	};
	this.getCookie = function(){
		return $cookies.getObject('bz_session');
	}
	this.checkToken = function(role){
		var obj_cookie = $cookies.getObject('bz_session');
		if (obj_cookie == null || obj_cookie == undefined)
			this.logOut();
		else if (obj_cookie.user.role != role)
			this.logOut();
	};
	this.logOut = function(){
		$cookies.remove('bz_session');
		$http.defaults.headers.common['x-access-token'] = "";
		$window.location.href = "index.html";
	}
}]);