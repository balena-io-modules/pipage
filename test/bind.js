var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline.bind()', function() {

  it( 'emits custom bound events', function( done ) {

    var emitter = new Stream.PassThrough()
    var pipeline = new Pipeline([ emitter ])
    var chunks = []
    var hadEvent = false

    pipeline
      .on( 'error', done )
      .on( 'data', (data) => chunks.push( data ) )
      .on( 'custom:event', ( one, two, three ) => {
        hadEvent = true
        assert.equal( one, 1 )
        assert.equal( two, 2 )
        assert.equal( three, 3 )
      })
      .on( 'finish', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        assert.ok( hadEvent, 'missing custom event' )
        done()
      })

    pipeline.bind( emitter, 'custom:event' )
    pipeline.write( 'DEAD' )

    setTimeout( function() {
      emitter.emit( 'custom:event', 1, 2, 3 )
      setImmediate( function() {
        pipeline.write( 'BEEF' )
        pipeline.end()
      })
    }, 16 )

  })

  it( 'does not double-bind events', function() {

    var emitter = new Stream.PassThrough()
    var pipeline = new Pipeline([ emitter ])

    pipeline.bind( emitter, 'something' )
    pipeline.bind( emitter, 'something' )
    pipeline.bind( emitter, 'something' )

    assert.equal( emitter.listenerCount( 'something' ), 1 )

  })

})
