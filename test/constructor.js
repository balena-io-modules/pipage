var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Constructor', function() {

  it( 'can be called without "new" keyword', function() {
    var pipeline = Pipeline()
    assert.ok( pipeline instanceof Pipeline, 'instanceof Pipeline' )
  })

  it( 'can be called without arguments', function() {
    var pipeline = new Pipeline()
    assert.ok( pipeline instanceof Pipeline, 'instanceof Pipeline' )
  })

  it( 'can be called with streams, but without options', function() {
    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.PassThrough()
    var pipeline = new Pipeline([ stream1, stream2 ])
    assert.ok( pipeline instanceof Pipeline, 'instanceof Pipeline' )
    assert.strictEqual( pipeline.length, 2 )
  })

  it( 'can be called with options only', function() {
    var pipeline = new Pipeline({ highWaterMark: 1234 })
    assert.ok( pipeline instanceof Pipeline, 'instanceof Pipeline' )
    assert.strictEqual( pipeline.length, 0 )
    assert.strictEqual( pipeline._readableState.highWaterMark, 1234 )
    assert.strictEqual( pipeline._writableState.highWaterMark, 1234 )
  })

  it( 'can be called with both, streams and options', function() {
    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.PassThrough()
    var pipeline = new Pipeline([ stream1, stream2 ], { highWaterMark: 1234 })
    assert.ok( pipeline instanceof Pipeline, 'instanceof Pipeline' )
    assert.strictEqual( pipeline.length, 2 )
    assert.strictEqual( pipeline._readableState.highWaterMark, 1234 )
    assert.strictEqual( pipeline._writableState.highWaterMark, 1234 )
  })

})
