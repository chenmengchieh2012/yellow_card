var util = require('../util.js')

function createState(){
  return{
    "playerNumber":0,
    "readyNumber":0,
    "leader":[],
    "members":[],
    "rememberQuestion":[],
    "rememberText":[],
    "rememberPlayers":[],
    "eventsize":0,
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
  },
  {
    "state":2,
    "discribe":"getquestion",
    "permission":['leader'],
    "event":util.GET_QUESTIONCARD_EVENT,
    "eventsize":2,
  },
  {
    "state":3,
    "discribe":"choosequestion",
    "permission":["leader"],
    "event":util.CHOOSE_QUESTIONCARD_EVENT,
    "eventsize":1,
  },
  {
    "state":4,
    "discribe":"choosetext",
    "permission":["members"],
    "event":util.CHOOSE_TEXTCARD_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERS,
  },
  {
    "state":5,
    "discribe":"showtext",
    "permission":["leader"],
    "event":util.SHOW_TEXTCARD_EVENT,
    "eventsize":-1,
    "geteventsize":util.KEY_PLAYERS,
  },
  {
    "state":6,
    "discribe":"chooseloser",
    "permission":["leader"],
    "event":util.CHOOSELOSER_EVENT,
    "eventsize":1,
  },

]


module.exports = {
  createModule: function(){    
    let stateModule = createState();
    return stateModule;
  },
  chooseLeader: function(stateModule,players,playerNumber,i){

    stateModule.playerNumber = playerNumber;
    let leaderindex = i%playerNumber;
    stateModule.leader = [];
    stateModule.members = [];
    let = i;
    for (let player in players) {
      if(i == leaderindex){
        stateModule.leader.push(player);
      }else{
        stateModule.members.push(player);
      }
      i += 1;
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