var bizModel = require('../model/business');

module.exports.addBiz = function(params, callback){
	bizModel.addBusiness(params, callback);
}
module.exports.updateBiz = function(id, params, callback){
	bizModel.updateBusiness(id, params, callback);
}
module.exports.getBiz = function(params, callback){
	bizModel.getBusiness(params, callback);
}
module.exports.removeBiz = function(id, callback){
	bizModel.removeBusiness(id, callback);
}