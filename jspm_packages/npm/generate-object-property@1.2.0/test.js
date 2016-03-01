/* */ 
var tape = require('tape');
var gen = require('./index');
tape('valid', function(t) {
  t.same(gen('a', 'b'), 'a.b');
  t.end();
});
tape('invalid', function(t) {
  t.same(gen('a', '-b'), 'a["-b"]');
  t.end();
});
