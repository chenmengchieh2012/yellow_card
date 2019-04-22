var util = require('../util.js')
var cardmodule = require('./module.js')
module.exports = {
  players: [],
  cardindex: [],

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
        playsers.add(msg.playerid);
    }
  },

  leaveGame: function(msg){
    console.log("[core] leaveGame");
    let index = players.indexOf(msg.playerid) ;
    if(index> -1){
      array.splice(index, 1);
    }
  },

  getCard: function(msg){
    console.log("[core] getCard");
    let index = players.indexOf(msg.playerid) ;
    if(index> -1){
      players[index] = msg.playerid;
    }
    return cardmodule.getCard();
  }

}