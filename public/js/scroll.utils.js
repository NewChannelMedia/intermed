
jQuery(function( $ ){
	/**
	 * Demo binding and preparation, no need to read this part
	 */
		//borrowed from jQuery easing plugin
		//http://gsgd.co.uk/sandbox/jquery.easing.php
		$.easing.elasout = function(x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		};
		$('a.back').click(function() {
			$(this).parents('div.pane').scrollTo(0, 800, { queue:true });
			$(this).parents('div.section').find('span.message').text( this.title);
			return false;
		});
		//just for the example, to stop the click on the links.
		$('ul.links').click(function(e){
			var link = e.target;
			if (link.target === '_blank') {
				return;
			}
			e.preventDefault();
			link.blur();
			if (link.title) {
				$(this).parent().find('span.message').text(link.title);
			}
		});

	// This one is important, many browsers don't reset scroll on refreshes
	// Reset all scrollable panes to (0,0)
	$('div.pane').scrollTo(0);
	// Reset the screen to (0,0)
	$.scrollTo(0);

	// TOC, shows how to scroll the whole window
	$('#toc a').click(function() {//$.scrollTo works EXACTLY the same way, but scrolls the whole screen
		$.scrollTo(this.hash, 1500, { easing:'elasout' });
		$(this.hash).find('span.message').text(this.title);
		return false;
	});

	// Target examples bindings
	var $target = $('#pane-target');
	$('#target-examples a').click(function() {
		$target.stop(true);
	});

	$('#relative-selector').click(function() {
		$target.scrollTo('li:eq(7)', 800);
	});
	$('#jquery-object').click(function() {
		$target.scrollTo($('#pane-target li:eq(14)') , 800);
	});
	$('#dom-element').click(function() {
		$target.scrollTo(document.getElementById('twenty'), 800);
	});
	$('#absolute-number').click(function() {
		$target.scrollTo(150, 800);
	});
	$('#absolute-number-hash').click(function() {
		$target.scrollTo({ top:800, left:700}, 800);
	});
	$('#absolute-px').click(function() {
		$target.scrollTo('520px', 800);
	});
	$('#absolute-px-hash').click(function() {
		$target.scrollTo({top:'110px', left:'290px'}, 800);
	});
	$('#relative-px').click(function() {
		$target.scrollTo('+=100', 500);
	});
	$('#relative-px-hash').click(function() {
		$target.scrollTo({top:'-=100px', left:'+=100'}, 500);
	});
	$('#percentage-px').click(function() {
		$target.scrollTo('50%', 800);
	});
	$('#percentage-px-hash').click(function() {
		$target.scrollTo({top:'50%', left:'20%'}, 800);
	});

	// Settings examples bindings, they will all scroll to the same place, with different settings
	var $settings = $('#pane-settings');
	$('#settings-examples a').click(function() {
		// before each animation, reset to (0,0), skip this.
		$settings.stop(true).scrollTo(0);
	});

	$('#settings-no').click(function() {
		$settings.scrollTo('li:eq(15)', 1000);
	});
	$('#settings-axis').click(function() {// only scroll horizontally
		$settings.scrollTo('li:eq(15)', 1000, { axis:'x' });
	});
	$('#settings-duration').click(function() {// it's the same as specifying it in the 2nd argument
		$settings.scrollTo('li:eq(15)', { duration: 3000 });
	});
	$('#settings-easing').click(function() {
		$settings.scrollTo('li:eq(15)', 2500, { easing:'elasout' });
	});
	$('#settings-margin').click(function() {//scroll to the "outer" position of the element
		$settings.scrollTo('li:eq(15)', 1000, { margin:true });
	});
	$('#settings-offset').click(function() {//same as { top:-50, left:-50 }
		$settings.scrollTo('li:eq(15)', 1000, { offset:-50 });
	});
	$('#settings-offset-hash').click(function() {
		$settings.scrollTo('li:eq(15)', 1000, { offset:{ top:-5, left:-30 } });
	});
	$('#settings-offset-function').click(function() {
		$settings.scrollTo('li:eq(15)', 1000, {offset: function() { return {top:-30, left:-5}; }});
	});
	$('#settings-over').click(function() {//same as { top:-50, left:-50 }
		$settings.scrollTo('li:eq(15)', 1000, { over:0.5 });
	});
	$('#settings-over-hash').click(function() {
		$settings.scrollTo('li:eq(15)', 1000, { over:{ top:0.2, left:-0.5 } });
	});
	$('#settings-interrupt').click(function() {
		$settings.scrollTo('li:eq(15)', 10000, { interrupt:true });
	});
	$('#settings-queue').click(function() {//in this case, having 'axis' as 'xy' or 'yx' matters.
		$settings.scrollTo('li:eq(15)', 2000, { queue:true });
	});
	$('#settings-onAfter').click(function() {
		$settings.scrollTo('li:eq(15)', 2000, {
			onAfter:function() {
				$('#settings-message').text('Got there!');
			}
		});
	});
	$('#settings-onAfterFirst').click(function() {//onAfterFirst exists only when queuing
		$settings.scrollTo('li:eq(15)', 1600, {
			queue:true,
			onAfterFirst:function() {
				$('#settings-message').text('Got there horizontally!');
			},
			onAfter:function() {
				$('#settings-message').text('Got there vertically!');
			}
		});
	});
	$('#settings-step').click(function() {
		$settings.scrollTo('li:eq(15)', 2000, {step:function(now) {
			$('#settings-message').text(now.toFixed(2));
		}});
	});
	$('#settings-progress').click(function() {
		$settings.scrollTo('li:eq(15)', 2000, {progress:function(_, now) {
			$('#settings-message').text(Math.round(now*100) + '%');
		}});
	});
	$('#settings-fail').click(function() {
		$settings.scrollTo('li:eq(15)', 10000, {interrupt:true, fail:function() {
			$('#settings-message').text('Scroll interrupted!');
		}});
	});
});


