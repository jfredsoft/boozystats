var actionModel = require('../model/action');

module.exports.addAction = function(params, callback){
	actionModel.addAction(params, callback);
};
module.exports.getActionByBiz = function(biz_code, callback){
	actionModel.getAction({business_code:biz_code}, callback);
};
module.exports.getActionByPeriod = function(biz_code, start_unix, end_unix, callback){
	actionModel.getActionsByPeriod({biz_code: biz_code, start: start_unix, end: end_unix}, callback);
};
module.exports.getOverallByBiz = function(code, callback){
	actionModel.getOverall(code, callback);
}