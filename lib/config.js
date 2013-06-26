
var is_force = true;

var Sequelize = require('sequelize');




var Seq = null;
exports.getDbInstance = function() {
//		if (Seq)
//			return Seq;
		
		// export RDS_HOSTNAME
		if (process.env.RDS_HOSTNAME) {
			console.log('db rds');
			Seq = new Sequelize(
					process.env.RDS_DB_NAME,
					process.env.RDS_USERNAME,
					process.env.RDS_PASSWORD,
					{ "host" : process.env.RDS_HOSTNAME,
					  "port" : process.env.RDS_PORT , 
					  "force" : is_force ,
					  "define" : { "charset" :"utf8" } });
		} 
		// local
		else {
			console.log('db local');
			Seq = new Sequelize('sns1', 'root' ,'');
		}
		return Seq;
};

