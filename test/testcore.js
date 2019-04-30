//client.js
var io = require('socket.io-client');
var request = require('request');

var input = {
  "event": "join",
  "hashTag": "testhashtag",
  "msg":{
    "playerid": "WTF"
  }
}

var input2 = {
  "event": "join",
  "hashTag": "testhashtag",
  "msg":{
    "playerid": "WTF2"
  }
}

request.post('http://localhost:3000/createroom', {json: true, body: input}, function(err, res, body) {
  console.log("res code ===> "+ res.statusCode);
  console.log(body);

  var socket = io.connect('http://localhost:3000', {reconnect: true});

  // Add a connect listener
  socket.on('connect', function (socket) {
    console.log('Connected!');
  });

  socket.on('response', (data) => {
    console.log("======== socketid: " + socket.id + "========");
    console.log('response ====>' + JSON.stringify(data));
  });

  socket.emit('client_message', {"event": "setsocket","hashTag":"testhashtag","msg":{"playerid":"WTF"}});
  socket.emit('client_message', {"event": "getquestioncard","hashTag": "testhashtag","msg":{"playerid": "WTF"}});
  socket.emit('client_message', {"event": "gettextcard","hashTag": "testhashtag","msg":{"playerid": "WTF"}});
});



setTimeout(() =>{
  request.post('http://localhost:3000/joinroom', {json: true, body: input2}, function(err, res, body) {
    console.log("res code ===> "+ res.statusCode);
    console.log(body);

    var socket = io.connect('http://localhost:3000', {reconnect: true});

    // Add a connect listener
    socket.on('connect', function (socket) {
      console.log('Connected!');
    });

    socket.on('response', (data) => {
      console.log("======== socketid: " + socket.id + "========");
      console.log('response ====>' + JSON.stringify(data));
    });

    socket.emit('client_message', {"event": "setsocket","hashTag":"testhashtag","msg":{"playerid":"WTF2"}});
    socket.emit('client_message', {"event": "getquestioncard","hashTag": "testhashtag","msg":{"playerid": "WTF2"}});
    socket.emit('client_message', {"event": "gettextcard","hashTag": "testhashtag","msg":{"playerid": "WTF2"}});
  });
}, 3000);




