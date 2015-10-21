/*!
 * jquery.iscroll - v1.0.0
 * https://github.com/HemantNegi/jquery.iscroll
 * 2015-05-27
 *
 * Copyright 2015 Hemant Negi
 * Email : hemant.frnz@gmail.com
 * Compressor http://refresh-sf.com/
 */

function iscroll($e, options) {

    var _isWindow = ($e.css('overflow-y') === 'visible'),
        $scroll = _isWindow? $(document) : $e,
        stopReqs = false,
        reqUrl = '',
        isLoading = false,
        loader = null,
        ctr= 0,
        O = this;



    O.S = {
        Loadingoffset: 20,
        optionsData: {},
        loadingHtml: '<div style="padding-top:5px" class="loader text-center"><div class="throbber-loader"></div></div>', // null
        sendReqonInit:false,
        autoTrigger: true, //must be true for autoTriggerUntil
        autoTriggerUntil: false,
        next:'a._next',
        onBeginRequest: null,
        ondataArrival: null
    };


    O.RequestItems = function () {
      if (isLoading) return;
      isLoading = true;
      if (!reqUrl) O.setNext();
      loader = $(O.S.loadingHtml);
      $e.append(loader);
      setTimeout(function(){
        if (reqUrl) {if (O.S.onBeginRequest != null) O.S.onBeginRequest();}
        O.setNext();
        isLoading = false;
      },500);
    };

    O.setNext = function(){
        var _n = $e.find(O.S.next);
        reqUrl = _n.attr('href');
       if (!reqUrl){
           $e.find('.loader').remove();
           $e.find(O.S.next).remove();
       }

        if(O.S.autoTrigger) {
            _n.remove();
        }
       else{
            _n.removeAttr('href').on('click',function(){
                O.RequestItems();
                _n.remove();
            });
        }
    };


    O.ConnectScrollLoad = function () {
        $scroll.on('scroll.iscroll', function () {
                var iHeight = _isWindow ? $scroll.height() : $scroll.prop('scrollHeight');
                var tHeight = _isWindow ? $(window).height() : $scroll.height();
                //$('.testing').scrollTop() >= $('.testing').prop('scrollHeight') - $('.testing').height() - O.S.Loadingoffset
                //$(document).scrollTop() >= $(document).height() - $(window).height() - O.S.Loadingoffset
                if ($scroll.scrollTop() >= iHeight - tHeight - O.S.Loadingoffset) {
                    O.RequestItems();
                }
        });
    };

    O.reset = function(){
        $scroll.off('scroll.iscroll');
        O.init();
    }

    /** destroy the current instance  **/
    O.destroy = function(){
        $scroll.off('scroll.iscroll');
        delete $e[0].iscroll;
        return $e;
        //TODO: restore the link
    };


    O.init = function () {
        $.extend(O.S, options);
        if(O.S.autoTrigger)O.ConnectScrollLoad();
        O.setNext();
        if (O.S.sendReqonInit)
            O.RequestItems();
    }
    O.init();

    return O;
}


$.fn.iscroll = function(m) {
    return this.each(function() {
        var $this = $(this);
            if(this.iscroll)return;
        this.iscroll = new iscroll($this, m)
    });
};
