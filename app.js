var exports = module.exports = {};

var server = "";
var io = "";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var fs = require('fs');
var $ = require('jquery');


require('dotenv').config();
mongoose.set('bufferCommands', false);
var mongoDB = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0-tynch.mongodb.net/listify?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));


var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();


// view engine setup
var port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "asfewfdgfd",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(logger('dev'));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));


app.use(function (req, res, next) {
  //res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



//console.log("sj");
var clients = [];
app.get('/clients', function (req,res) {
    res.send({clients:clients});
} );


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



server = require('http').Server(app);
io = require('socket.io')(server);
exports.app = app;
server.listen(port);

console.log("Socketserver running on port:" + port);

var ent = require('ent');




io.on('connection', function (socket) {
  clients = Object.keys(io.engine.clients);
   
  console.log("======>>> new connection: ",socket.id);
  io.to(socket.id).emit('yourid', socket.id);
  //io.to(socket.id).emit('allClients', socket.id);

  // When the username is received it’s stored as a session variable and informs the other people
  socket.on('new_client', function (wid, username) {
    //username = ent.encode(username);
    socket.username = username;
    //console.log("======>>> new client: ", clients);
    //io.engine === io.eio // => true
    console.log("======>>> new connection2: ",socket.id);

    console.log("===================>>> new client io socket clients:\n ", Object.keys(io.engine.clients));
    clients = Object.keys(io.engine.clients);

    socket.broadcast.emit('new_client', {
      username: socket.username,
      wid: wid
    });
  });

  // When a message is received, the client’s username is retrieved and sent to the other people
  socket.on('message', function (message, wid) {
    //message = ent.encode(message);
    socket.broadcast.emit('message', {
      username: socket.username,
      message: message,
      wid: wid
    });
  });

  socket.on('canCommit', function (mySocket_id, wid) {
    //message = ent.encode(message);
    socket.broadcast.emit('canCommit', {
      username: socket.username,
      requestSocket_id: mySocket_id,
      wid: wid
    });
  });

  socket.on('preCommit', function (mySocket_id, wid) {
    //message = ent.encode(message);
    socket.broadcast.emit('preCommit', {
      username: socket.username,
      requestSocket_id: mySocket_id,
      wid: wid
    });
  });

  socket.on('globalAbort', function (mySocket_id, wid) {
    //message = ent.encode(message);
    socket.broadcast.emit('canCommit', {
      username: socket.username,
      requestSocket_id: mySocket_id,
      wid: wid
    });
  });

  socket.on('canCommitReply', function (editing_flag, requestSocket_id, mySocket_id, wid) {
    //message = ent.encode(message);
    var date = new Date();
    var timestamp = date.getTime();
    io.to(requestSocket_id).emit('canCommitReply', {
        username: socket.username,
        replySocket_id: mySocket_id,
        wid: wid,
        editing_flag: editing_flag,
        timestamp: timestamp
    });
  });

  socket.on('preCommitReply', function ( requestSocket_id, mySocket_id, wid) {
    //message = ent.encode(message);
    var date = new Date();
    var timestamp = date.getTime();
    io.to(requestSocket_id).emit('preCommitReply', {
        username: socket.username,
        replySocket_id: mySocket_id,
        wid: wid,
        editing_flag: false,
        timestamp: timestamp
    });
  });

  socket.on('disconnect', function () {
    //clients.splice(clients.indexOf(socket), 1);
    console.log("======>>> disconnect client: ", Object.keys(io.engine.clients));
    clients = Object.keys(io.engine.clients);

  });

});



/*
io.on('connection', function (socket) {

  // When the username is received it’s stored as a session variable and informs the other people
  socket.on('new_client', function (wid) {
    //username = ent.encode(username);
    //socket.username = username;
    socket.broadcast.emit('new_client', {
      //username: socket.username,
      wid: wid
    });
  });

  // When a message is received, the client’s username is retrieved and sent to the other people
  socket.on('message', function (message,wid) {
    //message = ent.encode(message);
    socket.broadcast.emit('message', {
      //username: socket.username,
      message: message,
      wid: wid
    });
  });

  socket.on('disconnect', function () {

  });

  

});

*/
