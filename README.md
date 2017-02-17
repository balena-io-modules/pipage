# The Pipage
[![npm](https://img.shields.io/npm/v/pipage.svg?style=flat-square)](https://npmjs.com/package/pipage)
[![npm license](https://img.shields.io/npm/l/pipage.svg?style=flat-square)](https://npmjs.com/package/pipage)
[![npm downloads](https://img.shields.io/npm/dm/pipage.svg?style=flat-square)](https://npmjs.com/package/pipage)
[![build status](https://img.shields.io/travis/resin-io-modules/pipage/master.svg?style=flat-square&label=mac%20/%20linux)](https://travis-ci.org/resin-io-modules/pipage)
[![build status](https://img.shields.io/appveyor/ci/resin-io/pipage/master.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/resin-io/pipage)

**pip•age**

- _n._  plumbing, a system of pipes
- _n._  node module, a splice-able stream pipeline

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save pipage
```

## Usage

```js
var Pipeline = require( 'pipage' )
```

```js
var checksum = new ChecksumStream( metadata )
var slice = new SliceStream( metadata )

var pipeline = new Pipeline([ slice, checksum ])

if( bmap ) {
  pipeline.splice( pipeline.indexOf( checksum ), 1 )
  pipeline.append( new BlockMap.FilterStream( bmap ) )
}

new BlockReadStream( '/path/to/resin-os.img' )
  .pipe( pipeline )
  .pipe( new BlockWriteStream( '/dev/rdisk2' ) )
  .once( 'finish', function() {
    // happy face
  })
```
