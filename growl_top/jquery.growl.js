/*
 * jQuery Growl plugin
 * Version 1.0.0-b1 (04/18/2008)
 * @requires jQuery v1.2.3 or later
 *
 * Examples at: http://fragmentedcode.com/jquery-growl
 * Copyright (c) 2008 David Higgins
 * 
 * Special thanks to Daniel Mota for inspiration:
 * http://icebeat.bitacoras.com/mootools/growl/

USAGE:
	$.growl(title, msg, {options});
	$.growl(title, msg, {options});
	$.growl(title, msg, image, {options});
	$.growl(title, msg, image, priority, {options});

THEME/SKIN:
You can override the default look and feel by updating these objects:
$.growl.settings.displayTimeout = 4000;
$.growl.settings.noticeTemplate = ''
  + '<div>'
  + '<div style="float: right; background-image: url(my.growlTheme/normalTop.png); position: relative; width: 259px; height: 16px; margin: 0pt;"></div>'
  + '<div style="float: right; background-image: url(my.growlTheme/normalBackground.png); position: relative; display: block; color: #ffffff; font-family: Arial; font-size: 12px; line-height: 14px; width: 259px; margin: 0pt;">' 
  + '  <img style="margin: 14px; margin-top: 0px; float: left;" src="%image%" />'
  + '  <h3 style="margin: 0pt; margin-left: 77px; padding-bottom: 10px; font-size: 13px;">%title%</h3>'
  + '  <p style="margin: 0pt 14px; margin-left: 77px; font-size: 12px;">%message%</p>'
  + '</div>'
  + '<div style="float: right; background-image: url(my.growlTheme/normalBottom.png); position: relative; width: 259px; height: 16px; margin-bottom: 10px;"></div>'
  + '</div>';
$.growl.settings.noticeCss = {
  position: 'relative'
};

To change the 'dock' look, and position: 

$.growl.settings.dockTemplate = '<div></div>';
$.growl.settings.dockCss = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '300px'
  };
  
The dockCss will allow you to 'dock' the notifications to a specific area
on the page, such as TopRight (the default) or TopLeft, perhaps even in a
smaller area with "overflow: scroll" enabled?
*/

(function($) {
if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery)) {
    alert('jQuery Growl requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
    // return;
}

$.growl = notify;
$.growl.version = "1.0.0-b1";

function create(rebuild) {
	var instance = document.getElementById('growlDock');
	if(!instance || rebuild) {
	  instance = $(options.dockTemplate).attr('id', 'growlDock').addClass('growl');
	  
	  if(options.defaultStylesheet) {
	    $('head').append('<link rel="stylesheet" type="text/css" href="' + options.defaultStylesheet + '" />');
	  }
	  
	} else {
	  instance = $(instance);
	}
	instance.css(options.dockCss);
	
	$('body').append(instance);
	
	return instance;
};
  
function r(text, expr, val) {
    while(expr.test(text)) {
      text = text.replace(expr, val);
    }
    return text;
};
  
// notify(title,message,image,priority)
function notify() {	
	var title = arguments[0],
	    message = arguments[1],
	    image = arguments[2],
	    priority = arguments[3],
	    lastArgument = arguments[arguments.length - 1];
	
	if (typeof lastArgument != "string") {
		options = $.extend(false, jQuery.growl.settings, lastArgument);
	} else {
		options = $.growl.settings;
	}	
	var instance = create();	
    var html = options.noticeTemplate;
	
	if(typeof(html) == 'object') {
		// assume jQuery object, or DOM Element
		html = $(html).html();
	}
	
    html = r(html, /%message%/, (message?message:''));
    html = r(html, /%title%/, (title?title:''));
    html = r(html, /%image%/, (image?image:options.defaultImage));
    html = r(html, /%priority%/, (priority?priority:'normal'));
    var notice = $(html);    	
	notice.css( options.noticeCss );    
	
	var close = function(){
		options.noticeRemove(notice, function(){ noticeRemove(notice); });
	};
		
	if (options.closeButton == true)
	{
		$(options.closeButtonTemplate).prependTo(notice).click(close);
	}
	
	instance.append(notice);
	options.noticeDisplay(notice);
	
	if ( typeof options.closeButton == "string" ) {
		$(options.closeButton).click(close);
	}
    
    if (options.hideFlash)
    {
        // hide flash elements
        $("object").hide();
    }
    
    if (options.autoHide) {
		setTimeout(function() {
			options.noticeRemove(notice, function(){ noticeRemove(notice); });
		}, options.displayTimeout);
	}
};	

var noticeRemove = function(notice){
	notice.remove();

	// show flash elements again when there is no notice visible
	if (!$(".notice").length && options.hideFlash)
		$("object").show();
	
	options.onClose();
}

var options = {};
  
// default settings
$.growl.settings = {
  dockTemplate: '<div class="dock"></div>',
  dockCss: {},
  noticeTemplate: 
	'<div class="notice">' +
    ' <h3>%title%</h3>' +
    ' <p>%message%</p>' +
    '</div>',
  closeButtonTemplate:
    '<div id="lbTop">' +
    '<a id="lbCloseLink" href="#" />' +
    '</div>',  
  noticeCss: { top: -200 },
  hideFlash: true,
  effect: "fromTop",
  noticeFadeTimeout: 'slow',
  autoHide: true,
  displayTimeout: 3500,
  defaultImage: 'growl.jpg',
  defaultStylesheet: null,
  closeButton: false,
  noticeElement: function(el) {
  	$.growl.settings.noticeTemplate = $(el);
  },
  noticeDisplay: function(notice){			
    notice.animate({top: 0}, {duration: options.noticeFadeTimeout});
  },
  noticeRemove: function(notice, callback){
    notice.animate({top: -200}, {duration: options.noticeFadeTimeout, complete: callback});
  },
  onClose: function(){}
};
})(jQuery);