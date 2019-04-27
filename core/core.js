var util = require('../util.js')
var cardmodule = require('./module.js')


function createCore(){
  return {
    "players":{},
    "cardindex":[]
  }
}

module.exports = {
  createModule: function(){
    var coremodule = createCore()

    console.log("[core] init");
    let i;
    for(i=0;i<util.MAX_TEXTCARD;i++){
      coremodule.cardindex.push(-1);
    }
    return coremodule;
  },

  joinGame: function(coremodule,msg) {
    console.log("[core] join: " + JSON.stringify(msg));
    if(msg.playerid != null){
        let id = msg.playerid
        coremodule.players[id] = {"socket_id":null};
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

  getCard: function(coremodule,msg,cb){
    console.log("[core] getCard");
    let index = coremodule.players.indexOf(msg.playerid) ;
    if(index> -1){
      coremodule.players[index] = msg.playerid;
    }
    let cb_getcard = function(index,context){
      console.log("[core] context:",context);
      cb(context);
    }
    cardmodule.getCard(util.QUESTION_CARD_TABLE,index,cb);
  }

}