var serviceModel = require('../model/service');

module.exports.addServiceToBusiness = function(biz_code, type, callback){
	serviceModel.addService({business_code: biz_code, type: type}, callback);
};