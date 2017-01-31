var Stream = require( 'stream' )
var inherit = require( 'bloodline' )
var debug = require( 'debug' )( 'pipage' )

/**
 * Stream Pipeline
 * @constructor
 * @extends {Stream.Duplex}
 * @param {Stream[]} [streams]
 * @param {Object} [options]
 * @param {Number} [options.highWaterMark=16384]
 * @param {Boolean} [options.allowHalfOpen=true]
 * @param {Boolean} [options.objectMode=false]
 * @param {Boolean} [options.readableObjectMode=false]
 * @param {Boolean} [options.writableObjectMode=false]
 * @see https://nodejs.org/api/stream.html#stream_new_stream_duplex_options
 * @returns {Pipeline}
 */
function Pipeline( streams, options ) {

  if( !(this instanceof Pipeline) )
    return new Pipeline( streams, options )

  var self = this

  if( streams && !Array.isArray( streams ) ) {
    options = streams
    streams = null
  }

  Stream.Duplex.call( this, options )

  this._streams = []
  this._isReading = false

  this._errorHandler = function( error ) {
    error.stream = this
    self.emit( 'error', error )
  }

  this._endHandler = function() {
    if( self.get(-1) === this ) {
      Stream.Duplex.prototype.end.call(self)
    }
  }

  this._readHandler = function() {
    var chunk = null
    while( chunk = this.read() ) {
      self.push( chunk )
    }
    self._isReading = false
    self._read()
  }

  // Splice the passed streams into the pipeline
  if( Array.isArray( streams ) && streams.length ) {
    this.splice.apply( this, [ 0, 0 ].concat( streams ) )
  }

}

/**
 * Pipeline prototype
 * @type {Object}
 * @ignore
 */
