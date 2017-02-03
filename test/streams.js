const Pipeline = require('..');
const assert = require('assert');
const Stream = require('stream');

describe('Pipeline', function() {

  it('can handle no streams', function(done) {

    const pipeline = new Pipeline();
    const chunks = [];

    pipeline
      .once('error', done)
      .once('readable', function() {
        while (data = this.read()) {
          chunks.push(data);
        }
      })
      .once('finish', function() {
        assert.equal(chunks.join(''), 'DEADBEEF');
        done();
      });

    assert.equal(pipeline.length, 0);

    pipeline.write('DEAD');
    pipeline.write('BEEF');
    pipeline.end();

  });

  it('can handle a single stream', function(done) {

    const streams = [
      new Stream.Transform({
        transform: function(chunk, _, next) {
          next(null, chunk.toString().toUpperCase());
        }
      })
    ];

    const pipeline = new Pipeline(streams);
    const chunks = [];

    pipeline
      .once('error', done)
      .once('readable', function() {
        while (data = this.read()) {
          chunks.push(data);
        }
      })
      .once('finish', function() {
        assert.equal(chunks.join(''), 'DEADBEEF');
        done();
      });

    pipeline.write('dead');
    pipeline.write('beef');
    pipeline.end();

  });

  it('can handle multiple streams', function(done) {

    const streams = [
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.Transform({
        transform: function(chunk, _, next) {
          next(null, chunk.toString().toUpperCase());
        }
      }),
      new Stream.PassThrough()
    ];

    const pipeline = new Pipeline(streams);
    const chunks = [];

    pipeline
      .once('error', done)
      .once('readable', function() {
        while (data = this.read()) {
          chunks.push(data);
        }
      })
      .once('finish', function() {
        assert.equal(chunks.join(''), 'DEADBEEF');
        done();
      });

    pipeline.write('dead');
    pipeline.write('beef');
    pipeline.end();

  });

});
