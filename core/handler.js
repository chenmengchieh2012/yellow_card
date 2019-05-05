const cluster = require('cluster');
var io = require('socket.io');
var core = require('./core.js');
var _state = require('./state.js');
var util = require('../util.js')
var workers = {};
var serv_io;

function socketioInit(){
  // serv_io.set('log level', 1); // 關閉 debug 訊息
  serv_io.sockets.on('connection', function(socket) {
    setInterval(function() {
      socket.emit('date', {'date': new Date()});
    }, 1000);

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
    })

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
        console.log("master get: " + JSON.stringify(envelope));

        


        if(envelope.req.event == util.SETSOCKET_EVENT){
          serv_io.sockets.connected[envelope.socket_id].emit('response',{
            "event":envelope.req.event,
            "msg":envelope.res.socket_id
          });
        }

        if(envelope.req.event == util.GET_QUESTIONCARD_EVENT){
          for (k in envelope.res.players) {
            if(k == envelope.req.msg.playerid && envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "event":envelope.req.event,
                "playerid":envelope.req.msg.playerid,
                "msg":envelope.res.cardContext
              });
            }else if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "event":envelope.req.event,
                "playerid":envelope.req.msg.playerid,
                "msg":null
              });
            }
          }
        }

        if(envelope.req.event == util.DROP_QUESTIONCARD_EVENT){
          for (k in envelope.res.players) {
            if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "event":envelope.req.event,
                "playerid":envelope.req.msg.playerid,
                "msg":envelope.res.cardContext
              });
            }
          }
        }

        if(envelope.req.event == util.GET_TEXTCARD_EVENT){
          for (k in envelope.res.players) {
            console.log(k);
            if(k == envelope.req.msg.playerid && envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "event":envelope.req.event,
                "playerid":envelope.req.msg.playerid,
                "msg":envelope.res.cardContext
              });
            }else if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id].emit('response',{
                "event":envelope.req.event,
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
  let coreModule = core.createModule();
  let stateModule = _state.createModule();
  let prestate = 0;
  process.on('message', (envelope) => {
    //process.send(msg);

    console.log("permission ---> : " + _state.getEventspermission(stateModule));
    console.log("worker get:" + JSON.stringify(envelope.req) );
    if(envelope.req.event == util.JOINGAME_EVENT){
      if(coreModule.players[envelope.req.msg.playerid] != null){
        console.log("workerprocess return");
        return;
      }
      core.joinGame(coreModule,envelope.req.msg);
      console.log("worker join" + JSON.stringify(coreModule) );
      if(stateModule.state == 1){
        stateModule.playerNumber += 1;
      }
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

    if(envelope.req.event == util.GET_QUESTIONCARD_EVENT &&
      _state.getEventspermission(stateModule) == util.GET_QUESTIONCARD_EVENT &&
      stateModule.eventsize > 0 ){
      console.log("[workerprocess] req: " + JSON.stringify(envelope.req));
      core.getQuestionCard(coreModule,envelope.req.msg,(index,context,weights) => {
        envelope.res = {};
        envelope.res['cardContext'] = context;
        envelope.res['players'] = coreModule.players;
        process.send(envelope);
      });
      stateModule.eventsize -= 1
    }

    if(envelope.req.event == util.GET_TEXTCARD_EVENT){
      console.log("[workerprocess] req: " + JSON.stringify(envelope.req));
      core.getTextCard(coreModule,envelope.req.msg,(index,context,weights) => {
        envelope.res = {};
        envelope.res['cardContext'] = context;
        envelope.res['players'] = coreModule.players;
        process.send(envelope);
      });
    }

    if(envelope.req.event == util.DROP_AND_SHOW_QUESTIONCARD_EVENT
      _state.getEventspermission(stateModule) == util.DROP_AND_SHOW_QUESTIONCARD_EVENT &&
      stateModule.eventsize > 0){
      console.log("[workerprocess] req: " + JSON.stringify(envelope.req));   
      stateModule.eventsize -= 1   
    }

    if(envelope.req.event == util.READY_EVENT){
      stateModule.readyNumber += 1;
    }
    console.log("stateModule.readyNumber ----> : "+stateModule.readyNumber);
    console.log("stateModule.playerNumber ----> : "+stateModule.playerNumber);
    console.log("stateModule.state ----> : "+stateModule.state);
    if(stateModule.playerNumber == stateModule.readyNumber &&
      stateModule.state == 0){
      _state.chooseLeader(stateModule,coreModule.players,stateModule.playerNumber,stateModule.round);
      stateModule.state = ((stateModule.state+1)%_state.TOTAL_STATE);
    }else if(stateModule.state !=0 && stateModule.eventsize == 0){
      stateModule.state = ((stateModule.state+1)%_state.TOTAL_STATE);
    }

    console.log("stateModule.state ----> : "+stateModule.state);

    if(prestate != stateModule.state ){
      if(_state.STATE[stateModule.state].eventsize != -1){
        stateModule.eventsize = _state.STATE[stateModule.state].eventsize
      }else if(_state.STATE[stateModule.state].geteventsize == util.KEY_PLAYERS){
        stateModule.eventsize = coreModule.players.length;
      }
      prestate = ((prestate + 1)%_state.TOTAL_STATE);
    }

    console.log("stateModule.eventsize ----> : "+stateModule.eventsize);
    

  });
}