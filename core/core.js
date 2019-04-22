var util = require('../util.js')
var cardmodule = require('./module.js')
var players= [];
var cardindex= [];


module.exports = {
  init: function(){
    console.log("[core] init");
    let i;
    for(i=0;i<util.MAX_TEXTCARD;i++){
      cardindex.push(-1);
    }
  },

  joinGame: function(msg) {
    console.log("[core] join");
    if(msg.playerid != null){
        let id = msg.playerid
        playsers.add({id:null});
    }
  },

  leaveGame: function(msg){
    console.log("[core] leaveGame");
    let index = players.indexOf(msg.playerid) ;
    if(index> -1){
      array.splice(index, 1);
    }
  },

  getCard: function(msg,cb){
    console.log("[core] getCard");
    let index = players.indexOf(msg.playerid) ;
    if(index> -1){
      players[index] = msg.playerid;
    }
    let cb_getcard = function(index,context){
      console.log("[core] context:",context);
      cb(context);
    }
    cardmodule.getCard(util.QUESTION_CARD_TABLE,index,cb);
  }

}