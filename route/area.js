/**
 * New node file
 */
var areaAction = require('../action/AreaAction');

exports.queryArea = function(req, res, exceptionHandler){
	
	return areaAction.queryArea(req, res);
};
exports.queryAreaList = function(req, res, exceptionHandler){
	
	return areaAction.queryAreaList(req, res);
};
exports.areaDelete = function(req, res, exceptionHandler){
	
	return areaAction.areaDelete(req, res);
}
exports.areaAdd = function(req, res, exceptionHandler){
	
	return areaAction.areaAdd(req, res);
}
exports.areaEdit = function(req, res, exceptionHandler){
	
	return areaAction.areaEdit(req, res);
}