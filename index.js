var app = require('express')(); //tells express where the package is installed
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var rooms = [];

app.set('view options', {layout: false});
app.engine('html', require('ejs').renderFile);

app.use(require('express').static(__dirname));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

http.listen(3000, function(){
	console.log('listening on port 3000');
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
	var vidID = req.body.url.substring(32);
	var rn = req.body.room;
	var newRoom = {
		name: rn,
		vidid: vidID
	};
	rooms.push(newRoom);
	res.render('room_viewer.html', {
		pageHeader: req.body.room,
		roomID: vidID
	});
});

app.get('/room/:roomid', function(req, res){
	var roomName;
	for (var i = 0; i < rooms.length; i++){
		if(req.params.roomid === rooms[i].vidid)
			roomName = rooms[i].name;
	}
	res.render('room_viewer.html', {
		pageHeader: roomName,
		roomID: req.params.roomid
	});
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.emit('new connection', "user name");

	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
		//console.log('message: ' + msg);
	});
	socket.on('current time', function(msg){
    	//io.emit('chat message', msg);
		console.log('time: ' + msg);
	});
	//io.emit('new connection', "user name");
});

