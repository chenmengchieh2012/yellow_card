var util = require('../util.js')
var cardmodule = require('./module.js')


function createCore(){
  return {
    "players":{},
    "history":[],
    "garbage_questioncard":[],
    "garbage_textcard":[],
    "questioncard":[],
    "textcard":[],
    "ontable":{
      "questioncard":{},
      "textcard":[]
    }
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
    var coremodule = createCore()

    console.log("[core] init");
    let i;
    for(i=0;i<util.MAX_TEXTCARD;i++){      
      coremodule.textcard.push(i+1);
    }

    for(i=0;i<util.MAX_QUESTIONCARD;i++){
      coremodule.questioncard.push(i+1);
    }
    shuffleArray(coremodule.questioncard);
    shuffleArray(coremodule.textcard);
    return coremodule;
  },

  joinGame: function(coremodule,msg) {
    console.log("[core] join: " + JSON.stringify(msg));
    if(msg.playerid != null){
        let id = msg.playerid
        coremodule.players[id] = createPlayer();
    }
    console.log("coremodule: "+ JSON.stringify(coremodule))
  },

  setSocketid: function(coremodule,msg,socketid) {
    console.log("[core] setSocketid");
    if(msg.playerid != null){
        let id = msg.playerid
        if(coremodule.players[id] != undefined){
         coremodule.players[id].socket_id = socketid;
        }
    }
    console.log("coremodule: "+ JSON.stringify(coremodule))
  },

  leaveGame: function(coremodule,msg){
    console.log("[core] leaveGame");
    let index = coremodule.players.indexOf(msg.playerid) ;
    if(index> -1){
      coremodule.players.splice(index, 1);
    }
  },

  getQuestionCard: function(coremodule,msg,cb){
    console.log("[core] getQuestionCard" + JSON.stringify(coremodule));
    if(!checkMsgInfo(coremodule,msg)){
      return;
    }

    if(coremodule.questioncard.length == 0){
      coremodule.questioncard = coremodule.garbage_questioncard.slice();
      coremodule.garbage_questioncard = [];
      shuffleArray(coremodule.questioncard);
    }

    let cardIndex = coremodule.questioncard.splice(0,1);
    coremodule.history.push(createHistroryItem(util.GET_QUESTIONCARD_EVENT,msg.playerid,cardIndex,null));
    console.log("coremodule: "+ JSON.stringify(coremodule));

    let cb_getcard = function(index,context){
      console.log("[core] context:",context);
      cb(context);
    }

    console.log("cardIndex: "+ (cardIndex));
    cardmodule.getCard(util.QUESTION_CARD_TABLE,cardIndex,cb_getcard);
  },

  dropQuestionCard: function(coremodule,msg,cb){
    console.log("[core] dropQuestionCard" + JSON.stringify(coremodule));
    if(!checkMsgInfo(coremodule,msg)){
      return;
    }

    let cardIndex = msg.cardIndex;
    let cardContext = msg.cardContext
    coremodule.history.push(createHistroryItem(util.DROP_QUESTIONCARD_EVENT,msg.playerid,cardIndex,null));
    console.log("coremodule: "+ JSON.stringify(coremodule));

    coremodule.ontable.questioncard ={
      "playerid":msg.playerid,
      "cardIndex":msg.cardIndex,
      "cardContext":msg.cardContext
    };

    cb(msg);
  },

  getTextCard: function(coremodule,msg,cb){
    console.log("[core] getCard" + JSON.stringify(coremodule));
    if(!checkMsgInfo(coremodule,msg)){
      return;
    }

    if(coremodule.textcard.length == 0){
      coremodule.textcard = coremodule.garbage_textcard.slice();
      coremodule.garbage_textcard = [];
      shuffleArray(coremodule.textcard);
    }

    let cardIndex = coremodule.textcard.splice(0,1);
    coremodule.history.push(createHistroryItem(util.GET_TEXTCARD_EVENT,msg.playerid,cardIndex,null));
    console.log("coremodule: "+ JSON.stringify(coremodule));

    let cb_getcard = function(index,context){
      console.log("[core] context:",context);
      cb(context);
    }

    console.log("random_index: "+ cardIndex);
    cardmodule.getCard(util.TEXT_CARD_TABLE,cardIndex,cb_getcard);
  },

  dropTextCard: function(coremodule,msg,cb){
    console.log("[core] dropQuestionCard" + JSON.stringify(coremodule));
    if(!checkMsgInfo(coremodule,msg)){
      return;
    }

    let cardIndex = msg.cardIndex;
    let cardContext = msg.cardContext;
    coremodule.history.push(createHistroryItem(util.DROP_TEXTCARD_EVENT,msg.playerid,cardIndex,null));
    console.log("coremodule: "+ JSON.stringify(coremodule));

    coremodule.ontable.textcard.push({
      "playerid":msg.playerid,
      "cardIndex":msg.cardIndex,
      "cardContext":msg.cardContext
    });

    cb(msg);
  },

  chooseLoser: function(coremodule,msg,cb){
    coremodule.history.push(
      createHistroryItem(
        util.CHOOSELOSER_EVENT,
        msg.playerid,
        cardIndex,
        {"loserid":msg.loserid,"completeText":msg.completeText}
      )
    );
    coremodule.ontable.textcard = [];
    coremodule.ontable.questioncard = {};
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