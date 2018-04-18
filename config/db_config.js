var config = {
	host : 'localhost',
	port : 3306,
	database : 'yuanying',
	user : 'root',
	password : 'root', // 端口号
	charset : 'UTF8_GENERAL_CI',
	dateStrings : true, // 时间以字符串形式显示，否则会有类似这样的显示：Thu Apr 14 2016 00:00:00
	// GMT+0800 (中国标准时间) 17:20:12
	checkExpirationInterval : 900000,// How frequently expired sessions will
										// be cleared; milliseconds.
	expiration : 86400000,// The maximum age of a valid session; milliseconds.
	connectionLimit : 50,// Number of connections when creating a connection pool
	schema : {
		tableName : 'sessions',
		columnNames : {
			session_id : 'session_id',
			expires : 'expires',
			data : 'data'
		}
	}
}
exports.config = config;
