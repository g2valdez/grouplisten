var app = require('express')(); //tells express where the package is installed
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var connected = 0;

app.set('view options', {layout: false});
app.engine('html', require('ejs').renderFile);

app.use(require('express').static(__dirname));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

http.listen(3000, function(){
	console.log('listening on *:3000');
});

app.get('/', function(req, res){
	res.render(('home.html'), {
		pageHeader: "group.listen"
	});
});

app.get('/host_new_room', function (req, res){
	res.render('host_new_room.html',{
		pageHeader: "host.room",
	});
});

app.post('/room', function(req, res){
	res.render('room_viewer.html', {
		pageHeader: req.body.room
	});
});

io.on('connection', function(socket){
	//console.log('a user connected');
	//connected = connected+1;
	//console.log('Number of users' + connected);
	//socket.on('disconnect', function(){
		//console.log('user disconnected');
	//	connected = connected-1;
		//console.log('Number of users' + connected);
	//});
	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
		//console.log('message: ' + msg);
	});
	socket.on('current time', function(msg){
    	//io.emit('chat message', msg);
		console.log('time: ' + msg);
	});
});

