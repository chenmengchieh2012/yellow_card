
$package('yellowcard.model');

yellowcard.model = function () {
  let socket;
  let textcordNumber = 0;
  const EMIT_TOPIC = 'client_message';
  
  function socketIOGetResponse (data,cb) {
    log(data);
    if(data.event == "getquestioncard"){
      if(data.cardIndex == -1 || data.cardIndex == null || data.cardIndex == undefined){
        return;
      }
    }
    if(data.event == "gettextcard"){
      if(data.cardIndex == -1 || data.cardIndex == null || data.cardIndex == undefined){
        return;
      }
      textcardNumber += 1;
    }
    if(data.event == "showtextcard"){
      if(data.textcards == undefined){
        return;
      }
    }
    cb(data); // getQuestionCrad
  }

  return{
    init: () =>{
      socket = io();
      socket.on('connect', (data) => {
        log("connection~~");
      });
    },

    setResponseCallback: (cb) => {
      socket.on('response',socket(data,cb)
    },

    sendChooseQuestion: (hashTag,playerId,cardIndex) => {
      socket.emit(EMIT_TOPIC, {
        event: "choosequestioncard",
        hashTag:hashTag,
        msg:{
          playerid:playerid,
          cardIndex:cardIndex
        }
      });
    },

    sendChooseTextcard: (hashTag,cards) => {
      
      let sendcards = [];

      cards.forEach(function(item){
        let card = {};
        card['order'] = item.order;
        card['cardIndex'] = item.cardIndex;
        card['cardContext'] = item.cardContext;
        sendcards.push(card);
      });

      socket.emit(EMIT_TOPIC, {
        event: "choosetextcard",
        hashTag:hashTag,
        msg:{
          playerid:r,
          cardWeights:2,        
          cards:cards
        }
      });
    },

    sendChooseLoser: (hashTag,playerId,loserId) => {
      socket.emit(EMIT_TOPIC, {
        event: "chooseloser",
        hashTag:hashTag,
        msg:{
          playerid:playerId,
          loser: loserId
        }
      }); 
    }

    
  }
}

$(function() {
  yellowcard.model.init();
});