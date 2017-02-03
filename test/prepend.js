const Pipeline = require('..');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Stream = require('stream');

describe('Pipeline.prepend()', function() {

  it('can prepend a stream', function(done) {

    const streams = [];
    const pipeline = new Pipeline(streams);
    const chunks = [];

    pipeline
      .once('error', done)
      .once('data', (data) => {
        return chunks.push(data);
      })
      .once('finish', function() {
        assert.equal(chunks.join(''), 'DEADBEEF');
        done();
      });

    assert.equal(pipeline.length, 0);

    pipeline.prepend(new Stream.PassThrough());

    assert.equal(pipeline.length, 1);

    pipeline.write('DEAD');
    pipeline.write('BEEF');
    pipeline.end();

  });

  it('can prepend multiple streams', function(done) {

    const streams = [];
    const pipeline = new Pipeline(streams);
    const chunks = [];

    pipeline
      .once('error', done)
      .once('data', (data) => {
        return chunks.push(data);
      })
      .once('finish', function() {
        assert.equal(chunks.join(''), 'DEADBEEF');
        done();
      });

    assert.equal(pipeline.length, 0);

    pipeline.prepend(
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough()
    );

    assert.equal(pipeline.length, 6);

    pipeline.write('DEAD');
    pipeline.write('BEEF');
    pipeline.end();

  });

});
