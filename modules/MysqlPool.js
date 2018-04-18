var mysql = require('mysql');
var dv_config=require('../config/db_config');
var pool = mysql.createPool(dv_config.config);

module.exports = pool;
//向前台返回JSON方法的简单封装
//var jsonWrite = function (res, ret) {
//	if(typeof ret === 'undefined') {
//		res.json({
//			code:'1',
//			msg: '操作失败'
//		});
//	} else {
//		res.json(ret);
//	}
//};

//module.exports = jsonWrite;