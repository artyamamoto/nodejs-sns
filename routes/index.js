
/*
 * GET home page.
 */


exports.login = require('./login');
exports.regist = require('./regist');
exports.pre = require('./pre');

exports.index = function(req, res){
  console.log(req.headers);
  res.render('index', { title: 'Express' });
};
