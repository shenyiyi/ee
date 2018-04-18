/**
 * teacher
 */
var roleAction = require('../action/RoleAction');

exports.queryRoleList = function(req, res, exceptionHandler){
	
	return roleAction.queryRoleList(req, res);
};
exports.RoleAdd = function(req, res, exceptionHandler){
	
	return roleAction.RoleAdd(req, res);
};
exports.findRoleById = function(req, res, exceptionHandler){
	
	return roleAction.findRoleById(req, res);
};
exports.RoleEdit = function(req, res, exceptionHandler){
	
	return roleAction.RoleEdit(req, res);
};
