const cluster = require('cluster');
var io = require('socket.io');
var workers = {};
var serv_io;

function socketioInit(){
  serv_io.set('log level', 1); // 關閉 debug 訊息
  serv_io.sockets.on('connection', function(socket) {
    setInterval(function() {
      socket.emit('date', {'date': new Date()});
    }, 1000);

    // 接收來自於瀏覽器的資料
    socket.on('client_data', function(data) {
      console.log(data);
    });
  });
}


module.exports = {
    addWorker: function(hashTag){ //master
      const worker = cluster.fork();
      worker.on('exit', (worker, code, signal) => {
        console.log('worker ${worker.process.pid} died');
      });
      worker.on('message', (msg) => { //worker send message to master
        console.log(msg);
      });

      worker.send('hi there');
    },

    workerprocess: function(){ //child
      process.on('message', (msg) => {
        process.send(msg);
      });
    },

    startSocketio: function(server){ //master
      serv_io = io.listen(server);
      socketioInit();
    }
}