/* */ 
module.exports = ProxyReader;
var Reader = require('./reader');
var getType = require('./get-type');
var inherits = require('inherits');
var fs = require('graceful-fs');
inherits(ProxyReader, Reader);
function ProxyReader(props) {
  var self = this;
  if (!(self instanceof ProxyReader)) {
    throw new Error('ProxyReader must be called as constructor.');
  }
  self.props = props;
  self._buffer = [];
  self.ready = false;
  Reader.call(self, props);
}
ProxyReader.prototype._stat = function() {
  var self = this;
  var props = self.props;
  var stat = props.follow ? 'stat' : 'lstat';
  fs[stat](props.path, function(er, current) {
    var type;
    if (er || !current) {
      type = 'File';
    } else {
      type = getType(current);
    }
    props[type] = true;
    props.type = self.type = type;
    self._old = current;
    self._addProxy(Reader(props, current));
  });
};
ProxyReader.prototype._addProxy = function(proxy) {
  var self = this;
  if (self._proxyTarget) {
    return self.error('proxy already set');
  }
  self._proxyTarget = proxy;
  proxy._proxy = self;
  ;
  ['error', 'data', 'end', 'close', 'linkpath', 'entry', 'entryEnd', 'child', 'childEnd', 'warn', 'stat'].forEach(function(ev) {
    proxy.on(ev, self.emit.bind(self, ev));
  });
  self.emit('proxy', proxy);
  proxy.on('ready', function() {
    self.ready = true;
    self.emit('ready');
  });
  var calls = self._buffer;
  self._buffer.length = 0;
  calls.forEach(function(c) {
    proxy[c[0]].apply(proxy, c[1]);
  });
};
ProxyReader.prototype.pause = function() {
  return this._proxyTarget ? this._proxyTarget.pause() : false;
};
ProxyReader.prototype.resume = function() {
  return this._proxyTarget ? this._proxyTarget.resume() : false;
};
