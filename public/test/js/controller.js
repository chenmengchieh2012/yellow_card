const addMessageElement = (el, options) => {
  var $el = $(el);
  $messages = $("#message");
  $messages.append($el);
}
const log = (message) => {
  var $el = $('<li>').text(JSON.stringify(message));
  addMessageElement($el);
}

var socket = io();
var textcardNumber = 0;
socket.on('response', (data) => {    
  log(data);
  if(data.event == "getquestioncard"){
    console.log("-----------------");
    if(data.cardIndex == -1 || data.cardIndex == null || data.cardIndex == undefined){
      return;
    }
    $('#list_questioncard').append("<a href=\"#!\" class=\"item questioncard\" "+
        "onclick=\"chooseQuestion(this);\" data-cardIndex=\""+data.cardIndex+"\" >"+data.msg+"</a>")
  }

  if(data.event == "gettextcard"){
    console.log("-----------------");
    if(data.cardIndex == -1 || data.cardIndex == null || data.cardIndex == undefined){
      return;
    }
    $('#list_textcard').append("<a href=\"#!\" class=\"item\ textcard\" "+
        "onclick=\"\" data-cardIndex=\""+data.cardIndex+"\" >"+data.msg+"</a>");
    textcardNumber += 1;
  }

  if(data.event == "showtextcard"){
    console.log("-----------------");
    if(data.textcards == undefined){
      return;
    }
    $('#list_showtextcard').append("<a href=\"#!\" class=\"item\ showtextcard\" "+
        "onclick=\"chooseLoser(this)\" data-playerid=\""+data.textcards.playerid+"\" >"+data.textcards+"</a>");
  }
});

function chooseQuestion(obj){
  console.log($(obj));
  let cardIndex = $(obj).attr("data-cardIndex");
  let r = $("#playerid").html();
  $(".questioncard").hide();
  $(obj).show();
  socket.emit('client_message', {
    event: "choosequestioncard",
    hashTag:"testhashtag",
    msg:{
      playerid:r,
      cardIndex:cardIndex
    }
  }); 
}

function chooseTextcard(){
  let r = $("#playerid").html();
  $(".textcard").hide();
  socket.emit('client_message', {
    event: "choosetextcard",
    hashTag:"testhashtag",
    msg:{
      playerid:r,
      cardWeights:2,        
      cards:[
        {
          order:1,
          cardIndex:1,
          cardContext:"test1"
        },
        {
          order:2,
          cardIndex:2,
          cardContext:"test2"
        }
      ]
    }
  }); 
}

function chooseLoser(obj){
  let r = $("#playerid").html();
  let playerid = $(obj).attr("data-playerid");
  $(".showtextcard").hide();
  socket.emit('client_message', {
    event: "chooseloser",
    hashTag:"testhashtag",
    msg:{
      playerid:r,
      loser: playerid
    }
  }); 
}

socket.on('connect', (data) => {
  console.log("-----------------");
  log("connection~~");
});

$(document).ready(function(){
  let r = Math.random().toString(36).substring(7);



  $("#playerid").html(r);
  $("#btn_createroom").click(function(){
    $.ajax({
      type: "POST",
      url: "/createroom",
      contentType: 'application/json',
      data:JSON.stringify({
        event: "join",
        hashTag: "testhashtag",
        msg:{
          playerid: r
        }
      }),
      success: function(data){
        alert("Data: " + data);   
        socket.emit('client_message', {event: "setsocket",hashTag:"testhashtag",msg:{playerid:r}});       
      }
    });
    


  });

  $("#btn_joinroom").click(function(){
    $.ajax({
      type: "POST",
      url: "/joinroom",
      contentType: 'application/json',
      data:JSON.stringify({
        event: "join",
        hashTag: "testhashtag",
        msg:{
          playerid: r
        }
      }),
      success: function(data){
        alert("Data: " + data); 
        socket.emit('client_message', {event: "setsocket",hashTag:"testhashtag",msg:{playerid:r}});       
      }
    });
  });

  $("#btn_getquestioncard").click(function(){
    socket.emit('client_message', {event: "getquestioncard",hashTag:"testhashtag",msg:{playerid:r}});

  });

  $("#btn_showtextcard").click(function(){
    socket.emit('client_message', {event: "showtextcard",hashTag:"testhashtag",msg:{playerid:r}});

  });

  $("#btn_ready").click(function(){
    socket.emit('client_message', {event: "ready",hashTag:"testhashtag",msg:{playerid:r,textcardNumber:textcardNumber}});

  });

  $("#btn_choosetextcard").click(function(){
    chooseTextcard();
  });

});