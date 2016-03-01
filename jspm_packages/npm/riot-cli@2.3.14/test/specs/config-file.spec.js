/* */ 
require('shelljs/global');
const EXPECTED_FOLDER = 'test/expected',
    GENERATED_FOLDER = 'test/generated',
    trim = function(string) {
      return string.replace(/^\s+|\s+$/gm, '');
    },
    cli = require('../../lib/index');
describe('External config file', function() {
  it('generate the tags using custom parsers in the config file', function(done) {
    cli._cli(['--config', 'test/fixtures/config-parsers']);
    setImmediate(function() {
      expect(test('-e', `${GENERATED_FOLDER}/config-file/parsers.js`)).to.be(true);
      expect(trim(cat(`${GENERATED_FOLDER}/config-file/parsers.js`))).to.be(trim(cat(`${EXPECTED_FOLDER}/config-file/parsers.js`)));
      done();
    });
  });
  it('generate the tags using custom jade parser', function(done) {
    cli._cli(['--config', 'test/fixtures/config-parsers-jade']);
    setImmediate(function() {
      expect(test('-e', `${GENERATED_FOLDER}/config-file/parsers-jade.js`)).to.be(true);
      expect(trim(cat(`${GENERATED_FOLDER}/config-file/parsers-jade.js`))).to.be(trim(cat(`${EXPECTED_FOLDER}/config-file/parsers-jade.js`)));
      done();
    });
  });
  after(function() {
    rm(`${GENERATED_FOLDER}/config-file/*`);
  });
});
