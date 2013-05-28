
// var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://localhost/chat2');
var util = require('./util');

var Sequelize = require('sequelize');

var Seq = null;
//if (process.env.RDS_HOSTNAME) {
    Seq = new Sequelize(
        "ebdb",
        "ebroot",
        "yamamoto",
        { "host" : "aafdvl5767ymy7.ct6ddgfemi2m.ap-northeast-1.rds.amazonaws.com",
          "port" : 3306 });
//} else {
//    Seq = new Sequelize('sns1', 'root' ,'a6BFXUp4');
//}
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



