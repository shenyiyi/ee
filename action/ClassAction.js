/**
 * New node file
 */
var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");

var ClassSQL = {
		
		queryClassList : 'select * from class ',
		getClassRows : 'select count(*) as counts from class',
		
		
};

module.exports = {
		queryClassList : function(req, res) {
			
			pool.getConnection(function(err, connection) {
						if (err) {
							res.json({
								ret_code : '500',
								ret_msg : '服务器错误'
							});
						}
					
						// 异步任务链式数组定义
						var tasks = [
								function(callback) {
									connection.beginTransaction(function(err) {
										callback(err);
									});
								},
								function(callback) {
									// 向表中查询用户数据
									
									connection.query(ClassSQL.getClassRows,function(err, result) {
										console.log(result)
														if (typeof result === 'undefined') {
															res.json({
																code : '1',
																msg : '操作失败'
															});
														} else {
															total = result[0].counts;
															console.log("Total:" + total);
															callback(err,total);
														}
													});
								},
								function(total,callback){
									rows = req.body.rows * 1;
									page = req.body.page * 1;
									startCount = (page-1) * rows;
									
									var limitSql = " limit "+startCount+" , "+rows;
									connection.query(ClassSQL.queryClassList+limitSql,function(err, result) {
										if (typeof result === 'undefined') {
											res.json({
												code : '1',
												msg : '操作失败'
											});
										} else {
											var classInfo = result;
											callback(err,classInfo,total,page);
											
										}
									});
								},
								function(classInfo,total,page,callback) {
									console.log(classInfo)
									connection.commit(function(err) {
										callback(err);
									});
									 res.json({
											list: classInfo,
											total : total,
											currentPage : page,
											
										});
									
								} ];

						async.waterfall(tasks, function(err, results) {
							if (err) {
								console.log(err);
								connection.rollback(); // 发生错误事务回滚
							}
						});
						// 释放连接
						connection.release();

					});
		},
		
		}