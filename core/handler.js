const cluster = require('cluster');
var io = require('socket.io');
var core = require('./core.js');
var util = require('../util.js')
var workers = {};
var serv_io;

function socketioInit(){
  // serv_io.set('log level', 1); // 關閉 debug 訊息
  serv_io.sockets.on('connection', function(socket) {
    // setInterval(function() {
    //   socket.emit('date', {'date': new Date()});
    // }, 1000);

    // 接收來自於瀏覽器的資料
    socket.on('client_message', function(data) {
      console.log("[socketioInit] Socketio get:" + JSON.stringify(data) );
      let socket_id = socket.id;
      sendMessagetoWorker(data,socket_id);
    });

    socket.on('join_chat_room', function(data) {
      socket.join(data.roomtag);
    });

    socket.on('read_chat_message',function(data){
      socket.broadcast.to(data.roomtag).emit({
        "palyerid":data.playerid,
        "chatMessage":data.chatMessage
      })
    });

    socket.on('chatMsg', function(data) {
      socket.broadcast.to(data.roomtag).emit('chatMsg', data);
    });

    // setInterval(function() {
    //   socket.emit('playerState', {
    //     //player state
    //   });
    // }, 1000);

  });
}

function sendMessagetoWorker(req,socket_id){
  console.log("[sendMessagetoWorker] req: "+JSON.stringify(req));
  console.log("[sendMessagetoWorker] socket_id: "+socket_id);
  if(req.hashTag == null || req.hashTag == undefined){
    return "400";
  }

  if(workers[req.hashTag] == undefined || workers[req.hashTag] == null){
    return "400";
  }

  let worker = workers[req.hashTag];
  let envelope = { 
    "req":req,
    "socket_id": socket_id
  }
  console.log("[sendMessagetoWorker]send...");
  worker.send(envelope); // send to woekr process function
  return "200";
}

module.exports = {
    checkExistWorker: function(hashTag){
      console.log(workers);
      if( workers[hashTag] != undefined || workers[hashTag] != null){
        return true;
      }
      return false;
    },
    addWorker: function(hashTag){ //master
      const worker = cluster.fork();
      worker.on('exit', (worker, code, signal) => {
        console.log('worker ${worker.process.pid} died');
      });
      worker.on('message', (envelope) => { //worker send message to master
        console.log("master get: " + envelope);

        if(envelope.req.event == util.SETSOCKET_EVENT){
          serv_io.sockets.connected[envelope.socket_id].emit('response',{
            "evnet":envelope.req.event,
            "msg":envelope.res.socket_id
          });
        }

        if(envelope.req.event == util.GET_QUESTIONCARD_EVENT){
          if(envelope.res.players[k].socket_id != null){
            serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
              "evnet":envelope.req.event,
              "playerid":envelope.req.msg.playerid,
              "msg":null
            });
          }
        }

        if(envelope.req.event == util.GET_TEXTCARD_EVENT){
          for (k in envelope.res.players) {
            console.log(k);
            if(k == envelope.req.msg.playerid && envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "evnet":envelope.req.event,
                "playerid":envelope.req.msg.playerid,
                "msg":envelope.res.card_context
              });
            }else if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "evnet":envelope.req.event,
                "playerid":envelope.req.msg.playerid,
                "msg":null
              });
            }
          }
        }
                
      });

      workers[hashTag] = worker;
    },

    workerprocess,
    startSocketio: function(server){ //master
      serv_io = io.listen(server);
      socketioInit();
    },
    sendMessagetoWorker
}

function workerprocess(){
  let coreModule = core.createModule()
  process.on('message', (envelope) => {
    //process.send(msg);
    console.log("worker get:" + JSON.stringify(envelope.req) );
    if(envelope.req.event == util.JOINGAME_EVENT){
      core.joinGame(coreModule,envelope.req.msg);
      console.log("worker join" + JSON.stringify(coreModule) );
    }

    //test socketio message: {"event": "setsocket","hashTag": "testhashtag","msg":{"playerid": "WTF"}}
    if(envelope.req.event == util.SETSOCKET_EVENT){      
      console.log("[workerprocess] setSocketid: "+envelope.socket_id);
      console.log("[workerprocess] req: " + JSON.stringify(envelope.req));
      core.setSocketid(coreModule,envelope.req.msg,envelope.socket_id);
      if(envelope.socket_id != null){
        envelope.res = {};
        envelope.res['socket_id'] = envelope.socket_id;
        process.send(envelope);
      }
    }

    if(envelope.req.event == util.GET_QUESTIONCARD_EVENT){
      console.log("[workerprocess] req: " + JSON.stringify(envelope.req));
      core.getQuestionCard(coreModule,envelope.req.msg,(card_context) => {
        envelope.res = {};
        envelope.res['card_context'] = card_context;
        envelope.res['players'] = coreModule.players;
        process.send(envelope);
      });
    }

    if(envelope.req.event == util.GET_TEXTCARD_EVENT){
      console.log("[workerprocess] req: " + JSON.stringify(envelope.req));
      core.getTextCard(coreModule,envelope.req.msg,(card_context) => {
        envelope.res = {};
        envelope.res['card_context'] = card_context;
        envelope.res['players'] = coreModule.players;
        process.send(envelope);
      });
    }
  });
}