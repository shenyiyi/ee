
/*
 * GET users listing.
 */
var userAction = require('../action/UserAction');

exports.login = function(req, res, exceptionHandler) {
	var param = JSON.stringify(req.query).length > 2 ? req.query
			: JSON.stringify(req.params).length > 2 ? req.params
					: JSON.stringify(req.body).length > 2 ? req.body
							: req.body;
//	console.log(param);
					//console.log(test.test_encrypt());
	if (req.session.user) {
		return res.redirect("/index");
	} else 
		if ((typeof (param.LoginName) == 'undefined')) {
		return res.render('login');
	}

	userAction.login(req, res);
	
};
//读取权限
exports.menu = function(req,res,exceptionHandler){
	return userAction.menu(req, res);
};