function checkTop () {
  var topOffset;
  if( $(window).width() < 767 ){
    topOffset = 60;
  }
  else {
    topOffset = 0;
  }
  return topOffset;
}

function toTop(){
  event.preventDefault();
  $body.scrollTo($('body'), 1000, { offset:{ top:0, left:0 } });
}
function toPerfil(){
  event.preventDefault();
  $body.scrollTo($('#perfil'), 1000, { offset:{ top:0, left:0 } });
}
function toUbicaciones() {
  event.preventDefault();
  $body.scrollTo($('#ubicaciones'), 1000, { offset:{ top:-(60+checkTop()), left:0 } });
}
function toInfo(){
  event.preventDefault();
  $body.scrollTo($('#info'), 1000, { offset:{ top:-(60+checkTop()), left:0 } });
}
function toCV(){
  event.preventDefault();
  $body.scrollTo($('#curriculum'), 1000, { offset:{ top:-(60+checkTop()), left:0 } });
}
function toColegas(){
  event.preventDefault();
  $body.scrollTo($('#colegas'), 1000, { offset:{ top:-(60+checkTop()), left:0 } });
}
function toComentarios(){
  event.preventDefault();
  $body.scrollTo($('#comentarios'), 1000, { offset:{ top:-(60+checkTop()), left:0 } });
}



var $body = $('body');
$('body a').click(function() {
  $body.stop(true);
});

$('#toPerfil').click(function() {
  toPerfil();
});
$('#toUbicaciones').click(function() {
  toUbicaciones();
});
$('#toInfo').click(function() {
  toInfo();
});
$('#toCurriculum').click(function() {
  toCV();
});
$('#toColegas').click(function() {
  toColegas();
});
$('#toComentarios').click(function() {
  toComentarios();
});


