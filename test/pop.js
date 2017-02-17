var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline.pop()', function() {

  it( 'returns nothing for an empty pipeline', function() {
    var pipeline = new Pipeline()
    assert.strictEqual( pipeline.length, 0 )
    assert.strictEqual( pipeline.pop(), undefined )
    assert.strictEqual( pipeline.length, 0 )
  })

  it( 'pops off the last stream of pipeline', function() {

    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.PassThrough()
    var pipeline = new Pipeline([ stream1, stream2 ])

    assert.strictEqual( pipeline.length, 2 )

    assert.strictEqual( pipeline.pop(), stream2 )
    assert.strictEqual( pipeline.length, 1 )

    assert.strictEqual( pipeline.pop(), stream1 )
    assert.strictEqual( pipeline.length, 0 )

  })

})
