/**
 * New node file
 */

var pool = require('../modules/MysqlPool');
var async = require('async');
var fs = require("fs");
var sd = require('silly-datetime');

var AreaSQL = {
		
		queryArea : 'select * from area where ID in(select AreaId from role_area where RoleId = ?)',
		queryAreaList : 'select * from area ',
		getAreaRows : 'select count(*) as counts from area',
		deleteArea : 'delete from area where ID = ?',
		addArea : 'insert into area (AreaName,ParentId,CreateUserId) values (?,?,?)',
		
};

module.exports = {
		queryArea : function(req, res) {
			
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
									
									connection.query(AreaSQL.queryAreaList,function(err, result) {
														
														// 以json形式，把操作结果返回给前台页面
														if (typeof result === 'undefined') {
															res.json({
																ret_code : 2,
																ret_msg : '登录失败'
															});

														} else {
																var area = result;
																//console.log(area)
																callback(err,area);
																
														}
													});
								},
								function(area,callback) {
									connection.commit(function(err) {
										callback(err);
									});
									var areaArry = [];
									for (var i = 0; i < area.length; i++) {
                                       
                                        var areaInfo = {
                                            'id': area[i].ID,
                                            'pId': area[i].ParentId,
                                            'name': area[i].AreaName,
                                            'icon': "img/new/areaIndex.png"
                                        };
                                        areaArry.push(areaInfo);
                                       
                                    }
									var areaJson = JSON.stringify(areaArry);
									//console.log(areaJson)
                                    res.send(areaJson);							
                                      
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
		queryAreaList : function(req,res){

			
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
									
									connection.query(AreaSQL.getAreaRows,function(err, result) {
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
									connection.query(AreaSQL.queryAreaList+limitSql,function(err, result) {
										if (typeof result === 'undefined') {
											res.json({
												code : '1',
												msg : '操作失败'
											});
										} else {
											var AreaInfo = result;
											callback(err,AreaInfo,total,page);
											
										}
									});
								},
								function(AreaInfo,total,page,callback) {
									//console.log(AreaInfo)
									connection.commit(function(err) {
										callback(err);
									});
									 res.json({
											list: AreaInfo,
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
		areaDelete : function(req,res){
			
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务出错'
					});
				}
				var areaId = req.body.areaId;
				var tasks = [
				             function(callback){
				            	connection.beginTransaction(function(err){
				            		callback(err);
				            	}); 
				             },
				             function(callback){
				            	 connection.query(AreaSQL.deleteArea,[areaId],function(err,result){
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
				            	 var sql = "select ID from area where ParentId = ?";
				            	 connection.query(sql,[areaId],function(err,result){
					            		if(typeof result === 'undefined'){
					            			res.json({
					            				ret_msg : '查找子区域失败'
					            			});
					            		}else{
					            			var areaList = result;
					            			var areas = [];
					            			if(areaList.length != 0){
					            				console.log(1)
					            				for(var i=0;i<areaList.length;i++){
					            					areas.push(areaList[i].ID);
					            				}
					            			}
					            			console.log(areas.length)
					            			console.log(areas);
					            			callback(err,areas);
					            		}
					            	});
				             },
				             function(areas,callback){
					            	
					            	if(areas.length == 0){
					            		callback(err,areas);
					            	}else{
					            		var sql = "delete from area where ID in(?)";
					            		connection.query(sql,[areas],function(err,result){
						            		if(typeof result === 'undefined'){
						            			res.json({
						            				ret_msg : '删除子区域失败'
						            			});
						            		}else{
						            			callback(err,areas);
						            		}
						            	});
					            	}
					            	
					          },
				             function(areas,callback){
				            	
				            	if(areas.length == 0){
				            		callback(err);
				            	}else{
				            		var sql = "delete from role_area where AreaId in(?)";
				            		connection.query(sql,[areas],function(err,result){
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
					            	var sql = "delete from role_area where AreaId = ?";
					            	connection.query(sql,[areaId],function(err,result){
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
		areaAdd : function(req,res){
			
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
								
				var areapId = param.areapId;
				var areaName = param.areaName;
				var createUserId = req.session.user.ID;
				var createDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
				
				var tasks = [
							function(callback){
								connection.beginTransaction(function(err){
									callback(err);
								}); 
							 },
				             function(callback){
								 var sql = "insert into area (AreaName,ParentId,CreateUserId,CreateDate)values(?,?,?,?)";
								 connection.query(sql,[areaName,areapId,createUserId,createDate],function(err,result){
									 console.log(result)
				            		 if(typeof result === 'undefined'){
				            			 
				            			 res.json({
				            				ret_code : '0' ,
				            				ret_msg　: '添加失败'
				            			 });
				            		 }else{
				            			 var areaId = result.insertId;
				            			 console.log(areaId);
				            			 callback(err,areaId);
				            		 }
				            		 
				            		 
				            	 });
				             },
				             function(areaId,callback){
				            	var sql = "insert into role_area(RoleId,AreaId)values(?,?)"; 
				            	var roleId = req.session.user.roleId;
				            	connection.query(sql,[roleId,areaId],function(err,result){
				            		if(typeof result === 'undefined'){
				            			res.json({
				            				ret_code : '0',
				            				ret_msg : '角色添加区域出错'
				            			});
				            		}else{
				            			callback(err,areaId);
				            		}
				            	});
				             },
				             function(areaId,callback){
				            	 connection.commit(function(err){
				            		 callback(err);
				            	 });
				            	 res.json({
				            		 ret_code : '1',
				            		 ret_msg : '添加成功',
				            		 areaId : areaId
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
		areaEdit : function(req,res){
			pool.getConnection(function(err,connection){
				if(err){
					res.json({
						ret_code : '0',
						ret_msg : '服务出错'
					});
				}
				var areaId = req.body.areaId;
				var areaName = req.body.areaName;
				var updateDate = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
				var updateUserId = req.session.user.ID;
				var tasks = [
								function(callback){
									connection.beginTransaction(function(err){
										callback(err);
									}); 
								 },
					             function(callback){
									 var sql = "update area set AreaName = ?,UpdateDate = ?,UpdateUserId = ? where ID = ?";
									 connection.query(sql,[areaName,updateDate,updateUserId,areaId],function(err,result){
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
