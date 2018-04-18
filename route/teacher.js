/**
 * teacher
 */
var teacherAction = require('../action/TeacherAction');

exports.queryTeacherList = function(req, res, exceptionHandler){
	
	return teacherAction.queryTeacherList(req, res);
};
exports.TeacherAdd = function(req, res, exceptionHandler){
	
	return teacherAction.TeacherAdd(req, res);
};
