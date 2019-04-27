const cluster = require('cluster');
var io = require('socket.io');
var core = require('./core.js')
var workers = {};
var serv_io;

function socketioInit(){
  serv_io.set('log level', 1); // 關閉 debug 訊息
  serv_io.sockets.on('connection', function(socket) {
    setInterval(function() {
      socket.emit('date', {'date': new Date()});
    }, 1000);

    // 接收來自於瀏覽器的資料
    socket.on('client_message', function(data) {
      sendMessagetoWorker(data);
      console.log("Socketio get:" + JSON.stringify(data) );
    });
  });
}

function sendMessagetoWorker(msg){
  if(msg.hashTag == null || msg.hashTag == undefined){
    return null;
  }

  if(workers[msg.hashTag] == undefined || workers[msg.hashTag] == null){
    return null;
  }

  let worker = workers[msg.hashTag].worker;
  worker.send(msg); // send to woekr process function
}

function workerprocess(){
  process.on('message', (msg) => {
    //process.send(msg);
    console.log("worker get:" + JSON.stringify(msg) );
  });
}


module.exports = {
    addWorker: function(hashTag){ //master
      const worker = cluster.fork();
      worker.on('exit', (worker, code, signal) => {
        console.log('worker ${worker.process.pid} died');
      });
      worker.on('message', (msg) => { //worker send message to master
        console.log("master get: " + msg);
      });
      let coreModule = core.createModule()

      // [TODO] init core here
      {}

      workers[hashTag] = {
        "worker":worker,
        "coremodule": coreModule
      };
    },

    workerprocess,
    startSocketio: function(server){ //master
      serv_io = io.listen(server);
      socketioInit();
    },
    sendMessagetoWorker
}