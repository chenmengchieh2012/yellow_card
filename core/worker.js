const {  parentPort } = require('worker_threads');
var util = require('../util.js')
const gamecore = require("./core.js");
gamecore.init();

// 你可以用这个方法从主线程接收消息
parentPort.on('message', (body) => {
  console.log("[worker] get message");
  if(body.event == util.JOINGAME_EVENT){
    gamecore.joinGame(body);
  }

  if(body.event == util.GETCARD_EVENT){
    function cb_getcardcontext(context){
      console.log("[worker] get context: ", context);
      parentPort.postMessage(context);
    }

    gamecore.getCard(body);
  }

  if(body.event == util.SETSOCKET_EVENT){
    gamecore.setSocket(body);
  }
  
  console.log("Main thread body: ", body, util.JOINGAME_EVENT); 
})


//return workers
parentPort.postMessage("worker start waiting...");