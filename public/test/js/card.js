$( ".card" ).hover( 
  function() {
    console.log(this);
    $(".end").removeClass("showcard");
    $(this).addClass("showcard cardup");    
  },
  function() {
    $(this).removeClass("showcard cardup");
    $(".end").addClass("showcard");
  }
);