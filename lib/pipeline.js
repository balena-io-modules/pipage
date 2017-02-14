var Stream = require( 'stream' )
var inherit = require( 'bloodline' )

/**
 * Stream Pipeline
 * @constructor
 * @param {Stream[]} streams
 * @param {Object} options
 * @param {Number} options.highWaterMark
 * @param {Boolean} options.objectMode
 * @param {Boolean} options.readableObjectMode
 * @param {Boolean} options.writableObjectMode
 * @return {Pipeline}
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
   */
  _read() {

    if( this._streams.length === 0 ) {
      return
    }

    var self = this
    var rs = this.get(-1)
    var reads = 0
    var chunk = null

    if( !this._isReading ) {
      this._isReading = true
      rs.once( 'readable', function() {
        var chunk = null
        while( chunk = this.read() ) {
          self.push( chunk )
        }
        self._isReading = false
        self._read()
      })
    }

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
   */
  end( chunk, encoding, callback ) {

    if( typeof callback === 'function' ) {
      this.once( 'finish', callback )
    }

    if( this._streams.length !== 0 ) {
      return this.get(0).end( chunk, encoding )
    } else {
      return Stream.Duplex.prototype.end.call(this, chunk, encoding)
    }

  },

  /**
   * Get a stream in the pipeline by index
   * @todo support nested pipelines, i.e. `pipeline.get(3,2,5)`
   * @param {Number} index - stream's index
   * @return {Stream}
   */
  get( index ) {
    return index < 0 ?
      this._streams[ this._streams.length + index ] :
      this._streams[ index ]
  },

  /**
   * Get the index of a given stream in the pipeline
   * @param {Stream} stream
   * @return {Number} index
   */
  indexOf: function( stream, fromIndex ) {
    return this._streams.indexOf( stream, fromIndex )
  },

  /**
   * Append given streams to the pipeline, analog to Array#push()
   * @param  {...Stream} streams - streams to append
   * @return {Pipeline}
   */
  append() {
    var streams = Array.prototype.slice.call( arguments )
    this.splice.apply( this, [ this._streams.length, 0 ].concat( streams ) )
    return this.length
  },

  /**
   * Prepend given streams to the pipeline, analog to Array#unshift()
   * @param  {...Stream} streams - streams to prepend
   * @return {Pipeline}
   */
  prepend() {
    var streams = Array.prototype.slice.call( arguments )
    this.splice.apply( this, [ 0, 0 ].concat( streams ) )
    return this.length
  },

  /**
   * Shift a stream off of the beginning of the pipeline
   * @return {Stream}
   */
  shift() {
    return this.splice( 0, 1 )[0]
  },

  /**
   * Pop a stream off of the end of the pipeline
   * @return {Stream}
   */
  pop() {
    return this.splice( this._streams.length - 1, 1 )[0]
  },

  /**
   * Splice streams into or out of the pipeline
   * @param {Number} index - starting index for removal / insertion
   * @param {Number} remove - how many streams to remove
   * @param {...Stream} streams - streams to be inserted
   * @return {Stream[]}
   */
  splice( index, remove ) {

    // Support negative indices
    index = index >= 0 ? index : this._streams.length + index

    // Default to removal of everything > index
    remove = remove != null ? remove : this._streams.length - index
    remove = Math.max( 0, Math.min( this._streams.length - index, remove ) )

    var lastIndex = index + remove
    var streams = Array.prototype.slice.call( arguments, 2 )

    // Unpipe slice start
    if( this._streams[ index - 1 ] ) {
      this._streams[ index - 1 ].unpipe( this._streams[ index ] )
    }

    // Unpipe slice end
    if( this._streams[ lastIndex - 1 ] && this._streams[ lastIndex ] ) {
      this._streams[ lastIndex - 1 ].unpipe( this._streams[ lastIndex ] )
    }

    // Remove the last stream's 'end' handler
    if( this._streams.length !== 0 ) {
      this.get(-1).removeListener( 'end', this._endHandler )
    }

    // Pipe to-be-inserted streams
    for( i = 0; i < streams.length; i++ ) {
      streams[i].on( 'error', this._errorHandler )
      if( streams[ i + 1 ] == null ) continue
      streams[i].pipe( streams[ i + 1 ] )
    }

    // Splice streams in/out
    var removed = this._streams.splice.apply( this._streams, [ index, remove ].concat( streams ) )

    // Unpipe removed streams
    for( i = 0; i < removed.length; i++ ) {
      removed[i].removeListener( 'error', this._errorHandler )
      if( removed[ i + 1 ] == null ) continue
      removed[i].unpipe( removed[ i + 1 ] )
    }

    lastIndex = index + streams.length

    // Re-pipe slice start
    if( this._streams[ index - 1 ] && this._streams[ index ] ) {
      this._streams[ index - 1 ].pipe( this._streams[ index ] )
    }

    // Re-pipe slice end
    if( this._streams[ lastIndex - 1 ] && this._streams[ lastIndex ] ) {
      this._streams[ lastIndex - 1 ].pipe( this._streams[ lastIndex ] )
    }

    // Add the last stream's 'end' handler
    if( this._streams.length !== 0 ) {
      this.get(-1).on( 'end', this._endHandler )
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
