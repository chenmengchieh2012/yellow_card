module.exports = Object.freeze({
  JOINGAME_EVENT:"join",
  READY_EVENT:"ready",
  GET_QUESTIONCARD_EVENT:"getquestioncard",
  DROP_AND_SHOW_QUESTIONCARD_EVENT:"dropandshowquestioncard",
  GET_TEXTCARD_EVENT:"gettextcard",
  DROP_TEXTCARD_EVENT:"droptextcard",
  ROUND_FINISH_EVENT:"roundfinish",
  CHOOSELOSER_EVENT:"chooseloser",
  SETSOCKET_EVENT:"setsocket",


  MAX_TEXTCARD:2,
  MAX_QUESTIONCARD:5,

  KEY_PLAYERS:"players", //becareful of modify this value , using in KEY
  KEY_CARDWEIGHTS:"weights", //becareful of modify this value , using in KEY


  QUESTION_CARD_TABLE: "QUESTIONCARD",
  TEXT_CARD_TABLE: "TEXTCARE",
  getRandomInt: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});