module.exports = Object.freeze({
  JOINGAME_EVENT:"join",
  LEAVE_EVENT:"leave",
  READY_EVENT:"ready",
  GET_QUESTIONCARD_EVENT:"getquestioncard",
  GET_TEXTCARD_EVENT:"gettextcard",
  CHOOSE_QUESTIONCARD_EVENT:"choosequestioncard",
  CHOOSE_TEXTCARD_EVENT:"choosetextcard",
  SHOW_TEXTCARD_EVENT:"showtextcard",
  // DROP_TEXTCARD_EVENT:"droptextcard",
  ROUND_FINISH_EVENT:"roundfinish",
  CHOOSELOSER_EVENT:"chooseloser",
  CHANGELEADER_EVENT:"changeleader_event",
  SETSOCKET_EVENT:"setsocket",


  MAX_TEXTCARD:4,
  MAX_QUESTIONCARD:5,
  USER_TEXTCARD:2, //cannot bigger then MAX_TEXTCARD

  KEY_PLAYERS:"players", //becareful of modify this value , using in KEY
  KEY_CARDWEIGHTS:"weights", //becareful of modify this value , using in KEY
  KEY_REMEMBERTEXT:"remembertext",


  QUESTION_CARD_TABLE: "QUESTIONCARD",
  TEXT_CARD_TABLE: "TEXTCARE",
  getRandomInt: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});