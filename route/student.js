/**
 * student
 */
var studentAction = require('../action/StudentAction');

exports.queryStudentList = function(req, res, exceptionHandler){
	
	return studentAction.queryStudentList(req, res);
};