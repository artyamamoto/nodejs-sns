

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
					  //"force" : true ,
					  "define" : { "charset" :"utf8" } });
		} 
		// ! export YAMAMOTO=1
		else if (! process.env.YAMAMOTO) {
			console.log('db rds 2');
			Seq = new Sequelize(
				"ebdb","ebroot", "yamamoto",
				{ "host" : "aafdvl5767ymy7.ct6ddgfemi2m.ap-northeast-1.rds.amazonaws.com",
				  "port" : 3306,
				  //"force" :true,
				  "define" : { "charset":"utf8" } });
		} 
		// local
		else {
			console.log('db local');
			Seq = new Sequelize('sns1', 'root' ,'a6BFXUp4');
		}
		return Seq;
};


