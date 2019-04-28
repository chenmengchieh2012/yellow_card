module.exports = Object.freeze({
  JOINGAME_EVENT:"join",
  GETCARD_EVENT:"getcard",
  SETSOCKET_EVENT:"setsocket",

  MAX_TEXTCARD:5,
  MAX_QUESTIONCARD:5,


  QUESTION_CARD_TABLE: "QUESTIONCARD",
  TEXT_CARD_TABLE: "TEXTCARE",
  getRandomInt: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});