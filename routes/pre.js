
var MyDb = require('../lib/mydb');
exports.request = function(req,res,next) {
        //console.log('pre.request');
        //console.log('req ; ' + req.url );
        if (req && req.url) {
                MyDb.Log.build({
                        "dt" : new Date() ,
                        "url" : req.url
                }).save();
        }
        next();
};

