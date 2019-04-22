var express = require('express');
var http = require('http');
var workerhandler = require('./core/main.js');
var util = require('./util.js')
var app = module.exports.app = express();
var server = http.createServer(app);
var path = require('path');
var io = require('socket.io');


const TEST_HASHTAG = "testhashtag";

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/room', function (req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'text/html');
  res.cookie('roomtag', TEST_HASHTAG);
  res.send("<h5> room </h5>");
  
});

app.post('/createroom', function (req, res) {
  console.log(JSON.stringify(req.body));

  let roomTag = TEST_HASHTAG;
  workerhandler.addWorker(roomTag);
  
  //MJ-20190421: send join message to worker.
  if(checkexist(req.body)){
    workerhandler.postMessage(roomTag,req.body)
    res.status(200);
    res.cookie('roomtag', TEST_HASHTAG);
    res.redirect(302, '/room');
  }else{
    res.sendStatus(400);
  }
});

app.post('/joinroom', function (req, res) {
  console.log(JSON.stringify(req.body));
  
  let roomTag = req.cookie('roomtag', TEST_HASHTAG);
  if(roomTag == null){
    roomTag = req.body.roomTag;
    res.cookie('roomtag', TEST_HASHTAG);
  }
  //MJ-20190421: send join message to worker.
  if(checkexist(req.body)){
    workerhandler.postMessage(roomTag,req.body)
    res.status(200);
    res.redirect(302, '/room');
  }else{
    res.sendStatus(400);
  }

});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


function checkexist(body){
  if(body.event == undefined || body.event == null
    || body.msg == undefined){
    return false;
  }
  return true;
}

var serv_io = io.listen(server);
serv_io.sockets.on('connection', function(socket) {
    socket.emit('message', {'message': 'hello world'});
});
