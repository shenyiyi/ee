/**
 * New node file
 */
var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");
var sd = require('silly-datetime');

var RoleSQL = {
		
		queryRoleList : 'select * from role ',
		getRoleRows : 'select count(*) as counts from role',
		
		
};

module.exports = {
		queryRoleList : function(req, res) {
			
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
									
									connection.query(RoleSQL.getRoleRows,function(err, result) {
										console.log(result)
														if (typeof result === 'undefined') {
															res.json({
																code : '1',
																msg : '操作失败'
															});
														} else {
															total = result[0].counts;
															
															callback(err,total);
														}
													});
								},
								function(total,callback){
									rows = req.body.rows * 1;
									page = req.body.page * 1;
									startCount = (page-1) * rows;
									
									var limitSql = " limit "+startCount+" , "+rows;
									connection.query(RoleSQL.queryRoleList+limitSql,function(err, result) {
										if (typeof result === 'undefined') {
											res.json({
												code : '1',
												msg : '操作失败'
											});
										} else {
											var RoleInfo = result;
											callback(err,RoleInfo,total,page);
											
										}
									});
								},
								function(RoleInfo,total,page,callback) {
									
									connection.commit(function(err) {
										callback(err);
									});
									 res.json({
											list: RoleInfo,
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
		RoleAdd : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务器出错'
					});
				}
				var roleName = req.body.name;
				var remark = req.body.remark;
				var tempId = req.body.tempId;
				
				var tempId1 = req.body.tempId1;
				var createDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');	
				var createUserId = req.session.user.ID;
				
				console.log(roleName,remark,tempId)
				var tasks = [
				             function(callback){
				            	connection.beginTransaction(function(err){
				            		callback(err);
				            	}); 
				             },
				             function(callback){
				            	 var sql = "insert into role (RoleName,CreateDate,CreateUserId,Remark) values(?,?,?,?)";
				            	 connection.query(sql,[roleName,createDate,createUserId,remark],function(err,result){
				            		 console.log(result)
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '添加失败'
				            			});
				            		}else{
				            			var roleId = result.insertId;
				            			callback(err,roleId);
				            		} 
				            	 });
				             },
				             function(roleId,callback){
				            	 var sql = "insert into role_area(RoleId,AreaId)values(?,?)";
				            	 for(var i=0;i<tempId.split(",").length;i++){
				 					var areaId = tempId.split(",")[i]
				 					connection.query(sql,[roleId,areaId],function(err,result){
				 						if(typeof result === 'undefined'){
				 							res.json({
				 								ret_code : '0',
				 								ret_msg : '添加失败'
				 							});
				 						}
				 						
				 					});
				 					
				 				}
				            	 callback(err,roleId);
				             },
				             function(roleId,callback){
				            	 var sql = "insert into role_competence(RoleId,CompetenceId)values(?,?)";
				            	 for(var i=0;i<tempId1.split(",").length;i++){
				 					var competenceId = tempId1.split(",")[i];
				 					connection.query(sql,[roleId,competenceId],function(err,result){
				 						if(typeof result === 'undefined'){
				 							res.json({
				 								ret_code : '0',
				 								ret_msg : '添加失败'
				 							});
				 						}
				 						
				 					});
				 					
				 				}
				            	 callback(err);
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
			
		},
		RoleEdit : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务器出错'
					});
				}
				var roleId = req.body.roleId;
				var roleName = req.body.name;
				var remark = req.body.remark;
				var tempId = req.body.tempId;
				var tempId1 = req.body.tempId1;
				var updateDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');	
				var updateUserId = req.session.user.ID;
				
				console.log("tempId"+tempId+",tempId1"+tempId1);
				var tasks = [
				             function(callback){
				            	connection.beginTransaction(function(err){
				            		callback(err);
				            	}); 
				             },
				             function(callback){
				            	 var sql = "update role set RoleName = ?,Remark = ?,UpdateDate = ?,UpdateUserId = ? where ID = ?";
				            	 connection.query(sql,[roleName,remark,updateDate,updateUserId,roleId],function(err,result){
				            		 console.log(result)
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '编辑失败'
				            			});
				            		}else{
				            			callback(err);
				            		} 
				            	 });
				             },
				             function(callback){
				            	 var sql = "delete from role_area where RoleId = ?";
				            	 connection.query(sql,[roleId],function(err,result){
				            		 console.log("删除"+result)
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '删除角色区域失败'
				            			});
				            		}else{
				            			callback(err);
				            		} 
				            	 });
				             },
				             function(callback){
				            	 var sql = "insert into role_area(RoleId,AreaId)values(?,?)";
				            	 for(var i=0;i<tempId.split(",").length;i++){
				 					var areaId = tempId.split(",")[i];
				 					connection.query(sql,[roleId,areaId],function(err,result){
				 						if(typeof result === 'undefined'){
				 							res.json({
				 								ret_code : '0',
				 								ret_msg : '添加失败'
				 							});
				 						}
				 						
				 					});
				 					
				 				}
				            	 callback(err);
				             },
				             function(callback){
				            	 var sql = "delete from role_competence where RoleId = ?";
				            	 connection.query(sql,[roleId],function(err,result){
				            		 console.log(result)
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '删除角色权限失败'
				            			});
				            		}else{
				            			callback(err);
				            		} 
				            	 });
				             },
				             function(callback){
				            	 var sql = "insert into role_competence(RoleId,CompetenceId)values(?,?)";
				            	 for(var i=0;i<tempId1.split(",").length;i++){
				 					var competenceId = tempId1.split(",")[i];
				 					connection.query(sql,[roleId,competenceId],function(err,result){
				 						if(typeof result === 'undefined'){
				 							res.json({
				 								ret_code : '0',
				 								ret_msg : '添加失败'
				 							});
				 						}
				 						
				 					});
				 					
				 				}
				            	 callback(err);
				             },
				             function(callback){
				            	 connection.commit(function(err){
				            		 callback(err);
				            	 });
				            	 
				            	 var roleIds = JSON.stringify(roleId)
				            	 console.log(roleIds)
				            	 res.json({
				            		 ret_code : '1',
				            		 ret_msg : '编辑成功'
				            	 });
				            	 console.log("444") 
				            	 
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
		findRoleById : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务器出错'
					});
				}
				var roleId = req.body.roleId;
				console.log(roleId)
				var tasks = [
				             function(callback){
				            	connection.beginTransaction(function(err){
				            		callback(err);
				            	}); 
				             },
				             function(callback){
				            	 var sql = "select RoleName,Remark from role where ID = ?";
				            	 connection.query(sql,[roleId],function(err,result){
				            		 
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '查询失败'
				            			});
				            		} else{
				            			var roleName = result[0].RoleName;
				            			console.log(roleName)
				            			var Remark = result[0].Remark;
				            			callback(err,roleName,Remark);
				            		}
				            	 });
				             },
				             function(roleName,Remark,callback){
				            	 var sql = "select AreaId from role_area where RoleId = ?";
				            	 connection.query(sql,[roleId],function(err,result){
				            		 
					            		if(typeof result === 'undefined'){
					            			res.json({
					            				ret_code : '0',
					            				ret_msg : '查询失败'
					            			});
					            		} else{
					            			var areaIds = "";
					            			for(var i=0;i<result.length;i++){
					            				var areaId = result[i].AreaId;
					            				areaIds += areaId + ",";
					            			}
					            			
					            			var areaJson = areaIds.substring(0,areaIds.length-1);
					            			console.log(areaJson)
					            			callback(err,roleName,Remark,areaJson);
					            		}
					            	 });
				             },
				             function(roleName,Remark,areaJson,callback){
				            	 var sql = "select CompetenceId from role_competence where RoleId = ?";
				            	 connection.query(sql,[roleId],function(err,result){
					            		if(typeof result === 'undefined'){
					            			res.json({
					            				ret_code : '0',
					            				ret_msg : '查询失败'
					            			});
					            		} else{
					            			var competenceIds = "";
					            			for(var i=0;i<result.length;i++){
					            				var competenceId = result[i].CompetenceId;
					            				competenceIds += competenceId + ",";
					            			}
					            			var competenceJson = competenceIds.substring(0,competenceIds.length-1);
					            			console.log(competenceJson)
					            			callback(err,roleName,Remark,areaJson,competenceJson);
					            		}
					            	 });
				             },
				             function(roleName,Remark,areaJson,competenceJson,callback){
				            	 connection.commit(function(err){
				            		 callback(err);
				            	 });
				            	 
				            	 res.json({
				            		 ret_code : '1',
				            		 ret_msg : '查询成功',
				            		 roleName : roleName,
				            		 Remark : Remark,
				            		 areaJson : areaJson,
				            		 competenceJson : competenceJson
				            	 });
				            		 
				            	 
				             }];
				async.waterfall(tasks,function(err,results){
					if(err){
						connection.rollback();
					}
				});
				connection.release();
			});
		}
	}