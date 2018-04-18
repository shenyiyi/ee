		$(document).ready(function(){
			var setting = {
					view: {
						addHoverDom: addHoverDom,
						removeHoverDom: removeHoverDom,
						selectedMulti: false
					},
					edit: {
						enable: true,
						editNameSelectAll: true,
						showRemoveBtn: showRemoveBtn,
						showRenameBtn: showRenameBtn
					},
					data: {
						simpleData: {
							enable: true,
							idKey:"id",
							pIdKey:"pId"
						}
					},
					callback: {
						beforeDrag: beforeDrag,
						beforeEditName: beforeEditName,
						beforeRemove: beforeRemove,
						beforeRename: beforeRename,
						onRemove: onRemove,
						onRename: onRename
					}
				};
			
			$.ajax({
				type : 'post',
		 		dataType : 'json',
		 		url : '/queryCompetence',
		 		data : {},		
		 		success: function (msg) {
		 				zNodes = JSON.parse(JSON.stringify(msg));
						$.fn.zTree.init($("#treeDemo"), setting,zNodes);
						$("#selectAll").bind("click", selectAll);
						var treeObj = $.fn.zTree.getZTreeObj("treeDemo"); 
						treeObj.expandAll(true); 
				    }
			});
			
			
				
				var log, className = "dark";
				//是否显示删除按钮
				function showRemoveBtn(treeId, treeNode){
					//顶级节点不显示删除按钮，而且数据库必须要有顶级节点的值
					if(treeNode.id == 1){
						return false
					}else{
						return true;
					}
				}
				//是否显示编辑按钮
				function showRenameBtn(treeId, treeNode){
					//顶级节点不显示编辑按钮，而且数据库必须要有顶级节点的值
					if(treeNode.id == 1){
						return false
					}else{
						return true;
					}
				}
				function beforeDrag(treeId, treeNodes) {
					return false;
				}
				function beforeEditName(treeId, treeNode) {
					//if(treeNode.children != undefined){
						//jAlert('请删除子节点后再编辑.', '警告');
						//return false;
					//}
					className = (className === "dark" ? "":"dark");
					showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.selectNode(treeNode);
					zTree.editName(treeNode);
					return false;
				}
				function beforeRemove(treeId, treeNode) {
					className = (className === "dark" ? "":"dark");
					showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.selectNode(treeNode);
					return confirm("确认删除 节点 -> " + treeNode.name + " 吗?");
				}
				function onRemove(e, treeId, treeNode) {
					showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
					var id = treeNode.id;
					$.ajax({
		                  type:"POST",
		                  dataType : 'json',
		                  url:"areaDelete",
		                  data: {areaId: id} ,
			  			  async:false,
		                  success: function(msg){
		                	 layer.alert(msg.ret_msg)
		                  }
		             });
				}
				function beforeRename(treeId, treeNode, newName, isCancel) {
					className = (className === "dark" ? "":"dark");
					showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
					if (newName.length == 0) {
						setTimeout(function() {
							var zTree = $.fn.zTree.getZTreeObj("treeDemo");
							zTree.cancelEditName();
							layer.alert('节点名称不能为空');
						}, 0);
						return false;
					}
					return true;
				}
				function onRename(e, treeId, treeNode, isCancel) {
					showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
					var id = treeNode.id;
					var name = treeNode.name;
					//var pId = treeNode.pId;
					$.ajax({
		                  type:"POST",
		                  dataType : 'json',
		                  url:"areaEdit",
		                  data: {areaId: id,areaName:name} ,
			  			  async:false,
		                  success: function(msg){
		                      layer.alert(msg.ret_msg);
		                  }
		             });
				}
				function showLog(str) {
					if (!log) log = $("#log");
					log.append("<li class='"+className+"'>"+str+"</li>");
					if(log.children("li").length > 8) {
						log.get(0).removeChild(log.children("li")[0]);
					}
				}
				function getTime() {
					var now= new Date(),
					h=now.getHours(),
					m=now.getMinutes(),
					s=now.getSeconds(),
					ms=now.getMilliseconds();
					return (h+":"+m+":"+s+ " " +ms);
				}

				var newCount = 1;
				function addHoverDom(treeId, treeNode) {
					var sObj = $("#" + treeNode.tId + "_span");
					if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
					var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
						+ "' title='添加节点' onfocus='this.blur();'></span>";
					sObj.after(addStr);
					var btn = $("#addBtn_"+treeNode.tId);
					if (btn) btn.bind("click", function(){
						//console.log(treeNode);
						var zTree = $.fn.zTree.getZTreeObj("treeDemo");
						var pId = treeNode.id;
						var name = "编辑节点";
						var data = new FormData();
						data.append("areapId",pId);
						data.append("areaName",name);
						$.ajax({
							type : 'post',
							dataType : 'json',
							url : 'areaAdd',
							data : data,
							contentType : false,
							processData : false,
		                    success: function(result){
		                    	if(result.ret_code == 1){
		                    		zTree.addNodes(treeNode, {id:result.areaId, pId:treeNode.id, name:"编辑节点"});
									return false;
		                    	}else{
		                    		layer.alert("添加节点失败")
		                    	}
		                        
		                    }
		                });
						
					});
				};
				function removeHoverDom(treeId, treeNode) {
					$("#addBtn_"+treeNode.tId).unbind().remove();
				};
				function selectAll() {
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
				}
			});