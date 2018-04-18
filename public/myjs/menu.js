jQuery(document).ready(function(){
	document.getElementById("top").innerHTML = '<a href="/outUser"><img src="assets/img/quit.png" style="float:right;"/></a>'
	    +'<div onclick="showNews()"><img src="assets/img/news.png" style="float:right;margin-right:40px;"/></div>'
	    +'<div onclick="showUserInfo()"><img src="assets/img/users.png" style="float:right;margin-right:40px;"/></div>';

	$.ajax({
		type : 'post',
		dataType : 'json',
		url : '/menu',
		data : '',
		success : function(data) {
			
			var username = "<div style='width:100%;height:5%;color:#FFFFFF;text-align:center;padding-top:-10px'><h4>"+data.userName+"</h4></div>";
			var menu = "<div style='width:100%;height:65%;'>"
				+"<ul class='drawer'>";
			var menuJson = JSON.parse(data.competence);
			
			for(var i=0;i<getJsonObjLength(menuJson);i++){
				if(menuJson[i].Remark==1){
					
					if(document.getElementById("active").value==menuJson[i].ActionCode){
						menu += "<li><a style='background-color:#2B3953!important;' href='#"+menuJson[i].ActionCode+"'>"
							 +"<font size='4' color='#9FA09F'>"
							 +menuJson[i].CompetenceName
							 +"</font></a>"
							 +"<div id='"+menuJson[i].ActionCode+"'><ul>";
					}else{
						menu += "<li><a href='#"+menuJson[i].ActionCode+"'>"
							 +"<font size='4' color='#9FA09F'>"
							 +menuJson[i].CompetenceName
							 +"</font></a>"
							 +"<div id='"+menuJson[i].ActionCode+"'><ul>";
					}
					
					for(var j=0;j<getJsonObjLength(menuJson);j++){
						if(menuJson[j].ParentId==menuJson[i].ID){
							
							menu +="<li style='width:100%;float:left;'><a href='"+menuJson[j].ActionCode+"'><font size='3'>"
							 +menuJson[j].CompetenceName+"</font></a></li>";
							
							/*if((j+1)%3==0){
								menu +="<li style='width:100%;float:left;'><a href='"+menuJson[j].ActionCode+"'><font size='3'>"
								 +menuJson[j].CompetenceName+"</font></a></li><br>";
							}else{
								menu +="<li style='width:100%;float:left;'><a href='"+menuJson[j].ActionCode+"'><font size='3'>"
								 +menuJson[j].CompetenceName+"</font></a></li>";
							}*/
						}
					}
					menu +="</ul></div></li>";
				}else if(menuJson[i].Level==1){
					if(document.getElementById("active").value==menuJson[i].ActionCode){
						menu += "<li><a style='background-color:#2B3953!important;' href='/"
							 +menuJson[i].ActionCode+"'>"
							 +"<font size='4' color='#9FA09F'>"
							 +menuJson[i].CompetenceName
							 +"</font></a></li>";
					}else{
						menu += "<li><a href='"+menuJson[i].ActionCode+"'><font size='4' color='#9FA09F'>"
							 +menuJson[i].CompetenceName
							 +"</font></a></li>";
					}
				}
				
	    	}
			menu += "</ul></div>";
			
			document.getElementById("menu").innerHTML = username+menu;
		}
	});
});
//获取json数据长度
function getJsonObjLength(jsonObj) {
    var Length = 0;
    for (var item in jsonObj) {
        Length++;
    }
    
    return Length;
}

//显示用户信息
function showUserInfo(){
	$.ajax({
		type : 'post',
		dataType : 'json',
		data : '',
		url : '/queryUserById',
		success : function(data){
			if(data.ret_code == 1){
				var userName = data.ret_userInfo.UserName;
				var Phone = data.ret_userInfo.Phone;
				var DeptName = data.ret_userInfo.DeptName;
				var Email = data.ret_userInfo.Email;
				var content = '<table><tr><td><img src="assets/img/userName.png"/></td><td><div style="padding-left:20px">'+userName+'</div></td></tr>'
									+'<tr><td><img src="assets/img/dept.png"/></td><td><div style="padding-left:20px">'+DeptName+'</div></td></tr>'
									+'<tr><td><img src="assets/img/phone.png"/></td><td><div style="padding-left:20px">'+Phone+'</div></td></tr>'
									+'<tr><td><img src="assets/img/email.png"/></td><td><div style="padding-left:20px">'+Email+'</div></td></tr></table>'
				layer.open({
					title : '',
					content : content,
					area : ['300','220']
				});
			}else{
				layer.alert(data.ret_msg);
			}
		}
	});
}
//显示消息
function showNews(){
	 $.ajax({
	        url: "/queryNewsTypeTotal",
	        datatype: 'json',
	        type: "Post",
	        success: function (data) {
	            var UserTotal = data.UserTotal;
	            var SysTotal = data.SysTotal;
	            var FaultTotal = data.FaultTotal;
	            var content = '<div style="font-size:20px;"><div onclick="window.location.href=\'/information\'">用户信息'+UserTotal+'条</div><div onclick="window.location.href=\'/information\'">系统信息'+SysTotal+'条</div><div onclick="window.location.href=\'/information\'">故障信息'+FaultTotal+'条</div></div>';
	            //queryNewsInformations(1);//默认加载的是用户信息   
	            layer.open({
	            	title : '消息',
					content : content,
					area : ['300','200']
	            });
	        }
	    });
}