/* */ 
(function(process) {
  'use strict';
  var tmpl23 = require('../dist/tmpl').tmpl,
      tmpl22 = require('./v223/tmpl223').tmpl;
  var data = {
    num: 1,
    str: 'string',
    date: new Date(),
    bool: true,
    item: null
  },
      tmplList = [[' { date }', ' ' + data.date], [' { num === 0 ? 0 : num } ', ' ' + data.num + ' '], ['<p>\n{str + num}\n</p>', '<p>\nstring1\n</p>'], [' "{ str.slice(0, 3).replace(/t/, \'T\') }" ', ' "sTr" '], [' "{this.num}" ', ' "1" '], ['{ !bool } ', ' '], ['{} ', ' ']],
      exprList = [['{ date }', data.date], ['{ num === 0 ? 0 : num }', data.num], ['<p>{str + num}</p>', '<p>string1</p>'], ['{ "-" + str.slice(0, 3).replace(/t/, \'T\') + "-" }', '-sTr-'], ['{this.num}', 1], ['{ !bool }', false], ['{}', undefined]],
      csList = [['{ foo: num }', 'foo'], ['{ foo: num, bar: item }', 'foo'], ['{ foo: date.getFullYear() > 2000, bar: str==this.str }', 'foo bar'], ['{ foo: str + num }', 'foo']],
      ex22a,
      ex22b,
      ex22c,
      mem22,
      tt22 = [],
      ex23a,
      ex23b,
      ex23c,
      mem23,
      tt23 = [];
  var LOOP = 50000,
      TMAX = 12,
      CPAD = 12,
      NPAD = 11;
  console.log();
  console.log('Testing %d expressions %d times each.', exprList.length + csList.length, LOOP);
  console.log('tmpl v2.2.4 ...');
  mem22 = [0, 0, 0];
  testExpr(tmpl22, data, tt22, exprList, mem22);
  ex22a = tt22.reduce(numsum);
  testExpr(tmpl22, data, tt22, csList, mem22);
  ex22b = tt22.reduce(numsum);
  testExpr(tmpl22, data, tt22, tmplList, mem22);
  ex22c = tt22.reduce(numsum);
  console.log('tmpl v2.3.0 ...');
  mem23 = [0, 0, 0];
  testExpr(tmpl23, data, tt23, exprList, mem23, 1);
  ex23a = tt23.reduce(numsum);
  testExpr(tmpl23, data, tt23, csList, mem23, 1);
  ex23b = tt23.reduce(numsum);
  testExpr(tmpl23, data, tt23, tmplList, mem23, 1);
  ex23c = tt23.reduce(numsum);
  console.log();
  console.log('%s    tmpl 2.2.4   new v2.3.0', padr('Results', CPAD));
  console.log('%s    ----------   ----------', replicate('-', CPAD));
  console.log('%s:  %s %s', padr('Expressions', CPAD), padl(ex22a, NPAD), padl(ex23a, NPAD));
  console.log('%s:  %s %s', padr('Shorthands', CPAD), padl(ex22b, NPAD), padl(ex23b, NPAD));
  console.log('%s:  %s %s', padr('Templates', CPAD), padl(ex22c, NPAD), padl(ex23c, NPAD));
  console.log('%s:  %s %s', padr('TOTAL', CPAD), padl(ex22a + ex22b + ex22c, NPAD), padl(ex23a + ex23b + ex23c, NPAD));
  console.log();
  console.log('Memory');
  console.log('%s:  %s %s', padr('Heap total', CPAD), padl(mem22[1], NPAD), padl(mem23[1], NPAD));
  console.log('%s:  %s %s', padr('Heap used', CPAD), padl(mem22[2], NPAD), padl(mem23[2], NPAD));
  console.log();
  console.log('NOTES:');
  console.log('- Memory used is the difference during the test of the heapTotal info');
  console.log('  provided by the node process.memoryUsage() function.');
  console.log('- Execution time in both versions excludes expression compilation.');
  console.log('- Minimum & maximum times are removed.');
  function testExpr(tmpl, data, times, list, agc) {
    var ogc,
        gc1,
        gc2,
        gc3;
    times.length = 0;
    global.gc();
    global.gc();
    ogc = process.memoryUsage();
    gc1 = ogc.rss;
    gc2 = ogc.heapTotal;
    gc3 = ogc.heapUsed;
    list.forEach(function(pair, idx) {
      var tt = new Array(TMAX),
          s,
          i,
          j,
          expr = pair[0];
      s = tmpl(expr, data);
      if (s !== pair[1])
        throw new Error('`' + s + '` in #' + idx + ' is not `' + pair[1] + '`');
      for (i = 0; i < tt.length; ++i) {
        tt[i] = Date.now();
        for (j = 0; j < LOOP; ++j) {
          s = tmpl(expr, data);
        }
        tt[i] = Date.now() - tt[i];
      }
      tt.sort(numsort).pop();
      tt.shift();
      times[idx] = tt.reduce(numsum);
    });
    ogc = process.memoryUsage();
    agc[0] += ogc.rss - gc1;
    agc[1] += ogc.heapTotal - gc2;
    agc[2] += ogc.heapUsed - gc3;
  }
  function numsort(a, b) {
    return a - b;
  }
  function numsum(a, b) {
    return a + b;
  }
  function replicate(s, n) {
    return n < 1 ? '' : (new Array(n + 1)).join(s);
  }
  function padr(s, n) {
    s = '' + s;
    return s + replicate(' ', n - s.length);
  }
  function padl(s, n) {
    s = '' + s;
    return replicate(' ', n - s.length) + s;
  }
})(require('process'));
