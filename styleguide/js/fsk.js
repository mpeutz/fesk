(function() {
  var fskStateGenerator;

  fskStateGenerator = (function() {

    function fskStateGenerator() {
      var idx, idxs, pseudos, replaceRule, rule,  _i, _len, _len2, _ref, _ref2;
      pseudos = /(\:hover|\:disabled|\:active|\:visited|\:focus)/g;

      for( var i in document.styleSheets ){
          if( document.styleSheets[i].href && document.styleSheets[i].href.indexOf("styles.css") ) {
              _ref = document.styleSheets[i];
              console.log(_ref);
              break;
          }
      }



          idxs = [];
          _ref2 = _ref.cssRules || [];
          for (idx = 0, _len2 = _ref2.length; idx < _len2; idx++) {
            rule = _ref2[idx];
            if ((rule.type === CSSRule.STYLE_RULE) && pseudos.test(rule.selectorText)) {
              replaceRule = function(matched, stuff) {
                return ".pseudo-class-" + matched.replace(':', '');
              };
              this.insertRule(rule.cssText.replace(pseudos, replaceRule));
            }
          }

    }

    fskStateGenerator.prototype.insertRule = function(rule) {
      var headEl, styleEl;
      headEl = document.getElementById('userStyles.html');
      styleEl = document.createElement('style');
      styleEl.type = 'text/css';
      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = rule;
      } else {
        styleEl.appendChild(document.createTextNode(rule));
      }
      return headEl.appendChild(styleEl);
    };

    return fskStateGenerator;

  })();

 window.onload = function(){
  new fskStateGenerator();
};

}).call(this);
