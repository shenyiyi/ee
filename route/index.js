
/*
 * GET home page.
 */

exports.index = function(req, res, exceptionHandler){
	
	return res.render('index');
};
exports.teacherInfo = function(req, res, exceptionHandler){
	
	return res.render('teacherInfo');
};
exports.studentInfo = function(req, res, exceptionHandler){
	
	return res.render('index');
};
exports.studentScore = function(req, res, exceptionHandler){
	
	return res.render('studentScore');
};
exports.studentAddLayer = function(req, res, exceptionHandler){
	
	return res.render('studentAddLayer');
};
exports.teacherAddLayer = function(req, res, exceptionHandler){
	
	return res.render('teacherAddLayer');
};
exports.classInfo = function(req, res, exceptionHandler){
	
	return res.render('classInfo');
};
exports.areaInfo = function(req, res, exceptionHandler){
	
	return res.render('areaInfo');
};
exports.competenceInfo = function(req, res, exceptionHandler){
	
	return res.render('competenceInfo');
};
exports.userInfo = function(req, res, exceptionHandler){
	
	return res.render('userInfo');
};
exports.roleInfo = function(req, res, exceptionHandler){
	
	return res.render('roleInfo');
};
exports.addRole = function(req, res, exceptionHandler){
	
	return res.render('addRole');
};
exports.editRole = function(req, res, exceptionHandler){
	var roleId = String(req.query.roleId);
	return res.render('editRole',{"roleId":roleId});
};