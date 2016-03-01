/* */ 
var path = require('path');
function _none(src) {
  return src;
}
var _mods = {
  none: _none,
  javascript: _none
};
function _modname(name) {
  switch (name) {
    case 'es6':
      return 'babel';
    case 'babel':
      return 'babel-core';
    case 'javascript':
      return 'none';
    case 'coffee':
    case 'coffeescript':
      return 'coffee-script';
    case 'scss':
    case 'sass':
      return 'node-sass';
    case 'typescript':
      return 'typescript-simple';
    default:
      return name;
  }
}
function _try(name, req) {
  function fn(r) {
    try {
      return require(r);
    } catch (_) {}
    return null;
  }
  var p = _mods[name] = fn(req || _modname(name));
  if (!p && name === 'es6') {
    p = _mods[name] = fn('babel-core');
  }
  return p;
}
function _req(name, req) {
  return name in _mods ? _mods[name] : _try(name, req);
}
function extend(target, source) {
  if (source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
  }
  return target;
}
module.exports = {
  html: {jade: function(html, opts, url) {
      opts = extend({
        pretty: true,
        filename: url,
        doctype: 'html'
      }, opts);
      return _req('jade').render(html, opts);
    }},
  css: {
    sass: function(tag, css, opts, url) {
      opts = extend({
        data: css,
        includePaths: [path.dirname(url)],
        indentedSyntax: true,
        omitSourceMapUrl: true,
        outputStyle: 'compact'
      }, opts);
      return _req('sass').renderSync(opts).css + '';
    },
    scss: function(tag, css, opts, url) {
      opts = extend({
        data: css,
        includePaths: [path.dirname(url)],
        indentedSyntax: false,
        omitSourceMapUrl: true,
        outputStyle: 'compact'
      }, opts);
      return _req('scss').renderSync(opts).css + '';
    },
    less: function(tag, css, opts, url) {
      var ret;
      opts = extend({
        sync: true,
        syncImport: true,
        filename: url
      }, opts);
      _req('less').render(css, opts, function(err, result) {
        if (err)
          throw err;
        ret = result.css;
      });
      return ret;
    },
    stylus: function(tag, css, opts, url) {
      var stylus = _req('stylus'),
          nib = _req('nib');
      opts = extend({filename: url}, opts);
      return nib ? stylus(css, opts).use(nib()).import('nib').render() : stylus.render(css, opts);
    }
  },
  js: {
    es6: function(js, opts) {
      opts = extend({
        blacklist: ['useStrict', 'strict', 'react'],
        sourceMaps: false,
        comments: false
      }, opts);
      return _req('es6').transform(js, opts).code;
    },
    babel: function(js, opts, url) {
      return _req('babel').transform(js, extend({filename: url}, opts)).code;
    },
    coffee: function(js, opts) {
      return _req('coffee').compile(js, extend({bare: true}, opts));
    },
    livescript: function(js, opts) {
      return _req('livescript').compile(js, extend({
        bare: true,
        header: false
      }, opts));
    },
    typescript: function(js, opts) {
      return _req('typescript')(js, opts);
    },
    none: _none,
    javascript: _none
  },
  _modname: _modname,
  _req: _req
};
exports = module.exports;
exports.js.coffeescript = exports.js.coffee;
