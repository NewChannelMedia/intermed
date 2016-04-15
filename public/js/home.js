/* newHome */
$(document).ready(function(){
  if ($('#newHome').length > 0){
    $('#newHome #newHomeHeader .container').height(
      $(window).height()
    );
    /*$('#homeMainTitle').css({'margin-top':$(window).height()})*/

    $('#gotocode').click(function(){
      $('body').scrollTo($('#codigo'), 1000);
    });
    $('#bounce').click(function(){
      $('body').scrollTo($('#homeMainTitle'), 1000);
    })
  }

  var bouncetime = 1100;
  var jumpSize = 35;

  $('#bounce').css({'bottom':jumpSize});
  bounce();

  function bounce() {
    $('#bounce').animate({'bottom':20}, bouncetime, 'easeInQuad', function() {
      $('#bounce').animate({'bottom':jumpSize}, bouncetime, 'easeOutQuad', function() {
        bounce();
      });
    });
  }
});

$(window).on('resize', function() {
  if ($('#newHome').length > 0){
    $('#newHome #newHomeHeader .container').height(
      $(window).height()
    );
  }
});
