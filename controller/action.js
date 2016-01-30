var actionModel = require('../model/action');

module.exports.addAction = function(params, callback){
	actionModel.addAction(params, callback);
};
module.exports.getActionByBiz = function(biz_code, callback){
	actionModel.getAction({business_code:biz_code}, callback);
};