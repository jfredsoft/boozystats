module
	.service('URL', function(){
		//this.rootURL = 'http://192.168.2.81:8080/api';
		this.rootURL = 'https://boozyanalytics.herokuapp.com/api';
		this.generateURL = function(uri){
			return this.rootURL + uri;
		}
	})
	.factory('User', function($resource, URL){
		return $resource(URL.generateURL('/user/:user_id'), {user_id: '@id'}, {
			update: {
				method: 'PUT'
			}
		});
	})
	.factory('Area', function($resource, URL){
		return $resource(URL.generateURL('/area/:area_id'), {area_id: '@id'}, {
			update: {
				method: 'PUT'
			}
		});
	})
	.factory('Business', function($resource, URL){
		return $resource(URL.generateURL('/business/:biz_id'), {biz_id: '@id'}, {
			update: {
				method: 'PUT'
			}
		});
	})
	.factory('Login', function($resource, URL){
		return $resource(URL.generateURL('/authenticate'));
	});