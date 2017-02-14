var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline#onError', function() {

  it( 'will emit an "error" from the beginning of the pipeline', function( done ) {

    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toLowerCase() )
      }
    })

    var stream3 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toUpperCase() )
      }
    })

    var pipeline = new Pipeline([ stream1, stream2, stream3 ])
    var hadError = false

    pipeline.on( 'error', function( error ) {
      assert.ok( hadError === false, 'only one error emitted' )
      assert.equal( error.stream, stream1, 'stream reference' )
      hadError = true
    })

    pipeline.resume().once( 'finish', function() {
      done()
    })

    pipeline.write( 'something' )
    pipeline.end( 'else' )

    setImmediate( function() {
      stream1.emit( 'error', new Error( 'Catch me' ) )
    })

  })

  it( 'will emit each "error" event from all streams in the pipeline', function( done ) {

    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toLowerCase() )
      }
    })

    var stream3 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toUpperCase() )
      }
    })

    var pipeline = new Pipeline([ stream1, stream2, stream3 ])
    var hadErrors = 0

    pipeline.on( 'error', function( error ) {
      assert.ok( error instanceof Error )
      hadErrors++
      if( hadErrors === 3 ) done()
    })

    pipeline.resume().once( 'finish', function() {
      done( new Error( 'Did not error' ) )
    })

    setImmediate( function() {
      pipeline.write( 'something' )
      stream1.emit( 'error', new Error( 'Catch me' ) )
      setImmediate( function() {
        stream2.emit( 'error', new Error( 'Catch me' ) )
        pipeline.end( 'else' )
        stream3.emit( 'error', new Error( 'Catch me' ) )
      })
    })

  })

  it( 'will emit an "error" from the middle of the pipeline', function( done ) {

    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toLowerCase() )
      }
    })

    var stream3 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toUpperCase() )
      }
    })

    var pipeline = new Pipeline([ stream1, stream2, stream3 ])
    var hadError = false

    pipeline.on( 'error', function( error ) {
      assert.ok( hadError === false, 'only one error emitted' )
      assert.equal( error.stream, stream2, 'stream reference' )
      hadError = true
    })

    pipeline.resume().once( 'finish', function() {
      done()
    })

    pipeline.write( 'something' )
    pipeline.end( 'else' )

    setImmediate( function() {
      stream2.emit( 'error', new Error( 'Catch me' ) )
    })

  })

  it( 'will emit an "error" from the end of the pipeline', function( done ) {

    var stream1 = new Stream.PassThrough()
    var stream2 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toLowerCase() )
      }
    })

    var stream3 = new Stream.Transform({
      transform: function( chunk, _, next ) {
        next( null, chunk.toString().toUpperCase() )
      }
    })

    var pipeline = new Pipeline([ stream1, stream2, stream3 ])
    var hadError = false

    pipeline.on( 'error', function( error ) {
      assert.ok( hadError === false, 'only one error emitted' )
      assert.equal( error.stream, stream3, 'stream reference' )
      hadError = true
    })

    pipeline.resume().once( 'finish', function() {
      done()
    })

    pipeline.write( 'something' )
    pipeline.end( 'else' )

    setImmediate( function() {
      stream3.emit( 'error', new Error( 'Catch me' ) )
    })

  })

})
