const cluster = require('cluster');
var io = require('socket.io');
var core = require('./core.js');
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
  let envolop = { 
    "req":req,
    "socket_id": socket_id
  }
  console.log("[sendMessagetoWorker]send...");
  worker.send(envolop); // send to woekr process function
  return "200";
}

module.exports = {
    addWorker: function(hashTag){ //master
      const worker = cluster.fork();
      worker.on('exit', (worker, code, signal) => {
        console.log('worker ${worker.process.pid} died');
      });
      worker.on('message', (envolop) => { //worker send message to master
        console.log("master get: " + envolop);

        if(envolop.req.event == util.SETSOCKET_EVENT){
          serv_io.sockets.connected[envolop.socket_id].emit('response', 
            {"evnet":envolop.req.event,"msg":envolop.res});
        }

        if(envolop.req.event == util.GETCARD_EVENT){
          serv_io.sockets.connected[envolop.socket_id].emit('response', 
            {"evnet":envolop.req.event,"msg":envolop.res});
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
  process.on('message', (envolop) => {
    //process.send(msg);
    console.log("worker get:" + JSON.stringify(envolop.req) );
    if(envolop.req.event == util.JOINGAME_EVENT){
      core.joinGame(coreModule,envolop.req.msg);
      
      // coreModule.cardindex[i] = 1;
      // i++;
      console.log("worker join" + JSON.stringify(coreModule) );
    }

    //test socketio message: {"event": "setsocket","hashTag": "testhashtag","msg":{"playerid": "WTF"}}
    if(envolop.req.event == util.SETSOCKET_EVENT){      
      console.log("[workerprocess] setSocketid: "+envolop.socket_id);
      console.log("[workerprocess] req: " + JSON.stringify(envolop.req));
      core.setSocketid(coreModule,envolop.req.msg,envolop.socket_id);
      if(envolop.socket_id != null){
        envolop.res = envolop.socket_id;
        process.send(envolop);
      }
    }

    if(envolop.req.event == util.GET_QUESTIONCARD_EVENT){
      console.log("[workerprocess] req: " + JSON.stringify(envolop.req));
      core.getCard(coreModule,envolop.req.msg,(card_context) => {
        envolop.res = card_context;
        process.send(envolop);
      });
    }
  });
}