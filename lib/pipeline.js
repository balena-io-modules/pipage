var Emitter = require( 'events' ).EventEmitter
var inherit = require( 'bloodline' )

/**
 * Stream Pipeline
 * @constructor
 * @returns {Pipeline}
 */
function Pipeline( source, destination ) {

  if( !(this instanceof Pipeline) )
    return new Pipeline( source, destination )

  Emitter.call( this )

  if( source ) {
    this.setSource( source )
  }

  if( destination ) {
    this.setDestination( destination )
  }

}

/**
 * Pipeline prototype
 * @type {Object}
 * @ignore
 */
Pipeline.prototype = {

  constructor: Pipeline,

  setSource: function( stream, options ) {},

  setDestination: function( stream, options ) {},

  bind: function( stream, events ) {},

  unbind: function( stream, events ) {},

  splice: function( index, stream, options ) {},

  prepend: function( stream, options ) {},

  append: function( stream, options ) {},

  pause: function() {},

  resume: function() {},

}

inherit( Pipeline, Emitter )

module.exports = Pipeline
