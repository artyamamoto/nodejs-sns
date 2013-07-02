
// var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://localhost/chat2');
var util = require('./util');
var Sequelize = require('sequelize');
var Seq = require('./config').getDbInstance();
var options = {
  "timestamps" : false ,
  "underscored" : true ,
  "feeezeTableName" : true, 
  "force" : true 
};

//=== Log
exports.Log = Seq.define('log' , {
  "dt" : Sequelize.DATE ,
  "url" : Sequelize.STRING   
}, options);
exports.Log.sync({});



