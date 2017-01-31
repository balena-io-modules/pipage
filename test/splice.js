var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline.splice()', function() {

  it( 'inserts streams at positive indices', function( done ) {

    var transf1 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().replace( /e/g, '1' ) )
      }
    })

    var transf2 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().replace( /1/g, '2' ) )
      }
    })

    var transf3 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().replace( /2/gi, '-' ) )
      }
    })

    var chunks = []
    var pipeline = new Pipeline([
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
    ])

    pipeline
      .on( 'error', done )
      .on( 'data', function( chunk ) { chunks.push( chunk ) })
      .on( 'finish', function() {
        assert.equal( chunks.join(''), 'd-adb--f' )
        done()
      })

    var removed = null

    removed = pipeline.splice( 0, 0, transf1 )
    assert.strictEqual( removed.length, 0 )
    assert.strictEqual( pipeline.length, 4 )
    assert.ok( pipeline.get( 0 ) === transf1, 'incorrect position' )

    removed = pipeline.splice( 2, 0, transf2 )
    assert.strictEqual( removed.length, 0 )
    assert.strictEqual( pipeline.length, 5 )
    assert.ok( pipeline.get( 2 ) === transf2, 'incorrect position' )

    removed = pipeline.splice( pipeline.length, 0, transf3 )
    assert.strictEqual( removed.length, 0 )
    assert.strictEqual( pipeline.length, 6 )
    assert.ok( pipeline.get( 5 ) === transf3, 'incorrect position' )

    pipeline.write( 'dead' )
    pipeline.write( 'beef' )
    pipeline.end()

  })

  it( 'inserts streams at negative indices', function( done ) {

    var transf1 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().replace( /e/g, '1' ) )
      }
    })

    var transf2 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().replace( /1/g, '2' ) )
      }
    })

    var transf3 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().replace( /2/gi, '-' ) )
      }
    })

    var chunks = []
    var pipeline = new Pipeline([
      new Stream.PassThrough(),
      new Stream.PassThrough(),
      new Stream.PassThrough(),
    ])

    pipeline
      .on( 'error', done )
      .on( 'data', function( chunk ) { chunks.push( chunk ) })
      .on( 'finish', function() {
        assert.equal( chunks.join(''), 'd-adb--f' )
        done()
      })

    var removed = null

    removed = pipeline.splice( -pipeline.length, 0, transf1 )
    assert.strictEqual( removed.length, 0 )
    assert.strictEqual( pipeline.length, 4 )
    assert.ok( pipeline.get( 0 ) === transf1, 'incorrect position' )

    removed = pipeline.splice( -2, 0, transf2 )
    assert.strictEqual( removed.length, 0 )
    assert.strictEqual( pipeline.length, 5 )
    assert.ok( pipeline.get( 2 ) === transf2, 'incorrect position' )

    // Note that -1 inserts *before* the last stream in the pipeline
    removed = pipeline.splice( -1, 0, transf3 )
    assert.strictEqual( removed.length, 0 )
    assert.strictEqual( pipeline.length, 6 )
    assert.ok( pipeline.get( 4 ) === transf3, 'incorrect position' )

    pipeline.write( 'dead' )
    pipeline.write( 'beef' )
    pipeline.end()

  })

})
