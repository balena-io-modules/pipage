var Pipeline = require( '..' )
var assert = require( 'assert' )
var Stream = require( 'stream' )

describe( 'Pipeline.unbind()', function() {

  it( 'unbinds events', function( done ) {

    var emitter = new Stream.PassThrough()
    var pipeline = new Pipeline([ emitter ])
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'data', (data) => chunks.push( data ) )
      .on( 'custom:event', () => { throw new Error( 'Emitted unbound event' ) })
      .on( 'end', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        assert.equal( emitter.listenerCount( 'custom:event' ), 0 )
        done()
      })

    pipeline.bind( emitter, 'custom:event' )
    pipeline.write( 'DEAD' )

    setTimeout( function() {
      pipeline.unbind( emitter, 'custom:event' )
      emitter.emit( 'custom:event' )
      setImmediate( function() {
        pipeline.write( 'BEEF' )
        pipeline.end()
      })
    }, 16 )

  })

})

describe( 'Pipeline.unbindAll()', function() {

  it( 'unbinds all events from a stream', function( done ) {

    var emitter = new Stream.PassThrough()
    var pipeline = new Pipeline([ emitter ])
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'data', (data) => chunks.push( data ) )
      .on( 'custom:event1', () => { throw new Error( 'Emitted unbound event' ) })
      .on( 'custom:event2', () => { throw new Error( 'Emitted unbound event' ) })
      .on( 'custom:event3', () => { throw new Error( 'Emitted unbound event' ) })
      .on( 'end', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        assert.equal( emitter._pipageListeners, null )
        assert.equal( emitter.listenerCount( 'custom:event1' ), 0 )
        assert.equal( emitter.listenerCount( 'custom:event2' ), 0 )
        assert.equal( emitter.listenerCount( 'custom:event3' ), 0 )
        done()
      })

    pipeline.bind( emitter, 'custom:event1' )
    pipeline.bind( emitter, 'custom:event2' )
    pipeline.bind( emitter, 'custom:event3' )

    pipeline.write( 'DEAD' )

    process.nextTick( function() {
      pipeline.unbindAll( emitter )
      emitter.emit( 'custom:event1' )
      process.nextTick( function() {
        emitter.emit( 'custom:event2' )
        pipeline.write( 'BEEF', function() {
          emitter.emit( 'custom:event3' )
        })
        pipeline.end()
      })
    })

  })

  it( 'unbinds events from removed streams', function( done ) {

    var emitter = new Stream.PassThrough()
    var pipeline = new Pipeline([ emitter ])
    var chunks = []

    pipeline
      .on( 'error', done )
      .on( 'data', (data) => chunks.push( data ) )
      .on( 'custom:event', () => { throw new Error( 'Emitted unbound event' ) })
      .on( 'end', function() {
        assert.equal( chunks.join(''), 'DEADBEEF' )
        assert.equal( emitter._pipageListeners, null )
        assert.equal( emitter.listenerCount( 'custom:event' ), 0 )
        done()
      })

    pipeline.bind( emitter, 'custom:event' )
    pipeline.write( 'DEAD' )

    setTimeout( function() {
      pipeline.remove( emitter )
      emitter.emit( 'custom:event' )
      setImmediate( function() {
        pipeline.write( 'BEEF' )
        pipeline.end()
      })
    }, 16 )

  })

  it( 'does not throw when unbinding an unbound event', function() {

    var emitter = new Stream.PassThrough()
    var pipeline = new Pipeline([ emitter ])

    pipeline.unbind( emitter, 'notbound' )
    pipeline.unbindAll( emitter )

  })

})
