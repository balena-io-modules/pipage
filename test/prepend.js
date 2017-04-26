var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline.prepend()', function() {

  it( 'returns pipeline length', function() {
    var pipeline = new Pipeline()
    var stream = new Stream.PassThrough()
    assert.strictEqual( pipeline.prepend( stream ), pipeline.length )
    assert.strictEqual( pipeline.length, 1 )
  })

  it( 'can prepend a stream', function( done ) {

    var streams = []
    var pipeline = new Pipeline( streams )
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'data', (data) => chunks.push( data ) )
      .on( 'end', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    assert.equal( pipeline.length, 0 )
    assert.equal( pipeline.prepend( new Stream.PassThrough() ), 1 )
    assert.equal( pipeline.length, 1 )

    pipeline.write( 'DEAD' )
    pipeline.write( 'BEEF' )
    pipeline.end()

  })

  it( 'can prepend multiple streams', function( done ) {

    var streams = []
    var pipeline = new Pipeline( streams )
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'data', (data) => chunks.push( data ) )
      .on( 'end', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    assert.equal( pipeline.length, 0 )

    pipeline.prepend(
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough()
    )

    assert.equal( pipeline.length, 6 )

    pipeline.write( 'DEAD' )
    pipeline.write( 'BEEF' )
    pipeline.end()

  })

})
