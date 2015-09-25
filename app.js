
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , flash = require('connect-flash')
  ,Task=require('./models/task.js')
var mongodb = require('./models/db.js');	
var app = express();
var userlist=[];
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(flash());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'c:\\tmp'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ 
      secret: settings.cookieSecret, 
      store: new MongoStore({ 
      db: settings.db 
   }) 
}));

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use(function(req,res,next){
    var err = req.flash('error'),
        success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;
    next();
});
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
 socket.on('online',function(data){
	if(userlist.indexOf(data.user) == -1){
      userlist.unshift(data.user);
    }
	socket.name = data.user;
 Task.get(null,function(err, tasks){
	   //向所有用户广播该用户上线信息
	io.sockets.emit('online',{userlist:userlist});
	for(var i=0; i<tasks.length;i++){
		var clients = io.sockets.clients();
		clients.forEach(function(client){
		if(client.name==data.user){
		 client.emit('task',{from:tasks[i].from,content:tasks[i].content,place:tasks[i].place,place:tasks[i].place,starttime:tasks[i].starttime,startday:tasks[i].startday,endtime:tasks[i].endtime,endday:tasks[i].endday,time:tasks[i].time,old:'yes'});
		}
		});
      };
	});
   
	
	});
 //有人发话
  socket.on('task',function(data){
     //向其他所有用户广播该用户发话信息
     socket.broadcast.emit('task',data);
	 task = new Task('all',data.from, data.content, data.place,data.startday, data.starttime, data.endday, data.endtime);
	 task.save(function(err){
		console.log('save success!!!!');	
			});
  });
  	//掉线，断开链接处理
  socket.on('disconnect',function(){
    //若 users 数组中保存了该用户名
    if(userlist.indexOf(socket.name) != -1){
      //从 users 数组中删除该用户名
      userlist.splice(userlist.indexOf(socket.name),1);
      //向其他所有用户广播该用户下线信息
      socket.broadcast.emit('offline',{userlist:userlist});
    }     
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
mongodb.open(function(err, db) {
routes(app);
});