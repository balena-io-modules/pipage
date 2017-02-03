const Pipeline = require('..');
const assert = require('assert');
const crypto = require('crypto');
const Stream = require('stream');

describe('Edge cases', function() {

  // `crypto.Hash` streams will only become
  // readable once `.end()` has been called on them
  it('can handle crypto.Hash streams', function(done) {

    const streams = [ crypto.createHash('sha1') ];
    const pipeline = new Pipeline(streams);

    pipeline
      .once('error', done)
      .once('finish', done)
      .once('readable', function() {
        const hash = this.read();
        assert.equal(hash.toString('hex'), '37a309ae59ad3a562a083eb90e32fa6757bdd41f');
      });

    pipeline.end('Let it work!');

  });

});
