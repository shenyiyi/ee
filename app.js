/**
 * Module dependencies.
 */

var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var route = require('./routes');

var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var app = express();

var dv_config = require('./config/db_config');

// 输出日志到目录
// var fs = require('fs');
// var accessLogStream = fs.createWriteStream(__dirname + '/log/access.log', {
// flags: 'a', encoding: 'utf8' }); // 记得要先把目录建好，不然会报错
// app.use(logger('combined', { stream: accessLogStream }));

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.favicon());
app.use(express.logger('dev'));

app.use(bodyParser.urlencoded({
	extended : false
}));

app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('sctalk admin manager'));
app.use(express.session({
	secret : 'com.yuanying.www',
	name : 'testapp', // 这里的name值得是cookie的name，默认cookie的name是：connect.sid
	resave : false,
	saveUninitialized : true,
	cookie : {
		minAge : 60 * 60 * 1000
	},
	store : new SessionStore(dv_config.config)
}));

app.use(express.bodyParser({
	keepExtensions : true,
	uploadDir : "./public/upload/img"
}));

app.use(express.multipart());
app.use(bodyParser.json());

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.use(function(req, res, next) {
	var url = req.originalUrl;
	
	req.session._garbage = Date();
	req.session.touch();
	
	if(!req.session.user){
		
		if(url.indexOf('wx')==1){
			
			 if(url != "/wxlogin"  && url != "/wxChargingpileMap" && url != "/wxmobileGetVerificationCode" && url != "/wxmobileUserLogin" && url != "/wxParkinglotMap" && url != "/wxUserInfo" && url !="/wxqueryDeviceByBlur"
				 && url !="/wxqueryDeviceByDeviceType" && url != "/wxqueryParkingLotByDeviceId" && url != "/wxqueryChargingpileByDeviceId" && url != "/wxdeviceDetail" && url !="/wxqueryParkingLotByDeviceId" && url !="/wxqueryChargingpileByDeviceId"){
				
					return res.redirect("/wxlogin");
				}
		}
		else{
			if ( url != "/login" && url != "/signUp" && url != "/sendVerification"//如果!req.session.user（不登录）执行next()查找route,
				&& url != "/uploadTest" && url != "/matchVerification"
				&&  url != "/queryDeviceByDeviceType"
				&& url != "/queryChargeStationById"
				&& url != "/queryParkingLotByDeviceId"
				&& url != "/queryChargingPileBySid" && url != "/queryDeviceByBlur"
				&& url != "/mobileGetVerificationCode" && url != "/mobileUserLogin"
				&& url != "/queryCarNumById" && url != "/insertCarNum"
				&& url != "/deleteCarNumById" && url != "/mobileQueryOrder"
				&& url != "/mobileSetLoginName"
				&& url != "/mobileQueryBalanceByUserId"
				&& url != "/mobileInsertBalance" && url != "/mobileInsertReserve"
				&& url != "/mobileQueryReserveByUserId" && url!="/mobileRechargeByUsersId" && url!="/getRsaPublicKey" 
					&& url!="/api/updateParkingLot"  && url!="/api/queryReserveTime" && url!="/api/apiPCharging"
						   && url!="/api/insertChargingPileOrder" && url!="/api/updateChargingStationByUid"
							   && url!="/alipay"&& url!="/notifyUrl" && url!="/mobileCreateOrder" && url!="/mobileAlipayNotifyUrl"
							   
		) {
				return res.redirect("/login");
		}
		}
	}
	next();
});
app.use(app.router);
// 路由
route.handle(app);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
	/*test.PublicKey();
	test.PrivateKey();
	RSA.PublicKey();
	RSA.PrivateKey();*/
	
});
