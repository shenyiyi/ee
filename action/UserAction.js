/**
 * UserAction
 */

var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");

var userSQL = {

		queryByLogin : 'select * from users where LoginName=? ',
		querycompetence : 'select * from competence where ID in(select CompetenceId from role_competence where roleId=?)',
		updateLoginTime : 'update users set UpdateDate=?,LastLoginDate=? where id=?',
		
};

module.exports = {
		login : function(req, res) {
			pool.getConnection(function(err, connection) {
						if (err) {
							res.json({
								ret_code : '500',
								ret_msg : '服务器错误'
							});
						}
						// 获取前台（js）页面传过来的参数
						var param = JSON.stringify(req.query).length > 2 ? req.query
								: JSON.stringify(req.params).length > 2 ? req.params
										: JSON.stringify(req.body).length > 2 ? req.body
												: req.body;
						// console.log(param);
						// 异步任务链式数组定义
						var tasks = [
								function(callback) {
									connection.beginTransaction(function(err) {
										callback(err);
									});
								},
								function(callback) {
									// 向表中查询用户数据
									connection.query(userSQL.queryByLogin,[ param.LoginName, ],function(err, result) {
										
														// 以json形式，把操作结果返回给前台页面
														if (typeof result === 'undefined') {
															res.json({
																ret_code : 2,
																ret_msg : '登录失败'
															});

														} else {
															if (result.length > 0) {
																var user = result[0];
																if (user.Password == param.Password) {
																	// req.session.userId
																	// = uzser.ID;
																	req.session.user = user;
																	req.session.save(function(err) {
																				if (err) {
																					res.json({
																								ret_code : 2,
																								ret_msg : '登录失败'
																							});
																				}
																			});
																	callback(err,user);

																} else {
																	res.json({
																				ret_code : 1,
																				ret_msg : '用户密码错误！'
																			});
																}
															} else {
																res.json({
																			ret_code : 400,
																			ret_msg : '找不到该用户！'
																		});
															}
														}
													});
									// console.log('code :'+ code+'msg :'+ msg);
								},
								//读取权限存储session
								function(user, callback) {
									// 向表中查询用户数据
									connection.query(userSQL.querycompetence,[ user.roleId, ],
													function(err, result) {
														console.log(result);
														req.session.competence = result;
														req.session.save(function(err) {
															if (err) {
																res.json({
																			ret_code : 3,
																			ret_msg : '读取权限失败'
																		});
															}
														});
													});
									callback(err,user);
								}, 
								function(user, callback) {
									var sd = require('silly-datetime');
									var time = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
									// 接收到上一条任务生成的ID
									connection.query(userSQL.updateLoginTime, [time, time, user.ID ], 
											function(err,result) {
										callback(err);
									});
									res.json({
										ret_code : 0,
										ret_msg : '登录成功 ！',
										//ret_userID :user.ID
										
									});
								}, 
								function(callback) {
									connection.commit(function(err) {
										callback(err);
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
		//读取权限
		menu : function(req, res){
			
			res.json({
				competence : JSON.stringify(req.session.competence),
				userName : req.session.user.UserName
			});
		},
		}
