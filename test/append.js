var Pipeline = require( '..' )
var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Stream = require( 'stream' )

describe( 'Pipeline.append()', function() {

  it( 'can append a stream', function( done ) {

    var streams = []
    var pipeline = new Pipeline( streams )
    var chunks = []

    pipeline
      .once( 'error', done )
      .once( 'data', (data) => chunks.push( data ) )
      .once( 'finish', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    assert.equal( pipeline.length, 0 )

    pipeline.append( new Stream.PassThrough() )

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
      .once( 'error', done )
      .once( 'data', (data) => chunks.push( data ) )
      .once( 'finish', function() {
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
