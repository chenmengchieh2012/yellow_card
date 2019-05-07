var util = require('../util.js')
var cardModule = require('./module.js')


function createCore(){
  return {
    "players":{}, //becareful of modify this value , using in KEY
    "history":[],
    "garbage_questioncard":[],
    "garbage_textcard":[],
    "questioncard":[],
    "textcard":[],
  }
}

function createPlayer(){
  return {
    "socket_id":null,
    "cardsinhand":0,
    "losetimes":0
  }
}

function createHistroryItem(event,playerid,cardindex,others){
  return {
    "evnet":event,
    "player":playerid,
    "cardindex":cardindex,
    "others":others,
  }
}

module.exports = {
  createModule: function(){
    var coreModule = createCore()

    console.log("[core] init");
    let i;
    for(i=0;i<util.MAX_TEXTCARD;i++){      
      coreModule.textcard.push(i+1);
    }

    for(i=0;i<util.MAX_QUESTIONCARD;i++){
      coreModule.questioncard.push(i+1);
    }
    shuffleArray(coreModule.questioncard);
    shuffleArray(coreModule.textcard);
    return coreModule;
  },

  joinGame: function(coreModule,msg) {
    console.log("[core] join: " + JSON.stringify(msg));
    if(msg.playerid != null){
        let id = msg.playerid
        coreModule.players[id] = createPlayer();
    }
    
  },

  setSocketid: function(coreModule,msg,socketid) {
    console.log("[core] setSocketid");
    if(msg.playerid != null){
        let id = msg.playerid
        if(coreModule.players[id] != undefined){
         coreModule.players[id].socket_id = socketid;
        }
    }
  },

  leaveGame: function(coreModule,msg){
    console.log("[core] leaveGame");
    let index = coreModule.players.indexOf(msg.playerid) ;
    if(index> -1){
      coreModule.players.splice(index, 1);
    }
  },

  getQuestionCard: function(coreModule,msg,cb){
    console.log("[core] getQuestionCard");
    if(!checkMsgInfo(coreModule,msg)){
      return;
    }

    if(coreModule.questioncard.length == 0){
      coreModule.questioncard = coreModule.garbage_questioncard.slice();
      coreModule.garbage_questioncard = [];
      shuffleArray(coreModule.questioncard);
    }

    let cardIndex = coreModule.questioncard.splice(0,1);
    coreModule.history.push(createHistroryItem(util.GET_QUESTIONCARD_EVENT,msg.playerid,cardIndex,null));
    

    let cb_getcard = function(index,context,weights){
      console.log("[core] context:",context);
      cb(index,context,weights);
    }

    console.log("cardIndex: "+ (cardIndex));
    cardModule.getCard(util.QUESTION_CARD_TABLE,cardIndex,cb_getcard);
  },

  chooseQuestionCard: function(coreModule,msg,cb){
    console.log("[core] chooseQuestionCard");
    if(!checkMsgInfo(coreModule,msg)){
      return;
    }

    let cardIndex = msg.cardIndex;
    let cardContext = msg.cardContext;
    coreModule.history.push(createHistroryItem(util.CHOOSE_QUESTIONCARD_EVENT,msg.playerid,cardIndex,null));
    
    cb(msg);
  },

  getTextCard: function(coreModule,msg,cb){
    console.log("[core] getCard");
    if(!checkMsgInfo(coreModule,msg)){
      return;
    }

    if(coreModule.textcard.length == 0){
      coreModule.textcard = coreModule.garbage_textcard.slice();
      coreModule.garbage_textcard = [];
      shuffleArray(coreModule.textcard);
    }

    let cardIndex = coreModule.textcard.splice(0,1);
    coreModule.history.push(createHistroryItem(util.GET_TEXTCARD_EVENT,msg.playerid,cardIndex,null));

    let cb_getcard = function(index,context,weights){
      console.log("[core] cb_getcard:",context);
      cb(index,context,weights);
    }

    console.log("random_index: "+ cardIndex);
    cardModule.getCard(util.TEXT_CARD_TABLE,cardIndex,cb_getcard);
  },

  chooseTextCard: function(coreModule,msg,cb){
    console.log("[core] chooseTextCard");
    if(!checkMsgInfo(coreModule,msg)){
      return;
    }

    let cardIndex = msg.cardIndex;
    let cardContext = msg.cardContext;
    coreModule.history.push(createHistroryItem(util.CHOOSE_TEXTCARD_EVENT,msg.playerid,cardIndex,null));
    
    cb(msg);
  },

  chooseLoser: function(coreModule,msg,cb){
    coreModule.history.push(
      createHistroryItem(
        util.CHOOSELOSER_EVENT,
        msg.playerid,
        cardIndex,
        {"loserid":msg.loserid,"completeText":msg.completeText}
      )
    );
    cb(msg);
  }



}

function checkMsgInfo(coremodule,msg){
  if(msg.playerid == null || msg.playerid == undefined){
    return false;
  }
  if(coremodule.players[msg.playerid] == undefined){
    return false;
  }
  if(coremodule.players[msg.playerid].socket_id == null){
    return false;
  }
  return true;
}


/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}