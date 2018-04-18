/**
 * New node file
 */
var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");

var StudentSQL = {
		
		queryStudentList : 'select * from student ',
		getStudentRows : 'select count(*) as counts from student',
		
		
};

module.exports = {
		queryStudentList : function(req, res) {
			
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
									
									connection.query(StudentSQL.getStudentRows,function(err, result) {
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
									connection.query(StudentSQL.queryStudentList+limitSql,function(err, result) {
										if (typeof result === 'undefined') {
											res.json({
												code : '1',
												msg : '操作失败'
											});
										} else {
											var studentInfo = result;
											callback(err,studentInfo,total,page);
											
										}
									});
								},
								function(studentInfo,total,page,callback) {
									console.log(studentInfo)
									connection.commit(function(err) {
										callback(err);
									});
									 res.json({
											list: studentInfo,
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