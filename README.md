<h1 align="center">The Pipage</h1>
<p align="center">
  <a href="https://npmjs.com/package/pipage"><img alt="npm" src="https://img.shields.io/npm/v/pipage.svg?style=flat-square"></a>
  <a href="https://npmjs.com/package/pipage"><img alt="npm license" src="https://img.shields.io/npm/l/pipage.svg?style=flat-square"></a>
  <a href="https://npmjs.com/package/pipage"><img alt="npm downloads" src="https://img.shields.io/npm/dm/pipage.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/resin-io-modules/pipage"><img alt="build status" src="https://img.shields.io/travis/resin-io-modules/pipage/master.svg?style=flat-square&label=mac%20%2F%20linux"></a>
  <a href="https://ci.appveyor.com/project/resin-io/pipage"><img alt="build status" src="https://img.shields.io/appveyor/ci/resin-io/pipage/master.svg?style=flat-square&label=windows"></a>
</p>

**pip•age**

- _n._  plumbing, a system of pipes
- _n._  node module, a splice-able stream pipeline

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save pipage
```

## Usage

For detailed API documentation, see [doc/](doc/)

```js
var Pipage = require('pipage')
```

The Pipage is a [duplex stream](https://nodejs.org/api/stream.html#stream_types_of_streams),
inheriting from Node's `stream.Duplex` and behaves in the same way, while containing an
internal pipeline which can be **added to**, **removed from** and **spliced** at runtime:

```
readable -> pipage[ transform, transform, ... ] -> writable
```

### Creating a pipeline

```js
// A blank pass-through pipeline:
var pipeline = new Pipage()

// Initialized with already existing streams:
var pipeline = new Pipage([ transform1, transform2, ... ])
```

### Adding streams

```js
// Streams can be appended,
pipeline.append( stream )
pipeline.append( stream1, stream2, ..., streamN )

// prepended,
pipeline.prepend( stream1, stream2, ..., streamN )

// inserted at a specific index,
pipeline.insert( 3, stream1, ..., streamN )

// which is the same as splicing in streams (add N streams at index 3):
pipeline.splice( 3, 0, stream1, ..., streamN )
```

### Removing streams

```js
// Streams can be shifted off the beginning,
var firstStream = pipeline.shift()

// or popped off the end,
var lastStream = pipeline.pop()

// spliced out at a specific index (remove 3 from index 2),
var removedStreams = pipeline.splice( 2, 3 )

// or removed by reference:
pipeline.remove( stream )
```

### Selecting streams

```js
// Get a stream at a specific index in the pipeline:
var stream = pipeline.get( 2 )
var lastStream = pipeline.get( -1 )

// Find a stream in the pipeline:
var index = pipeline.indexOf( stream )
var lastIndex = pipeline.lastIndexOf( stream )
```

### Example

```js
var Pipage = require('pipage')
var path = require('path')
var zlib = require('zlib')
var unbzip2 = require('unbzip2-stream')
var xz = require('xz')

var pipeline = new Pipage()

switch( path.extname( filename ) ) {
  case '.gz':
    pipeline.prepend( zlib.createUnzip() );
    break
  case '.bz':
  case '.bz2':
    pipeline.prepend( unbzip2() );
    break
  case '.xz':
    pipeline.prepend( new xz.Decompressor() )
    break
}

fs.createReadStream( filename )
  .pipe( pipeline )
  .pipe( fs.createWriteStream( destination ) )
```

### Events

#### Error handling

Errors from streams within the pipeline are listened to,
and re-emitted on the pipeline itself, with an additional `.stream` property
being set on the `error` object, which is the stream that emitted it:

```js
pipeline.on( 'error', function( error ) {
  // This error originated from the pipeline's internal stream
  // available as `error.stream`, not from the pipeline itself
  if( error.stream ) {
    // ...
  } else {
    // This error came from the pipeline itself
  }
})
```

#### Binding to contained stream's events

```js
var stream = pipeline.get(-1)

// Re-emit a stream's events on the pipeline:
pipeline.bind( stream, 'eventname' )
pipeline.bind( stream, [ 'someevent', 'otherevent' ])

// Remove re-emission of a stream's event:
pipeline.unbind( stream, 'eventname' )

// Stop re-emission of all of stream's events on the pipeline:
pipeline.unbindAll( stream )
```

##### Example

```js
var Pipage = require('pipage')

// Let's say we have a stream which emits an event
// we want to capture without having to get a reference to
// that particular stream:
module.exports = function createPipeline() {

  var checksumStream = createChecksumStream( 'sha256', 'md5' )
  var pipeline = new Pipage([ checksumStream ])

  // This will cause the pipeline to re-emit
  // the 'checksums' event from the `checksumStream`
  pipeline.bind( checksumStream, 'checksums' )

  // Add some more fancy things to the pipeline...

  return pipeline

}
```

```js
var createPipeline = require('./create-pipeline')
var pipeline = createPipeline()

// Now we can listen for the bound event directly on the pipeline
pipeline.on( 'checksums', function( checksums ) {
  // Validate the checksums, etc...
})

fs.createReadStream( filename )
  .pipe( pipeline )
  .resume()
```

### Nested Pipelines

Since pipelines are duplex streams, and contain duplex streams,
they can be nested arbitrarily:

```js
var pipeline = new Pipage([
  new Pipage(),
  new Pipage([
    new Pipage()
  ])
])
```
