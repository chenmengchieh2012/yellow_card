const cluster = require('cluster');
var io = require('socket.io');
var core = require('./core.js');
var _state = require('./state.js');
var util = require('../util.js')
var workers = {};
var serv_io;

var PLAYER_LIST = {};

function form_playerObj(state, data){
  let self = {
    roomtag: data.roomtag,
    playerID: data.playerID,
    playerName: data.playerName,
    avatarIndex: data.avatarIndex,
    state: state
  };
  return self;
}

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
      if(data.hashTag != undefined && data.hashTag != null){
        socket.hashTag = data.hashTag;
      }
      sendMessagetoWorker(data, socket.id);
    });

    //======================================
    // The first thing when joining room
    //  is to join in the socket room
    //    with the toom tag.
    //======================================
    socket.on('init_room', function(data) {
      console.log('init_room with room tag : ' + data.hashTag);
      console.log('player info: ' + JSON.stringify(data));
      socket.join(data.roomtag);
      console.log("join room")

      let req = {
        event: "newplayer",
        hashTag: data.hashTag,
        msg: data.msg
      }
      sendMessagetoWorker(req, socket.id);
    });

    //======================================
    // start game
    //======================================
    socket.on('startGame',function(data){
      let req = {
        event: "ready",
        hashTag: data.hashTag,
        msg: data.msg
      }
      sendMessagetoWorker(req, socket.id);
    });

    //======================================
    // chating messages
    //======================================
    socket.on('chatMsg', function(data) {
      console.log('chatMsg data: ' + data);
      socket.to(data.roomtag).emit('chatMsg', data);
    });

    //======================================
    // player disconnect
    //=====================================
    socket.on('disconnect', function () {
      if(socket.hashTag != null){
        let socket_id = socket.id;
        let req = {
          event: util.LEAVE_EVENT,
          hashTag: socket.hashTag,
          msg:{}
        }
        sendMessagetoWorker(req, socket.id)
      }
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
        // console.log("master get: " + JSON.stringify(envelope));

        function createResponseCardObj(res,show){
          return {
            "event": res.event,
            "playerid": res.playerid,
            "cardIndex": ((show) ? res.cardIndex : -1),
            "msg": ((show) ? res.cardContext : -1) 
          }
        }

        //==========================================================================
        // socket wants to get the player list from the worker
        //==========================================================================
        if(envelope.res.event == "ready"){
          for(player in envelope.res.readylist){
            for(playerid in envelope.res.playerlist){
              if(player.playerID == playerid){
                serv_io.sockets.connected[playerid.socket_id].emit('ready', 
                  envelope.res.readylist);
              }
            }
          }
        }

        if(envelope.res.event == "newplayer"){
          for(playerid in envelope.res.playerlist){
            console.log("[newplayer-id] " + playerid);
            console.log("[newplayer-data] " + 
              JSON.stringify(envelope.res.playerlist[playerid]));
            let player = envelope.res.playerlist[playerid];
            serv_io.sockets.connected[player.socket_id].emit('playerState', {
              playerlist: envelope.res.playerlist
            });
          }
        }

        if(envelope.res.event == "deleteplayer"){
          for(playerid in envelope.res.playerlist){
            console.log("[deleteplayer-id] " + playerid);
            console.log("[deleteplayer-data] " + 
              JSON.stringify(envelope.res.playerlist[playerid]));
            let player = envelope.res.playerlist[playerid];
            if(player.state != 'offline'){
              serv_io.sockets.connected[player.socket_id].emit('playerState', {
                playerlist: envelope.res.playerlist
              });
            }
          }
        }
        //==========================================================================
        // code by KW
        //==========================================================================


        if(envelope.res.event == util.SETSOCKET_EVENT){
          serv_io.sockets.connected[envelope.socket_id].emit('response',{
            "event":envelope.res.event,
            "socket_id":envelope.res.socket_id
          });
        }

        if(envelope.res.event == util.GET_QUESTIONCARD_EVENT){
          for (k in envelope.res.players) {
            if(k == envelope.res.playerid && envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id]
                .emit('response',createResponseCardObj(envelope.res,true));
            }else if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id]
                .emit('response',createResponseCardObj(envelope.res,false));
            }
          }
        }

        if(envelope.res.event == util.CHOOSE_QUESTIONCARD_EVENT){
          for (k in envelope.res.players) {
            if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id]
                .emit('response',createResponseCardObj(envelope.res,true));
            }
          }
        }

        if(envelope.res.event == util.GET_TEXTCARD_EVENT){
          for (k in envelope.res.players) {
            console.log(k);
            if(k == envelope.res.playerid && envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id]
                .emit('response',createResponseCardObj(envelope.res,true));
            }else if(envelope.res.players[k].socket_id != null){
              serv_io.sockets.connected[envelope.res.players[k].socket_id]
                .emit('response',createResponseCardObj(envelope.res,false));
            }
          }
        }

        if(envelope.res.event == util.SHOW_TEXTCARD_EVENT){
          for (k in envelope.res.players) {
            console.log(k);
            serv_io.sockets.connected[envelope.res.players[k].socket_id]
              .emit('response',envelope.res);
          }
        }

        if(envelope.res.event == util.CHOOSELOSER_EVENT){
          for (k in envelope.res.players) {
            console.log(k);
            serv_io.sockets.connected[envelope.res.players[k].socket_id]
              .emit('response',envelope.res);
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
    console.log("worker get:" + JSON.stringify(envelope, null, 2) );

    //==========================================================================
    // socket wants to get the player list from the worker
    //==========================================================================
    if(envelope.req.event == "newplayer"){
      console.log("coreModule.players: " + JSON.stringify(coreModule.players));
      let player = coreModule.players[envelope.req.msg.playerID];
      player.socket_id = envelope.socket_id;
      player.roomtag = envelope.req.hashTag;
      player.playerID = envelope.req.msg.playerID;
      player.playerName = envelope.req.msg.playerName;
      player.avatarIndex = envelope.req.msg.avatarIndex;
      player.state = "online";
      envelope.res = {
        event: "newplayer",
        playerlist: coreModule.players
      };
      process.send(envelope);
    }
    //==========================================================================
    // code by KW
    //==========================================================================

    if(envelope.req.event == util.JOINGAME_EVENT){
      if(coreModule.players[envelope.req.msg.playerid] != null){
        console.log("workerprocess return");
        return;
      }
      core.joinGame(coreModule,envelope.req.msg);
      console.log("worker join" + JSON.stringify(coreModule) );      
    }

    //test socketio message: {"event": "setsocket","hashTag": "testhashtag","msg":{"playerid": "WTF"}}
    if(envelope.req.event == util.SETSOCKET_EVENT){      
      console.log("[workerprocess] "+ util.SETSOCKET_EVENT);
      core.setSocketid(coreModule,envelope.req.msg,envelope.socket_id);
      if(envelope.socket_id != null){
        envelope.res = {
          event: util.SETSOCKET_EVENT,
          playerid: envelope.req.msg.playerid,
          socket_id: envelope.socket_id
        };
        process.send(envelope);
      }
      if(_state.getEventspermission(stateModule) == util.READY_EVENT){
        stateModule.playerNumber += 1;
      }
    }

    if(isEventAccessable(envelope, util.GET_QUESTIONCARD_EVENT,stateModule) && 
        stateModule.eventsize > 0 ){
      console.log("[workerprocess] "+ util.GET_QUESTIONCARD_EVENT);
      core.getQuestionCard(coreModule,envelope.req.msg,(index,context,weights) => {
        
        stateModule.rememberQuestion.push({'cardIndex':index,'cardContext':context,'weights':weights});
        
        envelope.res = {
          event: util.GET_QUESTIONCARD_EVENT,
          playerid: envelope.req.msg.playerid,
          players: coreModule.players,
          cardIndex: index,
          cardContext: context          
        };        
        process.send(envelope);
      });
      stateModule.eventsize -= 1
    }

    if(isEventAccessable(envelope, util.CHOOSE_TEXTCARD_EVENT,stateModule) &&
      !stateModule.rememberPlayers.includes(envelope.req.msg.playerid) &&
      stateModule.eventsize > 0 ){
      console.log("[workerprocess]" + util.CHOOSE_TEXTCARD_EVENT);

      
      let chooseQuestionWeight = stateModule.rememberQuestion[0].weights;
      if(chooseQuestionWeight != envelope.req.msg.cardWeights){
        return;
      }

      stateModule.rememberText.push({
        playerid: envelope.req.msg.playerid,
        cards: envelope.req.msg.cards
      });

      for(let i=0;i< chooseQuestionWeight ; i++){
        core.chooseTextCard(coreModule,envelope.req.msg.cards[i],() =>{
          console.log("record chooseTextCard");
        })
        coreModule.garbage_textcard.push(envelope.req.msg.cards[i].cardIndex);
        core.getTextCard(coreModule,envelope.req.msg,(index,context,weights) => {
          console.log("give chooseTextCard");
          envelope.res = {
            event: util.GET_TEXTCARD_EVENT,
            playerid: envelope.req.msg.playerid,
            players: coreModule.players,
            cardIndex: index,
            cardContext: context          
          };
          process.send(envelope);
        });
      }
      stateModule.rememberPlayers.push(envelope.req.msg.playerid);
    }

    if(isEventAccessable(envelope, util.CHOOSE_QUESTIONCARD_EVENT,stateModule) && 
        stateModule.eventsize > 0){
        console.log("[workerprocess]" + util.CHOOSE_QUESTIONCARD_EVENT);
        //clone the choose card for remeberQuestion to extract chosed card
        let tmpCard;
        for (let i = 0, len = stateModule.rememberQuestion.length; i < len; i++) {
          if(envelope.req.msg.cardIndex == stateModule.rememberQuestion[i].cardIndex){
            tmpCard = Object.assign({}, stateModule.rememberQuestion[i]);
          }
          coreModule.garbage_questioncard.push(stateModule.rememberQuestion[i].cardIndex);
        }
        stateModule.rememberQuestion = [];
        stateModule.rememberQuestion.push(tmpCard); 

        let msg = envelope.req.msg;
        msg.cardContext = tmpCard.cardContext;
        core.chooseQuestionCard(coreModule,msg, (msg) => {
          console.log('retrun' + msg);
        });

        envelope.res = {
          event: util.CHOOSE_QUESTIONCARD_EVENT,
          playerid: envelope.req.msg.playerid,
          players: coreModule.players,
          cardIndex: tmpCard.cardIndex,
          cardContext: tmpCard.cardContext
        };

        stateModule.eventsize -= 1;
        process.send(envelope);
    }

    if(isEventAccessable(envelope, util.SHOW_TEXTCARD_EVENT,stateModule) && 
        stateModule.eventsize > 0){
        console.log("[workerprocess]" + util.SHOW_TEXTCARD_EVENT);
        if(stateModule.eventsize <= stateModule.rememberText.length){
          let tmpCards = stateModule.rememberText[stateModule.eventsize-1]

          envelope.res = {
            event: util.SHOW_TEXTCARD_EVENT,
            playerid: envelope.req.msg.playerid,
            players: coreModule.players,
            textcards: tmpCards,
            questioncards: stateModule.rememberQuestion[0]
          };
          process.send(envelope);
        }
        
        stateModule.eventsize -= 1;
    }

    if(isEventAccessable(envelope, util.CHOOSELOSER_EVENT,stateModule) && 
        stateModule.eventsize > 0){
        console.log("[workerprocess]" + util.CHOOSELOSER_EVENT);
        for(let i=0,max=stateModule.rememberText.length;i<max;i++){
          if(stateModule.rememberText[i].playerid == envelope.req.msg.loser){
            envelope.res = {
              event: util.CHOOSELOSER_EVENT,
              playerid: envelope.req.msg.playerid,
              players: coreModule.players,
              loser: envelope.req.msg.playerid,
              textcards: stateModule.rememberText[i],
              questioncards: stateModule.rememberQuestion[0]
            };
            process.send(envelope);
          }
        }
        stateModule.rememberText = [];
        stateModule.eventsize -= 1;
    }

    if(isEventAccessable(envelope, util.READY_EVENT, stateModule) && 
          !stateModule.rememberPlayers.includes(envelope.req.msg.playerid)){
      let userTextcardNumber = envelope.req.msg.textcardNumber;
      if(userTextcardNumber < util.USER_TEXTCARD){
        for(let i=0,max=util.USER_TEXTCARD - userTextcardNumber;i<max;i++){
          core.getTextCard(coreModule, envelope.req.msg, (index,context,weights) => {

            envelope.res = {
              event: util.GET_TEXTCARD_EVENT,
              playerid: envelope.req.msg.playerid,
              players: coreModule.players,
              cardIndex: index,
              cardContext: context
            };

            process.send(envelope);
          });
        }        
      }
      stateModule.rememberPlayers.push(envelope.req.msg.playerid);
      stateModule.readyNumber += 1;

    }


    // 判斷是否在等待列表，向所有正在等待中的玩家發送最新等待玩家列表
    // 若有玩家在等待過程中離開則要於等待玩家列表中刪除該玩家，並重新發送
    // if(isEventAccessable(envelope, util.READY_EVENT, stateModule) &&
    //     !stateModule.readyList.includes(envelope.req.msg.playerID)){
    //   stateModule.readyList.push(envelope.req.msg);
    //   envelope.res = {
    //     event: "ready",
    //     playerlist: coreModule.players,
    //     readylist: stateModule.readyList
    //   };
    //   process.send(envelope);
    // }

    if(envelope.req.event == util.LEAVE_EVENT){
      for (let player in coreModule.players) {
        if(coreModule.players[player].socket_id == envelope.socket_id){

          coreModule.players[player].state = "offline";
          envelope.res = {
            event: "deleteplayer",
            playerlist: coreModule.players
          };
          process.send(envelope);

          delete coreModule.players[player];
          stateModule.playerNumber -= 1;

          //[TBD]
          // 1. change leader

        }
      }
    }

    console.log("stateModule.readyNumber ----> : "+stateModule.readyNumber);
    console.log("stateModule.playerNumber ----> : "+stateModule.playerNumber);

    if(stateModule.playerNumber <= stateModule.readyNumber &&
      stateModule.state == 0 && 
      stateModule.playerNumber != 0){
      _state.chooseLeader(stateModule, coreModule.players, stateModule.playerNumber, stateModule.round);

      //[TBD] chooseLeader and tell the leader he/she is the leader.


      stateModule.state = ((stateModule.state+1)%_state.TOTAL_STATE);
      stateModule.rememberPlayers = [];

    }else if(stateModule.state !=0 && stateModule.eventsize == 0){
      stateModule.state = ((stateModule.state+1)%_state.TOTAL_STATE);
      stateModule.rememberPlayers = [];
    }else if(stateModule.members.length <= stateModule.rememberPlayers.length &&
      stateModule.state == 3){

      //[TBD] (DONE) change the ststModule.playerNumber to member's size

      //[TBD] (DONE) change the eventNumber into rememberTextcard
      stateModule.eventsize = stateModule.rememberText.length;

      //change to show card
      stateModule.state = ((stateModule.state+1)%_state.TOTAL_STATE);
      stateModule.rememberPlayers = [];
      envelope.res = {
        event: util.SHOW_TEXTCARD_EVENT,
        playerid: stateModule.leader,
        players: coreModule.players,
      };
      process.send(envelope);
    }

    

    if(prestate != stateModule.state ){
      if(_state.STATE[stateModule.state].eventsize != -1){
        stateModule.eventsize = _state.STATE[stateModule.state].eventsize
      }else if(_state.STATE[stateModule.state].geteventsize == util.KEY_PLAYERS){
        stateModule.eventsize = stateModule.playerNumber;
      }
      prestate = ((prestate + 1)%_state.TOTAL_STATE);
    }

    
    console.log("coremodule: "+ JSON.stringify(coreModule,null,2));
    console.log("statemodule: "+ JSON.stringify(stateModule,null,2));
    console.log("stateModule.eventsize ----> : "+stateModule.eventsize);
    console.log("stateModule.state ----> : "+stateModule.state);

  });
}

function isEventAccessable(envelope,eventName,stateModule){
  return (envelope.req.event == eventName &&
      _state.getEventspermission(stateModule) == eventName &&
      isPersonAccessable(envelope,stateModule)) 

}

function isPersonAccessable(envelope,stateModule){
  let permission = _state.getPlayerspermission(stateModule);
  if(permission.length == 2){
    return true;
  }
  for(let i=0,maxi=permission.length;i<maxi;i++){
    let group = stateModule[permission[i]];
    if(group.includes(envelope.req.msg.playerid)){
      return true;
    }
  }
  return false;
}