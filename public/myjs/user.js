/**
 * page/user.js
 * 
 */

var mailTest = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
var phoneTest = /^1\d{10}$/;
function register() {

	if ($("#testtype").val() == 0) {
		$("#emailTest").css('display', '');
		$("#phoneTest").css('display', 'none');
	} else {
		$("#emailTest").css('display', 'none');
		$("#phoneTest").css('display', '');
	}
}

function sendVerification() {

	var formParam;

	if ($("#testtype").val() == 0) {
		if ($("#email").val() == '' || !mailTest.test($("#email").val())) {
			alert("请输入正确的邮箱格式！");
			return;
		}
		formParam = {
			testtype : 0,
			email : $("#email").val()
		};
	} else {

		if ($("#phone").val() == '' || !phoneTest.test($("#phone").val())) {
			alert("请输入正确的号码格式！");
			return;
		}
		formParam = {
			testtype : 1,
			phone : $("#phone").val()
		};
	}
	$.ajax({
		type : 'post',
		url : '/sendVerification',
		data : formParam,
		dataType : 'json',
		success : function(data) {
			// alert(data);
			// 已发送提醒
		}
	});
}

function submitVerification() {

	var formParam;

	if ($("#testtype").val() == 0) {
		if ($("#email").val() == '' || !mailTest.test($("#email").val())) {
			alert("请输入正确的邮箱格式！");
			return;
		}
		formParam = {
			testtype : 0,
			email : $("#email").val(),
			verification : $("#verification").val()
		};
	} else {

		if ($("#phone").val() == '' || !phoneTest.test($("#phone").val())) {
			alert("请输入正确的号码格式！");
			return;
		}
		formParam = {
			testtype : 1,
			phone : $("#phone").val(),
			verification : $("#verification").val()
		};
	}
	$.ajax({
		type : 'post',
		url : '/matchVerification',
		data : formParam,
		dataType : 'json',
		success : function(data) {
			if (data.code == '0') {
				$("#info").css('display', 'block');
				$("#send").css('display', 'none');

			} else {
				alert(data.msg);
			}
		}
	});
}

function submitVerification() {

	var formParam;

	if ($("#testtype").val() == 0) {
		if ($("#email").val() == '' || !mailTest.test($("#email").val())) {
			alert("请输入正确的邮箱格式！");
			return;
		}
		formParam = {
			testtype : 0,
			email : $("#email").val(),
			verification : $("#verification").val()
		};
	} else {

		if ($("#phone").val() == '' || !phoneTest.test($("#phone").val())) {
			alert("请输入正确的号码格式！");
			return;
		}
		formParam = {
			testtype : 1,
			phone : $("#phone").val(),
			verification : $("#verification").val()
		};
	}
	$.ajax({
		type : 'post',
		url : '/matchVerification',
		data : formParam,
		dataType : 'json',
		success : function(data) {
			if (data.code == '0') {
				$("#info").css('display', 'block');
				$("#send").css('display', 'none');
				if ($("#testtype").val() == 0) {
					$("#LoginName").val(formParam.email);
				} else {
					$("#LoginName").val(formParam.phone);
				}
				$("#InvitationCode").val($("code").val());
			} else {
				alert(data.msg);
			}
		}
	});
}

function regUser() {

	if ($("#password").val() != $("#password2").val()) {
		alert("确认密码不匹配");
		return false;
	}
	if ($("#documentImg").val() == "" || $("#bankCardImg").val() == "") {
		alert("证件图片或者银行卡图片未上传");
		return false;
	}

	return true;
}


function uploadAjax(fileId, imgId) {
	var data = new FormData();
	files = $("#" + fileId)[0].files;
	if (files) {
		data.append("file", files[0]);
	} else {
		return;
	}

	$.ajax({
		type : 'post',
		dataType : 'json',
		url : '/upload',
		data : data,
		contentType : false,
		processData : false,
		success : function(data, textStatus) {
			$("#" + imgId).css('display', '');
			$("#" + imgId).attr('src', data.path);
			$("#" + hiddenId).val( data.path);
		}
	});

}

function loginCheck() {

	var mailTest = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	var phoneTest = /^1\d{10}$/;
//	if ($("#LoginName").val() == '' || !(mailTest.test($("#LoginName").val()))
//			|| !(phoneTest.test($("#LoginName").val()))) {
//	}
	var data = new FormData();
	data.append("LoginName",$("#LoginName").val());
	data.append("Password",$("#Password").val());
	$.ajax({
		type : 'post',
		dataType : 'json',
		url : '/login',
		data : data,
		contentType : false,
		processData : false,
		success : function(data) {

			var code = data.ret_code;
			if(code == 0){
				
				window.location.href="index";
			}else if(code == 1){
				layer.alert("密码错误！");
			}else if(code == 400){
				layer.alert("找不到该用户！");
			}else if(code == 2){
				layer.alert("登录失败！");
			}
		}
	});
}
