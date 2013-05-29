
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var sockets = require('./sockets');


var MongoStore = require('connect-mongo')(express);

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('port' , 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
/** 
app.use(express.cookieParser());
app.use(express.session({
	"secret" : "topsecret" , 
    "store" : new MongoStore({
		"db" : "sns-session" , 
		"host" : "localhost" , 
		"clear_interval" : 86400 
	}),
    "cookie" : {
		"httpOnly" : false , 
		"maxAge" : new Date(Date.now() + 86400)
	}
}));
**/

app.use(routes.pre.request);
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/login',routes.login.login);
//app.get(/\/regist\/([\w\d_\-]*?)/, routes.regist.get);
//app.get(['/regist/:page','/regist/'], routes.regist.get);
app.get('/regist/' , routes.regist.form);
app.get('/regist/complete' , routes.regist.complete)


//var server = http.createServer(app);
//server.listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

//sockets.init(server,app);


module.exports = app;

