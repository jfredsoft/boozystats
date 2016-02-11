var userModel = require('../model/user');
var config = require('../config');

module.exports.setupAdmin = function(callback){
	var new_params = {};
	new_params.username = 'admin';
	new_params.email = 'admin@test.com';
	new_params.password = config.adminPassword;
	new_params.business_id = 0;
	new_params.role = 'admin';

	userModel.addUser(new_params, callback);
}

module.exports.getAdmin = function(callback){
	userModel.getUserByRole('admin', callback);
}
module.exports.authenticateUser = function(email, password, callback){
	userModel.getUserByCredentials(email, password, callback);
}
module.exports.addUser = function(params, callback){
	userModel.addUser(params, callback);
}
module.exports.getAllUsers = function(callback){
	userModel.getUser(null, callback);
}
module.exports.updateUser = function(id, params, callback){
	userModel.updateUser(id, params, callback);
}
module.exports.removeUser = function(id, callback){
	userModel.removeUser(id, callback);
}