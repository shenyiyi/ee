//教师分页显示
function query(){
	
	var total;
	var page = 1;
    var rows = 8;
    
     $.ajax({
    	 
    	type : 'post',
 		dataType : 'json',
 		url : '/queryRoleList',
 		data : {page:page,rows:rows},		
 		success: function (data) {
		  
 			$('#tb').children('table').remove();//清空数据区
          list = data.list;
             if (list != null) {
             var s = '<table class="table">';
             	s += '<thead><tr><th style="text-align:center;"><input type="checkbox" class="checkall" id="checkboxList" onclick="cli(\'checkboxList\',\'roleids\')"/></th><th style="text-align:center;">序号</th><th style="text-align:center;">角色名</th><th style="text-align:center;">备注信息</th><th style="text-align:center;">操作</th></tr></thead><tbody>';
            
              $.each(list,function(index,array){ //遍历json数据列 
            	  
            	  var name = array['RoleName'];
            	  var remark = array['Remark'];
            	  if(name == null){
            		  name = "";
            	  }
            	  if(remark == null){
            		  remark = "";
            	  }
            	  
            	  s += '<tr><td align="center"><input type="checkbox" name="roleids" value= "'+array['ID']+'"></td>'
             		+'<td align="center">'+(++index)+'</td><td align="center">'+name+'</td>'
             		+'<td align="center">'+remark+'</td>'
             		+'<td align="center">' 
             		+'<a href="#" class="btn btn-primary btn-xs" onclick="return toRoleEdit('+array['ID']+');"'
             		+'style="background-color: #5181C6;margin-right: 10px;">&nbsp编辑&nbsp</a>' 
             		+'<a href="#" class="btn btn-default btn-xs" onclick="return roleDel('+array['ID']+');"'
             		+'style="background-color: #E3EBFE;margin-right: 10px;border-color: #fff;">&nbsp删除&nbsp</a>' 
             		+'</td></tr>';
             	 
             	 
              }); 
              	s += '</tbody></table>';
              	 $('#tb').append(s);
                 total = data.total; //总记录数  
                 
                 var pageCount = Math.ceil(total / rows); //总页数;                
                 var currentPage = data.currentPage; //得到currentPage当前页
                 
                 var options = {
                     bootstrapMajorVersion: 2, //版本
                     currentPage: currentPage, //当前页数
                     totalPages: pageCount, //总页数
                    
                     itemTexts: function (type, page, current) {
                         switch (type) {
                             case "first":
                                 return "首页"; 
                             case "prev":
                                 return "上一页";
                             case "next":
                                 return "下一页";
                             case "last":
                                 return "末页"; 
                             case "page":
                                 return page;
                         }
                     },//点击事件，用于通过Ajax来刷新整个list列表
                     onPageClicked: function (event, originalEvent, type, page) {
                    	
                         $.ajax({
                        	 	type : 'post',
                      			dataType : 'json',
                      			url : '/queryRoleList',
                      			data : {page:page,rows:rows},
                      			success: function (data1) {
                            	 
                      				$('#tb').children('table').remove();//清空数据区
	                              list1 = data1.list;   
	                                 if (list1 != null) {                            
	                                	 var s = '<table class="table">';
	                                  	s += '<thead><tr><th style="text-align:center;"><input type="checkbox" class="checkall" id="checkboxList" onclick="cli(\'checkboxList\',\'roleids\')"/></th><th style="text-align:center;">序号</th><th style="text-align:center;">角色名</th><th style="text-align:center;">备注信息</th><th style="text-align:center;">操作</th></tr></thead><tbody>';
	                                  
	                                  	$.each(list1,function(index,array){ //遍历json数据列 
                                	   
	                                	  var name = array['RoleName'];
	                                 	  var remark = array['Remark'];
	                                 	  if(name == null){
	                               		  name = "";
		                               	  }
		                               	  if(remark == null){
		                               		remark = "";
		                               	  }
		                               	s += '<tr><td align="center"><input type="checkbox" name="roleids" value= "'+array['ID']+'"></td>'
		                               		+'<td align="center">'+(++index)+'</td><td align="center">'+name+'</td>'
		                               		+'<td align="center">'+remark+'</td>'
		                               		+'<td align="center">' 
			                           		+'<a href="#" class="btn btn-primary btn-xs" onclick="return toRoleEdit('+array['ID']+');"'
			                           		+'style="background-color: #5181C6;margin-right: 10px;">&nbsp编辑&nbsp</a>' 
			                           		+'<a href="#" class="btn btn-default btn-xs" onclick="return roleDel('+array['ID']+');"'
			                           		+'style="background-color: #E3EBFE;margin-right: 10px;border-color: #fff;">&nbsp删除&nbsp</a>' 
			                           		+'</td></tr>';
	                                  	}); 
	                                  	
	                                  	 s += '</tbody></table>';
	                                     $('#tb').append(s); 
                                 }
                             }
                         });
                     }
                 };
                 if(total <= 3){
		           	 document.getElementById("example").style.display="none";
		         }else{
		           	 document.getElementById("example").style.display="";
		         }
                 $('#total').text("总记录数为："+total+"条, 总页码数为："+pageCount+"页"); 
                 $('#example').bootstrapPaginator(options);
                 
             }else{
            	 
             }
         }
     });
     
}
//复选框全选或全不选 （注：m为表头复选框id,n为表中复选框的name属性名，非表头）
function cli(m,n) {
	var collid = document.getElementById(m);//获取表头的复选框
	var coll = document.getElementsByName(n);
	if (collid.checked) {
		for ( var i = 0; i < coll.length; i++)
			coll[i].checked = true;
	} else {
		for ( var i = 0; i < coll.length; i++)
			coll[i].checked = false;
	}
}



//添加角色
function add(){
	window.location.href="addRole";
}
//角色编辑
function toRoleEdit(roleId){
	window.location.href="editRole?roleId="+roleId;
}
