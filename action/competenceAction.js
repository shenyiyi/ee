/**
 * New node file
 */

var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");
var sd = require('silly-datetime');

var competenceSQL = {
		
		querycompetence : 'select * from competence where ID in(select CompetenceId from role_competence where RoleId = ?)',
		querycompetenceList : 'select * from competence ',
		getcompetenceRows : 'select count(*) as counts from competence',
		deletecompetence : 'delete from competence where ID = ?',
		addcompetence : 'insert into competence (competenceName,ParentId,CreateUserId) values (?,?,?)',
		
};

module.exports = {
		queryCompetence : function(req, res) {
			
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
									var roleId = req.session.user.roleId;
									
									connection.query(competenceSQL.querycompetenceList,function(err, result) {
														
														// 以json形式，把操作结果返回给前台页面
														if (typeof result === 'undefined') {
															res.json({
																ret_code : 2,
																ret_msg : '登录失败'
															});

														} else {
																var competence = result;
																callback(err,competence);
																
														}
													});
								},
								function(competence,callback) {
									connection.commit(function(err) {
										callback(err);
									});
									var competenceArry = [];
									for (var i = 0; i < competence.length; i++) {
                                       
                                        var competenceInfo = {
                                            'id': competence[i].ID,
                                            'pId': competence[i].ParentId,
                                            'name': competence[i].CompetenceName,
                                            'icon': "img/new/areaIndex.png"
                                        };
                                        competenceArry.push(competenceInfo);
                                       
                                    }
									var competenceJson = JSON.stringify(competenceArry);
                                    res.send(competenceJson);							
                                      
								} ];

						async.waterfall(tasks, function(err, results) {
							if (err) {
								//console.log(err);
								connection.rollback(); // 发生错误事务回滚
							}
						});
						// 释放连接
						connection.release();

					});
		},
		querycompetenceList : function(req,res){

			
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
									
									connection.query(competenceSQL.getcompetenceRows,function(err, result) {
										//console.log(result)
														if (typeof result === 'undefined') {
															res.json({
																code : '1',
																msg : '操作失败'
															});
														} else {
															total = result[0].counts;
															//console.log("Total:" + total);
															callback(err,total);
														}
													});
								},
								function(total,callback){
									rows = req.body.rows * 1;
									page = req.body.page * 1;
									startCount = (page-1) * rows;
									
									var limitSql = " limit "+startCount+" , "+rows;
									connection.query(competenceSQL.querycompetenceList+limitSql,function(err, result) {
										if (typeof result === 'undefined') {
											res.json({
												code : '1',
												msg : '操作失败'
											});
										} else {
											var competenceInfo = result;
											callback(err,competenceInfo,total,page);
											
										}
									});
								},
								function(competenceInfo,total,page,callback) {
									//console.log(competenceInfo)
									connection.commit(function(err) {
										callback(err);
									});
									 res.json({
											list: competenceInfo,
											total : total,
											currentPage : page,
											
										});
									
								} ];

						async.waterfall(tasks, function(err, results) {
							if (err) {
								//console.log(err);
								connection.rollback(); // 发生错误事务回滚
							}
						});
						// 释放连接
						connection.release();

					});
		
		},
		competenceDelete : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务出错'
					});
				}
				var competenceId = req.body.competenceId;
				var tasks = [
				             function(callback){
				            	connection.beginTransaction(function(err){
				            		callback(err);
				            	}); 
				             },
				             function(callback){
				            	 connection.query(competenceSQL.deletecompetence,[competenceId],function(err,result){
				            		 if(typeof result === 'undefined'){
				            			 res.json({
				            				ret_code : '0',
				            				ret_msg : '删除失败'
				            			 });
				            		 }else{
				            			 callback(err);
				            		 }
				            	 });
				             },
				             function(callback){
				            	 var sql = "select ID from competence where ParentId = ?";
				            	 connection.query(sql,[competenceId],function(err,result){
					            		if(typeof result === 'undefined'){
					            			res.json({
					            				ret_msg : '查找子区域失败'
					            			});
					            		}else{
					            			var competenceList = result;
					            			var competences = [];
					            			if(competenceList.length != 0){
					            				console.log(1)
					            				for(var i=0;i<competenceList.length;i++){
					            					competences.push(competenceList[i].ID);
					            				}
					            			}
					            			console.log(competences.length)
					            			console.log(competences);
					            			callback(err,competences);
					            		}
					            	});
				             },
				             function(competences,callback){
					            	
					            	if(competences.length == 0){
					            		callback(err,competences);
					            	}else{
					            		var sql = "delete from competence where ID in(?)";
					            		connection.query(sql,[competences],function(err,result){
						            		if(typeof result === 'undefined'){
						            			res.json({
						            				ret_msg : '删除子区域失败'
						            			});
						            		}else{
						            			callback(err,competences);
						            		}
						            	});
					            	}
					            	
					          },
				             function(competences,callback){
				            	
				            	if(competences.length == 0){
				            		callback(err);
				            	}else{
				            		var sql = "delete from role_competence where competenceId in(?)";
				            		connection.query(sql,[competences],function(err,result){
					            		if(typeof result === 'undefined'){
					            			res.json({
					            				ret_msg : '删除角色子区域失败'
					            			});
					            		}else{
					            			callback(err);
					            		}
					            	});
				            	}
				            	
				             },
				             function(callback){
					            	var sql = "delete from role_competence where competenceId = ?";
					            	connection.query(sql,[competenceId],function(err,result){
					            		if(typeof result === 'undefined'){
					            			res.json({
					            				ret_msg : '删除角色区域失败'
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
		            				 ret_code :　'1',
		            				 ret_msg : '删除区域成功'
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
			
		},
		competenceAdd : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务出错'
					});
				}
				var param = req.query.length > 0 ? req.query
						: req.params.length > 0 ? req.params
								: req.body.length > 0 ? req.body : req.body;
								
				var competencepId = param.competencepId;
				var competenceName = param.competenceName;
				var createUserId = req.session.user.ID;
				var createDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
				
				var tasks = [
							function(callback){
								connection.beginTransaction(function(err){
									callback(err);
								}); 
							 },
				             function(callback){
								 var sql = "insert into competence (competenceName,ParentId,CreateUserId,CreateDate)values(?,?,?,?)";
								 connection.query(sql,[competenceName,competencepId,createUserId,createDate],function(err,result){
									 console.log(result)
				            		 if(typeof result === 'undefined'){
				            			 
				            			 res.json({
				            				ret_code : '0' ,
				            				ret_msg　: '添加失败'
				            			 });
				            		 }else{
				            			 var competenceId = result.insertId;
				            			 console.log(competenceId);
				            			 callback(err,competenceId);
				            		 }
				            		 
				            		 
				            	 });
				             },
				             function(competenceId,callback){
				            	var sql = "insert into role_competence(RoleId,competenceId)values(?,?)"; 
				            	var roleId = req.session.user.roleId;
				            	connection.query(sql,[roleId,competenceId],function(err,result){
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '角色添加区域出错'
				            			});
				            		}else{
				            			callback(err,competenceId);
				            		}
				            	});
				             },
				             function(competenceId,callback){
				            	 connection.commit(function(err){
				            		 callback(err);
				            	 });
				            	 res.json({
				            		 ret_code : '1',
				            		 ret_msg : '添加成功',
				            		 competenceId : competenceId
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
			
		},
		competenceEdit : function(req,res){
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务出错'
					});
				}
				var competenceId = req.body.competenceId;
				var competenceName = req.body.competenceName;
				var updateDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
				var updateUserId = req.session.user.ID;
				var tasks = [
								function(callback){
									connection.beginTransaction(function(err){
										callback(err);
									}); 
								 },
					             function(callback){
									 var sql = "update competence set competenceName = ?,UpdateDate = ?,UpdateUserId = ? where ID = ?";
									 connection.query(sql,[competenceName,updateDate,updateUserId,competenceId],function(err,result){
										 console.log(result)
					            		 if(typeof result === 'undefined'){
					            			 console.log(result)
					            			 res.json({
					            				ret_code : '0',
					            				ret_msg : '编辑失败'
					            			 });
					            		 }
					            		 
					            		 callback(err);
					            		 
					            	 });
					             },
					             function(callback){
					            	 connection.commit(function(err){
					            		 callback(err);
					            	 });
					            	 res.json({
					            		 ret_code : '1',
					            		 ret_msg : '编辑成功'
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
