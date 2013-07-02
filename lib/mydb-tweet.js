

var util = require('./util');
var Sequelize = require('sequelize');
var Seq = require('./config').getDbInstance();

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
    "type" : Sequelize.TEXT,
    "allowNull" : false
  } ,
  "color" : {
    "type" : Sequelize.STRING 
  },
  "image" : {
	"type" : Sequelize.TEXT
  },
  "ins_dt" : Sequelize.DATE 
},options);
exports.Tweet.sync({});

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









