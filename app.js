var express = require('express');
var http = require('http');
var util = require('./util.js')
var app = module.exports.app = express();
var server = http.createServer(app);
var path = require('path');

var workerHandler = require('./core/handler.js')
const cluster = require('cluster');


const TEST_HASHTAG = "testhashtag";


if (cluster.isMaster) {
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

    let roomTag = req.body.hashTag;
    workerHandler.addWorker(roomTag);

    if(checkexist(req.body)){
      workerHandler.sendMessagetoWorker(req.body,null);
      res.cookie('roomtag', roomTag);
      res.redirect(302, '/room');
    }else{
      res.sendStatus(400);
    }
  });

  app.post('/joinroom', function (req, res) {
    console.log(JSON.stringify(req.body));
    let roomTag = req.body.roomTag;

    //MJ-20190421: send join message to worker.
    if(checkexist(req.body)){
      let ret = workerHandler.sendMessagetoWorker(req.body,null);
      if(ret == null){
        res.sendStatus(400);
        return;
      }
      res.cookie('roomtag', roomTag);
      res.redirect(302, '/room');
    }else{
      res.sendStatus(400);
    }

  });

  server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
  workerHandler.startSocketio(server)
} else {
  workerHandler.workerprocess();
}


function checkexist(body){
  if(body.event == undefined || body.event == null
    || body.msg == undefined){
    return false;
  }
  return true;
}


