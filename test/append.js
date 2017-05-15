var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline.append()', function() {

  it( 'returns pipeline length', function() {
    var pipeline = new Pipeline()
    assert.strictEqual( pipeline.append( new Stream.PassThrough() ), pipeline.length )
    assert.strictEqual( pipeline.length, 1 )
    assert.strictEqual( pipeline.append( new Stream.PassThrough() ), pipeline.length )
    assert.strictEqual( pipeline.length, 2 )
  })

  it( 'can append a stream', function( done ) {

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
    assert.equal( pipeline.append( new Stream.PassThrough() ), 1 )
    assert.equal( pipeline.length, 1 )

    pipeline.write( 'DEAD' )
    pipeline.write( 'BEEF' )
    pipeline.end()

  })

  it( 'can append multiple streams', function( done ) {

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

    pipeline.append(
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
