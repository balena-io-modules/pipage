var Pipeline = require( '..' )
var assert = require( 'assert' )
var crypto = require( 'crypto' )
var Stream = require( 'stream' )

describe( 'Edge cases', function() {

  // `crypto.Hash` streams will only become
  // readable once `.end()` has been called on them
  it( 'can handle crypto.Hash streams', function( done ) {

    var streams = [ crypto.createHash( 'sha1' ) ]
    var pipeline = new Pipeline( streams )

    pipeline
      .on( 'error', done )
      .on( 'end', done )
      .on( 'readable', function() {
        var hash = this.read()
        if( hash != null ) {
          assert.equal( hash.toString( 'hex' ), '37a309ae59ad3a562a083eb90e32fa6757bdd41f' )
        }
      })

    pipeline.end( 'Let it work!' )

  })

})
