

var util = require('./util');

var Sequelize = require('sequelize');
var Seq = null;
//if (process.env.RDS_HOSTNAME) {
    Seq = new Sequelize(
        "ebdb",
        "ebroot",
        "yamamoto",
        { "host" : "aafdvl5767ymy7.ct6ddgfemi2m.ap-northeast-1.rds.amazonaws.com",
          "port" : 3306,
          "force" :true,
          "define" : { "charset":"utf8" } });
//} else {
//    Seq = new Sequelize('sns1', 'root' ,'a6BFXUp4');
//}
/***
if (process.env.RDS_HOSTNAME) {
    Seq = new Sequelize(
        process.env.RDS_DATABASE,
        process.env.RDS_USERNAME,
        process.env.RDS_PASSWORD,
        { "host" : process.env.RDS_HOSTNAME,
          "port" : process.env.RDS_PORT });
} else {
    Seq = new Sequelize('sns1', 'root' ,'a6BFXUp4');
} ***/


var options = {
  "timestamps" : false ,
  "underscored" : true ,
  "feeezeTableName" : true
};


exports.Tweet = Seq.define('tweet' , {
  "user_account" : {
    "type"      : Sequelize.STRING,
    "allowNull" : false ,
    "unique"    : false 
  } ,
  "message" : {
    "type" : Sequelize.STRING,
    "allowNull" : false
  } ,
  "color" : {
    "type" : Sequelize.STRING 
  },
  "ins_dt" : Sequelize.DATE 
},options);
exports.Tweet.sync({"force":true});

exports.Tweet.fetch = function(offset,limit,callback,callback_err) {
	if (! limit )
		limit = 15;
	var conditions = {
		"offset" : offset , 
		"limit" : limit ,   
		"order" : "id DESC"
	};
	exports.Tweet.findAll(conditions).success(function(tweets) {
		callback(tweets);
	}).error(function(errmsg) {
		callback_err(errmsg);
	});
};
exports.Tweet.fetchBefore = function(tweet_id,limit, callback,callback_err) {
	try { tweet_id = parseInt(tweet_id); }
	catch(e) { callback_err(); return ; }
	
    if (! limit )
        limit = 15;
    var conditions = {
		"where" : "id < " + tweet_id,
        "offset" : 0 , 
        "limit" : limit  ,
		"order" : "id DESC"
    };
    exports.Tweet.findAll(conditions).success(function(tweets) {
        callback(tweets);
    }).error(function(errmsg) {
        callback_err(errmsg);
    });
};









