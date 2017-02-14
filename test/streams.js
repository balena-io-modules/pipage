var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline', function() {

  it( 'can handle no streams', function( done ) {

    var pipeline = new Pipeline()
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'readable', function() {
        while( data = this.read() ) {
          chunks.push( data )
        }
      })
      .on( 'finish', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    assert.equal( pipeline.length, 0 )

    pipeline.write( 'DEAD' )
    pipeline.write( 'BEEF' )
    pipeline.end()

  })

  it( 'can handle a single stream', function( done ) {

    var streams = [
      new Stream.Transform({
        transform: function( chunk, _, next ) {
          next( null, chunk.toString().toUpperCase() )
        }
      }),
    ]

    var pipeline = new Pipeline( streams )
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'readable', function() {
        while( data = this.read() ) {
          chunks.push( data )
        }
      })
      .on( 'finish', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    pipeline.write( 'Dead' )
    pipeline.write( 'Beef' )
    pipeline.end()

  })

  it( 'can handle multiple streams', function( done ) {

    var streams = [
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.Transform({
        transform: function( chunk, _, next ) {
          next( null, chunk.toString().toUpperCase() )
        }
      }),
      new Stream.PassThrough(),
    ]

    var pipeline = new Pipeline( streams )
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'readable', function() {
        while( data = this.read() ) {
          chunks.push( data )
        }
      })
      .on( 'finish', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    pipeline.write( 'Dead' )
    pipeline.write( 'Beef' )
    pipeline.end()

  })

})
