var util = require('../util.js')

function createState(){
  return{
    "playerNumber":0
    "leader":[],
    "members":[],
    "rememberQuestion":[],
    "rememberText":[],
    "eventsize":0,
    "cardsize":0,
    "state":0
  }
}

const STATE = [
  {
    "state":1,
    "discribe":"finish",
    "permission":["leader","members"],
    "event":util.READY_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERID,
    "cardsize":0
  },
  {
    "state":2,
    "discribe":"getquestion",
    "permission":['leader'],
    "event":util.GET_QUESTIONCARD_EVENT,
    "eventsize":1,
    "cardsize":2
  },
  {
    "state":3,
    "discribe":"choosequestion",
    "permission":["leader"],
    "event":util.DROP_QUESTIONCARD_EVENT,
    "eventsize":1,
    "cardsize":2
  },
  {
    "state":4,
    "discribe":"choosetext",
    "permission":["members"],
    "event":util.DROP_TEXTCARD_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERID,
    "cardsize":-1,
    "getcardsize":util.KEY_CARDWEIGHTS
  },
  {
    "state":5,
    "discribe":"showtext",
    "permission":["leader"],
    "event":util.SHOW_TEXTCARD_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERID,
    "cardsize":0
  },
  {
    "state":6,
    "discribe":"chooseloser",
    "permission":["leader"],
    "event":util.CHOOSELOSER_EVENT,
    "eventsize":1,
    "cardsize":0
  },

]


module.exports = {
  createModule: function(players){
    let playerNumber = players.length;
    let stateModule = createState();
    stateModule.playerNumber = playerNumber;
    let leader = players[0];
    for (let player in players) {
      if(leader < player){
        stateModule.members.push(leader);
        leader = player;
      }else{
        stateModule.members.push(player);
      }
    }
  },
  addStateNumber: function(stateModule){
    stateModule.state = stateModule.state+1;
  },
  getPlayerspermission: function(stateModule){
    return STATE[stateModule.state].permission;
  },
  getEventspermission: function(stateModule){
    return STATE[stateModule.state].event;
  },
  setEventsSize: function(stateModule,eventsize){
    if(STATE[stateModule.state].eventsize == -1){
      stateModule.eventsize = eventsize;
    }else{
      stateModule.eventsize = TATE[stateModule.state].eventsize;
    }
  },
  setCardSize: function(stateModule,eventsize){
    if(STATE[stateModule.state].cardsize == -1){
      stateModule.cardsize = cardsize;
    }else{
      stateModule.cardsize = TATE[stateModule.state].cardsize;
    }
  }
}