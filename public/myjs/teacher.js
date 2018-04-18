//教师分页显示
function query(){
	
	var total;
	var page = 1;
    var rows = 8;
    
     $.ajax({
    	 
    	type : 'post',
 		dataType : 'json',
 		url : '/queryTeacherList',
 		data : {page:page,rows:rows},		
 		success: function (data) {
		  
 			$('#tb').children('table').remove();//清空数据区
          list = data.list;
             if (list != null) {
             var s = '<table class="table">';
             	s += '<thead><tr><th>序号</th><th>名字</th><th>教师编号</th><th>个人信息</th><th>管理学生</th></tr></thead><tbody>';
            
              $.each(list,function(index,array){ //遍历json数据列 
            	  
            	  var name = array['Name'];
            	  var number = array['Number'];
            	  if(name == null){
            		  name = "";
            	  }
            	  if(number == null){
            		  number = "";
            	  }
            	  
            	  s += '<tr><td>'+(++index)+'</td><td>'+name+'</td><td>'+number+'</td><td><a href="">基本信息</a></td><td><a href="">管理学生</a></td></tr>';
             	 
             	 
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
                      			url : '/queryTeacherList',
                      			data : {page:page,rows:rows},
                      			success: function (data1) {
                            	 
                      				$('#tb').children('table').remove();//清空数据区
	                              list1 = data1.list;   
	                                 if (list1 != null) {                            
	                                	 var s = '<table class="table">';
	                                  	 s += '<thead><tr><th>序号</th><th>名字</th><th>教师编号</th><th>个人信息</th><th>管理学生</th></tr></thead><tbody>';
	                                        
	                                  	$.each(list1,function(index,array){ //遍历json数据列 
                                	   
	                                	  var name = array['Name'];
	                                 	  var number = array['Number'];
	                                 	  if(name == null){
	                               		  name = "";
		                               	  }
		                               	  if(number == null){
		                               		  number = "";
		                               	  }
	                                 	 s += '<tr><td>'+(++index+(page-1)*rows)+'</td><td>'+name+'</td><td>'+number+'</td><td><a href="">基本信息</a></td><td><a href="">管理学生</a></td></tr>';
	                                 	 
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
//添加教师
function add(){
	layer.ready(function(){
		layer.open({
			type: 2,//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
	       	id: 0,
	       	title: false,
	       	resize :false,
	    	move:false, 
	    	shadeClose: true,
	    	area: ['90em', '40em'],
	    	content: "/teacherAddLayer",
	    	
		});
	});
}
//添加教师
function addTeacher(){
	var data = new FormData();
	data.append("name",$("#name").val());
	data.append("age",$("#age").val());
	data.append("number",$("#number").val());
	data.append("phone",$("#phone").val());
	$.ajax({
		type : 'post',
		dataType : 'json',
		url : '/TeacherAdd',
		data : data,
		contentType : false,
		processData : false,
        success: function(data){
        	alert(data.ret_msg);
            
        }
    });
}
