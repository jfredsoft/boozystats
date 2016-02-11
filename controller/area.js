var areaModel = require('../model/area');

module.exports.addArea = function(params, callback){
	areaModel.addArea(params, callback);
}
module.exports.getAllAreas = function(callback){
	areaModel.getArea(null, callback);
}
module.exports.updateArea = function(id, params, callback){
	areaModel.updateArea(id, params, callback);
}
module.exports.removeArea = function(id, callback){
	areaModel.removeArea(id, callback);
}