$( '#2bg-ubicaciones .float.up' ).click( function(){
  toPerfil();
})
$( '#3bg-info .float.up' ).click( function(){
  toUbicaciones();
})
$( '#5bg-curriculum .float.up' ).click( function(){
  toInfo();
})
$( '#4bg-colegas .float.up' ).click( function(){
  toCV();
})
$( '#6bg-comentarios .float.up' ).click( function(){
  toColegas();
})

$( '#1bg-perfil .float.down' ).click( function(){
  toUbicaciones();
})
$( '#2bg-ubicaciones .float.down' ).click( function(){
  toInfo();
})
$( '#3bg-info .float.down' ).click( function(){
  toCV();
})
$( '#5bg-curriculum .float.down' ).click( function(){
  toColegas();
})
$( '#4bg-colegas .float.down' ).click( function(){
  toComentarios();
})


  $( window ).scroll( function() {
    hidenavbuttons();
  });

  /*
  <nav id="navSections" class="center-block text-center bg-darkBlue hidden-lg hidden-md hidden-sm">
    <div id="1bg-perfil" class="">
      <a href="#" class="btn float up invisible">
        <span class="glyphicon glyphicon-arrow-up"></span>
      </a>
      <a href="#ubicaciones" class="btn float down">
        <span class="glyphicon glyphicon-arrow-down"></span>
      </a>
    </div>
    <div id="2bg-ubicaciones" class="hidden">
      <a href="#perfil" class="btn float up">
        <span class="glyphicon glyphicon-arrow-up"></span>
      </a>
      <a href="#info" class="btn float down">
        <span class="glyphicon glyphicon-arrow-down"></span>
      </a>
    </div>
    <div id="3bg-info" class="hidden">
      <a href="#ubicaciones" class="btn float up">
        <span class="glyphicon glyphicon-arrow-up"></span>
      </a>
      <a href="#colegas" class="btn float down">
        <span class="glyphicon glyphicon-arrow-down"></span>
      </a>
    </div>
    <div id="4bg-colegas" class="hidden">
      <a href="#info" class="btn float up">
        <span class="glyphicon glyphicon-arrow-up"></span>
      </a>
      <a href="#curriculum" class="btn float down">
        <span class="glyphicon glyphicon-arrow-down"></span>
      </a>
    </div>

    <div id="5bg-curriculum" class="hidden">
      <a href="#colegas" class="btn float up">no
        <span class="glyphicon glyphicon-arrow-up"></span>
      </a>
      <a href="#comentarios" class="btn float down">
        <span class="glyphicon glyphicon-arrow-down"></span>
      </a>
    </div>

    <div id="6bg-comentarios" class="hidden">
      <a href="#curriculum" class="btn float up">no
        <span class="glyphicon glyphicon-arrow-up"></span>
      </a>
      <a href="#" class="btn float down text-center" onclick="toTop();">TOP</span>
      </a>
    </div>

  </nav>
  */

  function hidenavbuttons() {
    var h = $( window ).height(),
      halfHeight = Math.round(h / 2),
      scrollTop = $( window ).scrollTop(),

      pOffset = $( '#perfil' ).offset().top,
      pX = pOffset - scrollTop,

      uOffset = $( '#ubicaciones' ).offset().top,
      uX = uOffset - scrollTop,

      iOffset = $( '#info' ).offset().top,
      iX = iOffset - scrollTop,

      cOffset = $( '#curriculum' ).offset().top,
      cX = cOffset - scrollTop,

      cvOffset = $( '#colegas' ).offset().top,
      cvX = cvOffset - scrollTop,

      coOffset = $( '#comentarios' ).offset().top,
      coX = coOffset - scrollTop;

    if ( pX >= 0 ) {
      $('#1bg-perfil' ).removeClass( 'hidden' );
      $('#2bg-ubicaciones' ).addClass( 'hidden' );
      $('#3bg-info' ).addClass( 'hidden' );
      $('#4bg-colegas' ).addClass( 'hidden' );
      $('#5bg-curriculum' ).addClass( 'hidden' );
      $('#6bg-comentarios' ).addClass( 'hidden' );
    }
    else if( uX <= halfHeight && uX >= 0 ) {
      $( '#1bg-perfil' ).addClass( 'hidden' );
      $( '#2bg-ubicaciones' ).removeClass( 'hidden' );
      $( '#3bg-info' ).addClass( 'hidden' );
      $( '#4bg-colegas' ).addClass( 'hidden' );
      $( '#5bg-curriculum' ).addClass( 'hidden' );
      $( '#6bg-comentarios' ).addClass( 'hidden' );
    }
    else if( iX <= halfHeight && iX >= 0 ) {
      $( '#1bg-perfil').addClass( 'hidden' );
      $( '#2bg-ubicaciones').addClass( 'hidden' );
      $( '#3bg-info').removeClass( 'hidden' );
      $( '#4bg-colegas').addClass( 'hidden' );
      $( '#5bg-curriculum').addClass( 'hidden' );
      $( '#6bg-comentarios').addClass( 'hidden' );
    }
    else if( cX <= halfHeight && cX >= 0 ) {
      $( '#1bg-perfil' ).addClass( 'hidden' );
      $( '#2bg-ubicaciones' ).addClass( 'hidden' );
      $( '#3bg-info' ).addClass( 'hidden' );
      $( '#4bg-colegas' ).addClass( 'hidden' );
      $( '#5bg-curriculum' ).removeClass( 'hidden' );
      $( '#6bg-comentarios' ).addClass( 'hidden' );
    }
    else if( cvX <= halfHeight && cvX >= 0 ) {
      $( '#1bg-perfil' ).addClass( 'hidden' );
      $( '#2bg-ubicaciones' ).addClass( 'hidden' );
      $( '#3bg-info' ).addClass( 'hidden' );
      $( '#4bg-colegas' ).removeClass( 'hidden' );
      $( '#5bg-curriculum' ).addClass( 'hidden' );
      $( '#6bg-comentarios' ).addClass( 'hidden' );
    }
    else if( coX <= halfHeight && coX >= 0 ) {
      $( '#1bg-perfil' ).addClass( 'hidden' );
      $( '#2bg-ubicaciones' ).addClass( 'hidden' );
      $( '#3bg-info' ).addClass( 'hidden' );
      $( '#4bg-colegas' ).addClass( 'hidden' );
      $( '#5bg-curriculum' ).addClass( 'hidden' );
      $( '#6bg-comentarios' ).removeClass( 'hidden' );
    }
  }









