
// Hack around existing jQuery
if (typeof window.jQuery != 'undefined') {
  window._jQuery = window.jQuery;
  window._$ = window.$;
}
(function() {
  if (console) {
    console.log('HI');
    
  }
})();

define("app", function(){});


// Hack back in the original jQuery
if (typeof window._jQuery != 'undefined') {
  window.jQuery = window._jQuery;
  window.$ = window._$;
}
