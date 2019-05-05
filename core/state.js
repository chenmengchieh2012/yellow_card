var util = require('../util.js')

function createState(){
  return{
    "playerNumber":0,
    "readyNumber":0,
    "leader":[],
    "members":[],
    "rememberQuestion":[],
    "rememberText":[],
    "eventsize":0,
    "cardsize":0,
    "state":0,
    "round":0,
  }
}

const STATE = [
  {
    "state":1,
    "discribe":"finish",
    "permission":["leader","members"],
    "event":util.READY_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERS,
    "cardsize":0
  },
  {
    "state":2,
    "discribe":"getquestion",
    "permission":['leader'],
    "event":util.GET_QUESTIONCARD_EVENT,
    "eventsize":2,
    "cardsize":2
  },
  {
    "state":3,
    "discribe":"choosequestion",
    "permission":["leader"],
    "event":util.DROP_AND_SHOW_QUESTIONCARD_EVENT,
    "eventsize":1,
    "cardsize":2
  },
  {
    "state":4,
    "discribe":"choosetext",
    "permission":["members"],
    "event":util.DROP_TEXTCARD_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERS,
    "cardsize":-1,
    "getcardsize":util.KEY_CARDWEIGHTS
  },
  {
    "state":5,
    "discribe":"showtext",
    "permission":["leader"],
    "event":util.SHOW_TEXTCARD_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERS,
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
  createModule: function(){    
    let stateModule = createState();
    return stateModule;
  },
  chooseLeader: function(stateModule,players,playerNumber,i){
    stateModule.playerNumber = playerNumber;
    let leader = players[i%players.length];
    for (let player in players) {
      if(leader != player){
        stateModule.members.push(leader);
      }
    }
  },
  getPlayerspermission: function(stateModule){
    return STATE[stateModule.state].permission;
  },
  getEventspermission: function(stateModule){
    return STATE[stateModule.state].event;
  },  
  STATE,
  TOTAL_STATE:6
}