// Easing equation, borrowed from jQuery easing plugin
// http://gsgd.co.uk/sandbox/jquery/easing/
jQuery.easing.easeOutQuart = function (x, t, b, c, d) {
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
};

jQuery(function( $ ){
	/**
	 * Most jQuery.serialScroll's settings, actually belong to jQuery.ScrollTo, check it's demo for an example of each option.
	 * @see http://flesler.demos.com/jquery/scrollTo/
	 * You can use EVERY single setting of jQuery.ScrollTo, in the settings hash you send to jQuery.serialScroll.
	 */

	/**
	 * The plugin binds 6 events to the container to allow external manipulation.
	 * prev, next, goto, start, stop and notify
	 * You use them like this: $(your_container).trigger('next'), $(your_container).trigger('goto', [5]) (0-based index).
	 * If for some odd reason, the element already has any of these events bound, trigger it with the namespace.
	 */

	/**
	 * IMPORTANT: this call to the plugin specifies ALL the settings (plus some of jQuery.ScrollTo)
	 * This is done so you can see them. You DON'T need to specify the commented ones.
	 * A 'target' is specified, that means that #screen is the context for target, prev, next and navigation.
	 */
	$('#screen').serialScroll({
		target:'#sections',
		items:'section', // Selector to the items ( relative to the matched elements, '#sections' in this case )
		prev:'.prev',// Selector to the 'prev' button (absolute!, meaning it's relative to the document)
		next:'.next',// Selector to the 'next' button (absolute too)
		axis:'xy',// The default is 'y' scroll on both ways
		/*navigation:'#navigation li a',*/
		duration:700,// Length of the animation (if you scroll 2 axes and use queue, then each axis take half this time)
		force:true, // Force a scroll to the element specified by 'start' (some browsers don't reset on refreshes)

		//queue:false,// We scroll on both axes, scroll both at the same time.
		//event:'click',// On which event to react (click is the default, you probably won't need to specify it)
		//stop:false,// Each click will stop any previous animations of the target. (false by default)
		//lock:true, // Ignore events if already animating (true by default)
		//start: 0, // On which element (index) to begin ( 0 is the default, redundant in this case )
		//cycle:true,// Cycle endlessly ( constant velocity, true is the default )
		//step:1, // How many items to scroll each time ( 1 is the default, no need to specify )
		//jump:false, // If true, items become clickable (or w/e 'event' is, and when activated, the pane scrolls to them)
		//lazy:false,// (default) if true, the plugin looks for the items on each event(allows AJAX or JS content, or reordering)
		//interval:1000, // It's the number of milliseconds to automatically go to the next
		//constant:true, // constant speed

		onBefore:function( e, elem, $pane, $items, pos ){
			/**
			 * 'this' is the triggered element
			 * e is the event object
			 * elem is the element we'll be scrolling to
			 * $pane is the element being scrolled
			 * $items is the items collection at this moment
			 * pos is the position of elem in the collection
			 * if it returns false, the event will be ignored
			 */
			 //those arguments with a $ are jqueryfied, elem isn't.
			e.preventDefault();
			if( this.blur )
				this.blur();
		},
		onAfter:function( elem ){
			//'this' is the element being scrolled ($pane) not jqueryfied
		}
	});

	/**
	 * No need to have only one element in view, you can use it for slideshows or similar.
	 * In this case, clicking the images, scrolls to them.
	 * No target in this case, so the selectors are absolute.
	 */

	$('#slideshow').serialScroll({
		items:'li',
		prev:'#screen2 a.prev',
		next:'#screen2 a.next',
		offset:-230, //when scrolling to photo, stop 230 before reaching it (from the left)
		start:1, //as we are centering it, start at the 2nd
		duration:1200,
		force:true,
		stop:true,
		lock:false,
		cycle:false, //don't pull back once you reach the end
		easing:'easeOutQuart', //use this easing equation for a funny effect
		jump: true //click on the images to scroll to them
	});

	/**
	 * The call below, is just to show that you are not restricted to prev/next buttons
	 * In this case, the plugin will react to a custom event on the container
	 * You can trigger the event from the outside.
	 */

	var $news = $('#news-ticker');//we'll re use it a lot, so better save it to a var.
	$news.serialScroll({
		items:'div',
		duration:2000,
		force:true,
		axis:'y',
		easing:'linear',
		lazy:true,// NOTE: it's set to true, meaning you can add/remove/reorder items and the changes are taken into account.
		interval:1, // yeah! I now added auto-scrolling
		step:2 // scroll 2 news each time
	});

	/**
	 * The following you don't need to see, is just for the "Add 2 Items" and "Shuffle"" buttons
	 * These exemplify the use of the option 'lazy'.
	 */
	$('#add-news').click(function(){
		var
			$items = $news.find('div'),
			num = $items.length + 1;

		$items.slice(-2).clone().find('h4').each(function(i){
			$(this).text( 'News ' + (num + i) );
		}).end().appendTo($news);
	});
	$('#shuffle-news').click(function(){//don't shuffle the first, don't wanna deal with css
		var shuffled = $news.find('div').get().slice(1).sort(function(){
			return Math.round(Math.random())-0.5;//just a random number between -0.5 and 0.5
		});
		$(shuffled).appendTo($news);//add them all reordered
	});
});
