(function(a){a.slidebars=function(s){function x(){!h.disableOver||"number"===typeof h.disableOver&&h.disableOver>=t?(q=!0,a("html").addClass("sb-init"),h.hideControlClasses&&y.removeClass("sb-hide"),z()):"number"===typeof h.disableOver&&h.disableOver<t&&(q=!1,a("html").removeClass("sb-init"),h.hideControlClasses&&y.addClass("sb-hide"),m.css("minHeight",""),(f||g)&&k())}function z(){m.css("minHeight","");m.css("minHeight",a("html").height()+"px");c&&c.hasClass("sb-width-custom")&&c.css("width",c.attr("data-sb-width"));b&&b.hasClass("sb-width-custom")&&b.css("width",b.attr("data-sb-width"));c&&(c.hasClass("sb-style-push")||c.hasClass("sb-style-overlay"))&&c.css("marginLeft","-"+c.css("width"));b&&(b.hasClass("sb-style-push")||b.hasClass("sb-style-overlay"))&&b.css("marginRight","-"+b.css("width"));h.scrollLock&&a("html").addClass("sb-scroll-lock")}function u(d,a,c){var b;b=d.hasClass("sb-style-push")?m.add(d).add(A):d.hasClass("sb-style-overlay")?d:m.add(A);"translate"===n?b.css("transform","translate("+a+")"):"side"===n?("-"===a[0]&&(a=a.substr(1)),"0px"!==a&&b.css(c,"0px"),setTimeout(function(){b.css(c,a)},1)):"jQuery"===n&&("-"===a[0]&&(a=a.substr(1)),d={},d[c]=a,b.stop().animate(d,400));setTimeout(function(){"0px"===a&&(b.removeAttr("style"),z())},400)}function l(d){function e(){q&&"left"===d&&c?(a("html").addClass("sb-active sb-active-left"),c.addClass("sb-active"),u(c,c.css("width"),"left"),setTimeout(function(){f=!0},400)):q&&"right"===d&&b&&(a("html").addClass("sb-active sb-active-right"),b.addClass("sb-active"),u(b,"-"+b.css("width"),"right"),setTimeout(function(){g=!0},400))}"left"===d&&c&&g||"right"===d&&b&&f?(k(),setTimeout(e,400)):e()}function k(d){if(f||g)f&&(u(c,"0px","left"),f=!1),g&&(u(b,"0px","right"),g=!1),setTimeout(function(){a("html").removeClass("sb-active sb-active-left sb-active-right");c&&c.removeClass("sb-active");b&&b.removeClass("sb-active");"undefined"!==typeof d&&(window.location=d)},400)}function v(a){"left"===a&&c&&(f?k():l("left"));"right"===a&&b&&(g?k():l("right"))}function p(a,b){a.stopPropagation();a.preventDefault();"touchend"===a.type&&b.off("click")}var h=a.extend({siteClose:!0,scrollLock:!1,disableOver:!1,hideControlClasses:!1},s),e=document.createElement("div").style,B=s=!1;if(""===e.MozTransition||""===e.WebkitTransition||""===e.OTransition||""===e.transition)s=!0;if(""===e.MozTransform||""===e.WebkitTransform||""===e.OTransform||""===e.transform)B=!0;var e=navigator.userAgent,r=!1,w=!1;/Android/.test(e)?r=e.substr(e.indexOf("Android")+8,3):/(iPhone|iPod|iPad)/.test(e)&&(w=e.substr(e.indexOf("OS ")+3,3).replace("_","."));(r&&3>r||w&&5>w)&&a("html").addClass("sb-static");var m=a("#sb-site, .sb-site-container");if(a(".sb-left").length)var c=a(".sb-left"),f=!1;if(a(".sb-right").length)var b=a(".sb-right"),g=!1;var q=!1,t=a(window).width(),y=a(".sb-toggle-left, .sb-toggle-right, .sb-open-left, .sb-open-right, .sb-close"),A=a(".sb-slide");x();a(window).resize(function(){var d=a(window).width();t!==d&&(t=d,x(),f&&l("left"),g&&l("right"))});var n;s&&B?(n="translate",r&&4.4>r&&(n="side")):n="jQuery";this.slidebars={open:l,close:k,toggle:v,init:function(){return q},active:function(a){if("left"===a&&c)return f;if("right"===a&&b)return g},destroy:function(a){"left"===a&&c&&(f&&k(),setTimeout(function(){c.remove();c=!1},400));"right"===a&&b&&(g&&k(),setTimeout(function(){b.remove();b=!1},400))}};a(".sb-toggle-left").on("touchend click",function(b){p(b,a(this));v("left")});a(".sb-toggle-right").on("touchend click",function(b){p(b,a(this));v("right")});a(".sb-open-left").on("touchend click",function(b){p(b,a(this));l("left")});a(".sb-open-right").on("touchend click",function(b){p(b,a(this));l("right")});a(".sb-close").on("touchend click",function(b){p(b,a(this));var c;a(this).parents(".sb-slidebar")&&(a(this).is("a")?c=a(this).attr("href"):a(this).children("a")&&(c=a(this).children("a").attr("href")));k(c)});m.on("touchend click",function(b){h.siteClose&&(f||g)&&(p(b,a(this)),k())})}})(jQuery);