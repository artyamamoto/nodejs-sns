
// var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://localhost/chat2');
var util = require('./util');

var Sequelize = require('sequelize');
var Seq = null;
if (process.env.RDS_HOSTNAME) {
	Seq = new Sequelize(
		process.env.RDS_DATABASE, 
		process.env.RDS_USERNAME, 
		process.env.RDS_PASSWORD,
		{ "host" : process.env.RDS_HOSTNAME, 
		  "port" : process.env.RDS_PORT });
} else {
	Seq = new Sequelize('sns1', 'root' ,'a6BFXUp4');
}
var options = {
  "timestamps" : false ,
  "underscored" : true ,
  "feeezeTableName" : true
};

//=== Log
exports.Log = Seq.define('log' , {
  "dt" : Sequelize.DATE ,
  "url" : Sequelize.STRING   
}, options);
exports.Log.sync();