Pipeline.prototype = {

  constructor: Pipeline,

  get length() {
    return this._streams.length
  },

  /**
   * Read data from the end of the stream
   * @private
   * @returns {undefined}
   */
  _read() {

    if( this._isReading || this._streams.length === 0 ) {
      return
    }

    this._isReading = true
    this.get(-1).once( 'readable', this._readHandler )

  },

  /**
   * Send data into the underlying streams
   * @private
   * @param {*} chunk
   * @param {String} encoding
   * @param {Function} next(error,chunk)
   * @returns {Boolean}
   */
  _write( chunk, encoding, next ) {

    if( this._streams.length === 0 ) {
      process.nextTick( next )
      return this.push( chunk, encoding )
    }

    return this._streams[0]._write( chunk, encoding, next )

  },

  /**
   * End the pipeline
   * NOTE: We need to override this here,
   * because `crypto.Hash` streams will only emit
   * a 'readable' event once ended
   * @param {*} chunk
   * @param {String} encoding
   * @param {Function} callback – called on 'finish'
   * @returns {undefined}
   */
  end( chunk, encoding, callback ) {

    debug( 'end', !!chunk, !!callback )

    if( typeof callback === 'function' ) {
      this.once( 'finish', callback )
    }

    if( this._streams.length !== 0 ) {
      this.get(0).end( chunk, encoding )
    } else {
      Stream.Duplex.prototype.end.call(this, chunk, encoding)
    }

  },

  /**
   * Get a stream in the pipeline by index
   * @todo support nested pipelines, i.e. `pipeline.get(3,2,5)`
   * @param {Number} index - stream's index
   * @returns {Stream} stream
   */
  get( index ) {
    index = index >= 0 ? index : this._streams.length + index
    return this._streams[ index ]
  },

  /**
   * Get the index of a given stream in the pipeline
   * @param {Stream} stream
   * @param {Number} [fromIndex]
   * @returns {Number} index
   */
  indexOf: function( stream, fromIndex ) {
    return this._streams.indexOf( stream, fromIndex )
  },

  /**
   * Get the last index of a given stream in the pipeline
   * @param {Stream} stream
   * @param {Number} [fromIndex]
   * @returns {Number} index
   */
  lastIndexOf: function( stream, fromIndex ) {
    return this._streams.lastIndexOf( stream, fromIndex )
  },

  /**
   * Append given streams to the pipeline, analog to Array#push()
   * @param  {...Stream} streams - streams to append
   * @returns {Number} length
   */
  append() {
    var streams = Array.prototype.slice.call( arguments )
    this.splice.apply( this, [ this._streams.length, 0 ].concat( streams ) )
    return this.length
  },

  /**
   * Prepend given streams to the pipeline, analog to Array#unshift()
   * @param  {...Stream} streams - streams to prepend
   * @returns {Number} length
   */
  prepend() {
    var streams = Array.prototype.slice.call( arguments )
    this.splice.apply( this, [ 0, 0 ].concat( streams ) )
    return this.length
  },

  /**
   * Shift a stream off of the beginning of the pipeline
   * @returns {Stream} stream
   */
  shift() {
    return this.splice( 0, 1 )[0]
  },

  /**
   * Pop a stream off of the end of the pipeline
   * @returns {Stream} stream
   */
  pop() {
    return this.splice( this._streams.length - 1, 1 )[0]
  },

  /**
   * Insert given streams into the pipeline at a given index
   * @param {Number} index
   * @param {...Stream} streams
   * @returns {Number} length
   */
  insert: function( index ) {

    if( typeof index !== 'number' ) {
      throw new Error( 'Insertion index must be a number' )
    }

    var streams = Array.prototype.slice.call( arguments, 1 )
    var argv = [ index, 0 ].concat( streams )

    this.splice.apply( this, argv )

    return this.length

  },

  /**
   * Remove a given stream from the pipeline
   * @param {Stream} stream
   * @returns {Stream|null} removed stream
   */
  remove: function( stream ) {
    var index = this.indexOf( stream )
    return ~index ? this.splice( index, 1 )[0] : null
  },

  /**
   * Splice streams into or out of the pipeline
   * @param {Number} index - starting index for removal / insertion
   * @param {Number} remove - how many streams to remove
   * @param {...Stream} streams - streams to be inserted
   * @returns {Stream[]} removed streams
   */
  splice( index, remove ) {

    // Support negative indices
    index = index >= 0 ? index : this._streams.length + index

    // Default to removal of everything > index
    remove = remove != null ? remove : this._streams.length - index
    remove = Math.max( 0, Math.min( this._streams.length - index, remove ) )

    var lastIndex = index + remove
    var streams = Array.prototype.slice.call( arguments, 2 )

    debug( 'splice @%s/%s -%s +%s', index, this._streams.length, remove, streams.length )

    // Unpipe slice start
    if( this._streams[ index - 1 ] ) {
      debug( 'unpipe:slice-start', index - 1, '<>', index )
      this._streams[ index - 1 ].unpipe( this._streams[ index ] )
    }

    // Unpipe slice end
    if( this._streams[ lastIndex - 1 ] && this._streams[ lastIndex ] ) {
      debug( 'unpipe:slice-end', lastIndex - 1, '<>', lastIndex )
      this._streams[ lastIndex - 1 ].unpipe( this._streams[ lastIndex ] )
    }

    // Remove the last stream's 'end' handler
    if( this._streams.length !== 0 ) {
      debug( 'end-handler:off', this._streams.length - 1 )
      this._streams[ this._streams.length - 1 ].removeListener( 'end', this._endHandler )
    }

    // Pipe to-be-inserted streams
    for( i = 0; i < streams.length; i++ ) {
      streams[i].on( 'error', this._errorHandler )
      if( streams[ i + 1 ] == null ) continue
      debug( 'pipe', i, '->', i + 1 )
      streams[i].pipe( streams[ i + 1 ] )
    }

    // Splice streams in/out
    var removed = this._streams.splice.apply( this._streams, [ index, remove ].concat( streams ) )

    // Unpipe removed streams
    for( i = 0; i < removed.length; i++ ) {
      removed[i].removeListener( 'error', this._errorHandler )
      if( removed[ i + 1 ] == null ) continue
      debug( 'unpipe', i, '<>', i + 1 )
      removed[i].unpipe( removed[ i + 1 ] )
    }

    lastIndex = index + streams.length

    // Re-pipe slice start
    if( this._streams[ index - 1 ] && this._streams[ index ] ) {
      debug( 'pipe:slice-start', index - 1, '->', index )
      this._streams[ index - 1 ].pipe( this._streams[ index ] )
    }

    // Re-pipe slice end
    if( index !== lastIndex && this._streams[ lastIndex - 1 ] && this._streams[ lastIndex ] ) {
      debug( 'pipe:slice-end', lastIndex - 1, '->', lastIndex )
      this._streams[ lastIndex - 1 ].pipe( this._streams[ lastIndex ] )
    }

    // Add the last stream's 'end' handler
    if( this._streams.length !== 0 ) {
      debug( 'end-handler:on', this._streams.length - 1 )
      this._streams[ this._streams.length - 1 ].on( 'end', this._endHandler )
    }

    // Trigger the underlying read mechanisms of the new streams,
    // see https://nodejs.org/api/stream.html#stream_readable_read_0
    this.read(0)

    return removed

  },

}

inherit( Pipeline, Stream.Duplex )

// Exports
module.exports = Pipeline
