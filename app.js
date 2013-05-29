

var cluster = require('cluster');
var app = require('./child');
var sockets = require('./sockets');
var cpuNum = require('os').cpus().length;
var http = require('http');

if (cluster.isMaster) {
	for(var i = cpuNum; i >= 0 ; i--) {
		cluster.fork();
	}
	cluster.on('exit', function(worker, code,signal) {
		console.log("worker("+worker.id+").exit " + worker.process.pid);
	});
	cluster.on('online', function(worker) {
		console.log("worker("+worker.id+").online " + worker.process.pid);
	});
	cluster.on('listening', function(worker, address) {
		console.log("worker("+worker.id+").listening " + address.address + ":" + address.port);
	});
} else {
	var server = http.createServer(app);
	server.listen(app.get('port') , function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
	sockets.init(server,app);
}

//var server = http.createServer(app);
//server.listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

//sockets.init(server,app);

/****
cluster('./child')
	.use(cluster.debug())
	.use(cluster.logger())
	.use(cluster.pidfiles())
	.on('close' , function() {
		console.log('cluster end');
	}).listen(3000);
****/



