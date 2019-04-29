module.exports = Object.freeze({
  JOINGAME_EVENT:"join",
  GET_QUESTIONCARD_EVENT:"getquestioncard",
  GET_TEXTCARD_EVENT:"gettextcard",
  DROP_QUESTIONCARD_EVENT:"dropquestioncard",
  DROP_TEXTCARD_EVENT:"droptextcard",
  CHOOSELOSER_EVENT:"chooseloser",
  SETSOCKET_EVENT:"setsocket",


  MAX_TEXTCARD:2,
  MAX_QUESTIONCARD:5,


  QUESTION_CARD_TABLE: "QUESTIONCARD",
  TEXT_CARD_TABLE: "TEXTCARE",
  getRandomInt: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});