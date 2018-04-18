/**
 * teacher
 */
var classAction = require('../action/ClassAction');

exports.queryClassList = function(req, res, exceptionHandler){
	
	return classAction.queryClassList(req, res);
};
