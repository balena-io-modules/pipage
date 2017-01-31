<a name="Pipeline"></a>

## Pipeline ⇐ <code>Stream.Duplex</code>
**Kind**: global class  
**Extends:** <code>Stream.Duplex</code>  
**See**: https://nodejs.org/api/stream.html#stream_new_stream_duplex_options  

* [Pipeline](#Pipeline) ⇐ <code>Stream.Duplex</code>
    * [new Pipeline([streams], [options])](#new_Pipeline_new)
    * [.end(chunk, encoding, callback)](#Pipeline+end) ⇒ <code>undefined</code>
    * [.get(index)](#Pipeline+get) ⇒ <code>Stream</code>
    * [.indexOf(stream, [fromIndex])](#Pipeline+indexOf) ⇒ <code>Number</code>
    * [.lastIndexOf(stream, [fromIndex])](#Pipeline+lastIndexOf) ⇒ <code>Number</code>
    * [.append(...streams)](#Pipeline+append) ⇒ <code>Number</code>
    * [.prepend(...streams)](#Pipeline+prepend) ⇒ <code>Number</code>
    * [.shift()](#Pipeline+shift) ⇒ <code>Stream</code>
    * [.pop()](#Pipeline+pop) ⇒ <code>Stream</code>
    * [.insert(index, ...streams)](#Pipeline+insert) ⇒ <code>Number</code>
    * [.remove(stream)](#Pipeline+remove) ⇒ <code>Stream</code> &#124; <code>null</code>
    * [.splice(index, remove, ...streams)](#Pipeline+splice) ⇒ <code>Array.&lt;Stream&gt;</code>


-

<a name="new_Pipeline_new"></a>

### new Pipeline([streams], [options])
Stream Pipeline

**Params**

- [streams] <code>Array.&lt;Stream&gt;</code>
- [options] <code>Object</code>
    - [.highWaterMark] <code>Number</code> <code> = 16384</code>
    - [.allowHalfOpen] <code>Boolean</code> <code> = true</code>
    - [.objectMode] <code>Boolean</code> <code> = false</code>
    - [.readableObjectMode] <code>Boolean</code> <code> = false</code>
    - [.writableObjectMode] <code>Boolean</code> <code> = false</code>


-

<a name="Pipeline+end"></a>

### pipeline.end(chunk, encoding, callback) ⇒ <code>undefined</code>
End the pipeline
NOTE: We need to override this here,
because `crypto.Hash` streams will only emit
a 'readable' event once ended

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Params**

- chunk <code>\*</code>
- encoding <code>String</code>
- callback <code>function</code> - – called on 'finish'


-

<a name="Pipeline+get"></a>

### pipeline.get(index) ⇒ <code>Stream</code>
Get a stream in the pipeline by index

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Stream</code> - stream  
**Todo**

- [ ] support nested pipelines, i.e. `pipeline.get(3,2,5)`

**Params**

- index <code>Number</code> - stream's index


-

<a name="Pipeline+indexOf"></a>

### pipeline.indexOf(stream, [fromIndex]) ⇒ <code>Number</code>
Get the index of a given stream in the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Number</code> - index  
**Params**

- stream <code>Stream</code>
- [fromIndex] <code>Number</code>


-

<a name="Pipeline+lastIndexOf"></a>

### pipeline.lastIndexOf(stream, [fromIndex]) ⇒ <code>Number</code>
Get the last index of a given stream in the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Number</code> - index  
**Params**

- stream <code>Stream</code>
- [fromIndex] <code>Number</code>


-

<a name="Pipeline+append"></a>

### pipeline.append(...streams) ⇒ <code>Number</code>
Append given streams to the pipeline, analog to Array#push()

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Number</code> - length  
**Params**

- ...streams <code>Stream</code> - streams to append


-

<a name="Pipeline+prepend"></a>

### pipeline.prepend(...streams) ⇒ <code>Number</code>
Prepend given streams to the pipeline, analog to Array#unshift()

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Number</code> - length  
**Params**

- ...streams <code>Stream</code> - streams to prepend


-

<a name="Pipeline+shift"></a>

### pipeline.shift() ⇒ <code>Stream</code>
Shift a stream off of the beginning of the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Stream</code> - stream  

-

<a name="Pipeline+pop"></a>

### pipeline.pop() ⇒ <code>Stream</code>
Pop a stream off of the end of the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Stream</code> - stream  

-

<a name="Pipeline+insert"></a>

### pipeline.insert(index, ...streams) ⇒ <code>Number</code>
Insert given streams into the pipeline at a given index

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Number</code> - length  
**Params**

- index <code>Number</code>
- ...streams <code>Stream</code>


-

<a name="Pipeline+remove"></a>

### pipeline.remove(stream) ⇒ <code>Stream</code> &#124; <code>null</code>
Remove a given stream from the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Stream</code> &#124; <code>null</code> - removed stream  
**Params**

- stream <code>Stream</code>


-

<a name="Pipeline+splice"></a>

### pipeline.splice(index, remove, ...streams) ⇒ <code>Array.&lt;Stream&gt;</code>
Splice streams into or out of the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Array.&lt;Stream&gt;</code> - removed streams  
**Params**

- index <code>Number</code> - starting index for removal / insertion
- remove <code>Number</code> - how many streams to remove
- ...streams <code>Stream</code> - streams to be inserted


-

