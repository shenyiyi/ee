/**
 * New node file
 */
var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");
var sd = require('silly-datetime');

var TeacherSQL = {
		
		queryTeacherList : 'select * from teacher ',
		getTeacherRows : 'select count(*) as counts from teacher',
		
		
};

module.exports = {
		queryTeacherList : function(req, res) {
			
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
									
									connection.query(TeacherSQL.getTeacherRows,function(err, result) {
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
									connection.query(TeacherSQL.queryTeacherList+limitSql,function(err, result) {
										if (typeof result === 'undefined') {
											res.json({
												code : '1',
												msg : '操作失败'
											});
										} else {
											var teacherInfo = result;
											callback(err,teacherInfo,total,page);
											
										}
									});
								},
								function(teacherInfo,total,page,callback) {
									console.log(teacherInfo)
									connection.commit(function(err) {
										callback(err);
									});
									 res.json({
											list: teacherInfo,
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
		TeacherAdd : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务器出错'
					});
				}
				var param = req.query.length > 0 ? req.query
						: req.params.length > 0 ? req.params
								: req.body.length > 0 ? req.body : req.body;
				var createDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');	
				var userId = req.session.user.ID;
				var tasks = [
				             function(callback){
				            	connection.beginTransaction(function(err){
				            		callback(err);
				            	}); 
				             },
				             function(callback){
				            	 var sql = "insert into teacher (Name,Age,CreateDate,CreateUserId) values(?,?,?,?)";
				            	 connection.query(sql,[param.name,param.age,createDate,userId],function(err,result){
				            		 
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '添加失败'
				            			});
				            		}else{
				            			callback(err);
				            		} 
				            	 });
				             },
				             function(callback){
				            	 connection.commit(function(err){
				            		 callback(err);
				            	 });
				            	 res.json({
				            		 ret_code : '1',
				            		 ret_msg : '添加成功'
				            	 });
				            		 
				            	 
				             }
				             ];
				async.waterfall(tasks,function(err,results){
					if(err){
						connection.rollback();
					}
				});
				connection.release();
				
			});
			
		}
		}