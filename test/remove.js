var Pipeline = require( '..' )
var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Stream = require( 'stream' )

describe( 'Pipeline.remove()', function() {

  it( 'can remove a stream', function( done ) {

    var transform = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toLowerCase() )
      }
    })

    var chunks = []
    var pipeline = new Pipeline([
      new Stream.PassThrough(),
      transform,
      new Stream.PassThrough(),
    ])

    assert.equal( pipeline.length, 3 )

    pipeline
      .on( 'error', done )
      .on( 'data', ( data ) => chunks.push( data ) )
      .on( 'end', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        done()
      })

    assert.equal( pipeline.remove( transform ), transform )
    assert.equal( pipeline.length, 2, 'pipeline length mismatch' )
    assert.equal( pipeline.indexOf( transform ), -1, 'transform not removed' )

    pipeline.write( 'DEAD' )
    pipeline.write( 'BEEF' )
    pipeline.end()

  })

})
