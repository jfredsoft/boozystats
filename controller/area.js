var areaModel = require('../model/area');

module.exports.addArea = function(params, callback){
	areaModel.addArea(params, callback);
}
module.exports.getAllAreas = function(callback){
	areaModel.getArea(null, callback);
}