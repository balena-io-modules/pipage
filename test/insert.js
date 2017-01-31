var Pipeline = require( '..' )
var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Stream = require( 'stream' )

describe( 'Pipeline.insert()', function() {

  it( 'can insert a stream at specific indices', function( done ) {

    var insert = null
    var chunks = []
    var pipeline = new Pipeline([
      new Stream.PassThrough(),
      new Stream.PassThrough()
    ])

    assert.equal( pipeline.length, 2 )

    pipeline
      .once( 'error', done )
      .once( 'data', (data) => chunks.push( data ) )
      .once( 'finish', function() {
        assert.equal( chunks.join(''), 'deadbeef' )
        done()
      })

    insert = new Stream.PassThrough()
    assert.equal( pipeline.insert( 0, insert ), 3, 'insert 1: unexpected length' )
    assert.equal( pipeline.length, 3, 'insert 1: unexpected length' )
    assert.equal( pipeline.indexOf( insert ), 0, 'insert 1: index mismatch' )

    insert = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toLowerCase() )
      }
    })

    assert.equal( pipeline.insert( pipeline.length, insert ), 4, 'insert 2: unexpected length' )
    assert.equal( pipeline.length, 4, 'insert 2: unexpected length' )
    assert.equal( pipeline.indexOf( insert ), pipeline.length - 1, 'insert 2: index mismatch' )

    insert = new Stream.PassThrough()
    assert.equal( pipeline.insert( 2, insert ), 5, 'insert 3: unexpected length' )
    assert.equal( pipeline.length, 5, 'insert 3: unexpected length' )
    assert.equal( pipeline.indexOf( insert ), 2, 'insert 3: index mismatch' )

    pipeline.write( 'DEAD' )
    pipeline.write( 'BEEF' )
    pipeline.end()

  })

})
