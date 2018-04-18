
var index = require("./route/index");
var user = require("./route/user");
var area = require("./route/area");
var student = require("./route/student");
var teacher = require("./route/teacher");
var classs = require("./route/class");
var competence = require("./route/competence");
var role = require("./route/role");
/**
 * 404找不到页面
 */
exports.handleNotFound = function(req, res) {
	res.status(404);
	res.render('404.html');
};

exports.handleError = function(err, req, res, next) {
	res.status(500);
	res.render('500.html');
};

var exceptionHandler = function() {
	return {
		handleNotFound : exports.handleNotFound,
		handleError : exports.handleError
	};
}

exports.handle = function(app) {
	//登陆
	app.get('/', user.login, exceptionHandler);
	
/////////////////////index.js/////////////////////////
	//首页
	app.all('/index',index.index,exceptionHandler);
	//学生信息页面
	app.all('/studentInfo',index.studentInfo,exceptionHandler);
	//教师信息页面
	app.all('/teacherInfo',index.teacherInfo,exceptionHandler);
	//学生添加页面
	app.all('/studentAddLayer',index.studentAddLayer,exceptionHandler);
	//教师添加页面
	app.all('/teacherAddLayer',index.teacherAddLayer,exceptionHandler);
	//班级信息页面
	app.all('/classInfo',index.classInfo,exceptionHandler);
	//区域管理
	app.all('/areaInfo',index.areaInfo,exceptionHandler);
	//权限管理
	app.all('/competenceInfo',index.competenceInfo,exceptionHandler);
	//用户管理
	app.all('/userInfo',index.userInfo,exceptionHandler);
	//角色管理
	app.all('/roleInfo',index.roleInfo,exceptionHandler);
	//添加角色
	app.all('/addRole',index.addRole,exceptionHandler);
	//编辑角色
	app.all('/editRole',index.editRole,exceptionHandler);
/////////////////////user.js/////////////////////////
	//登陆
	app.all('/login', user.login, exceptionHandler);
	//查询用户权限
	app.all('/menu',user.menu,exceptionHandler);
/////////////////////area.js/////////////////////////	
	//区域查询
	app.all('/queryArea',area.queryArea,exceptionHandler);
	//区域分页查询
	app.all('/queryAreaList',area.queryAreaList,exceptionHandler);
	//删除区域节点
	app.all('/areaDelete',area.areaDelete,exceptionHandler);
	//添加区域节点
	app.all('/areaAdd',area.areaAdd,exceptionHandler);
	//编辑区域节点
	app.all('/areaEdit',area.areaEdit,exceptionHandler);
/////////////////////student.js/////////////////////////
	//查询学生
	app.all('/queryStudentList',student.queryStudentList,exceptionHandler);
	
/////////////////////teacher.js/////////////////////////	
	
	//查询教师
	app.all('/queryTeacherList',teacher.queryTeacherList,exceptionHandler);
	//添加教师
	app.all('/TeacherAdd',teacher.TeacherAdd,exceptionHandler);

/////////////////////class.js/////////////////////////	
	//查询班级
	app.all('/queryClassList',classs.queryClassList,exceptionHandler);
/////////////////////competence.js//////////////////////
	//权限查询
	app.all('/queryCompetence',competence.queryCompetence,exceptionHandler);
	
////////////////////role.js///////////////////////////////////
	//查询角色
	app.all('/queryRoleList',role.queryRoleList,exceptionHandler);
	//添加角色
	app.all('/RoleAdd',role.RoleAdd,exceptionHandler);
	//查询角色信息
	app.all('/findRoleById',role.findRoleById,exceptionHandler);
	//编辑角色
	app.all('/RoleEdit',role.RoleEdit,exceptionHandler);
	
}
