<a name="Pipeline"></a>

## Pipeline
**Kind**: global class  

* [Pipeline](#Pipeline)
    * [new Pipeline(streams, options)](#new_Pipeline_new)
    * [.end(chunk, encoding, callback)](#Pipeline+end)
    * [.get(index)](#Pipeline+get) ⇒ <code>Stream</code>
    * [.indexOf(stream)](#Pipeline+indexOf) ⇒ <code>Number</code>
    * [.append(...streams)](#Pipeline+append) ⇒ <code>[Pipeline](#Pipeline)</code>
    * [.prepend(...streams)](#Pipeline+prepend) ⇒ <code>[Pipeline](#Pipeline)</code>
    * [.shift()](#Pipeline+shift) ⇒ <code>Stream</code>
    * [.pop()](#Pipeline+pop) ⇒ <code>Stream</code>
    * [.splice(index, remove, ...streams)](#Pipeline+splice) ⇒ <code>Array.&lt;Stream&gt;</code>


-

<a name="new_Pipeline_new"></a>

### new Pipeline(streams, options)
Stream Pipeline

**Params**

- streams <code>Array.&lt;Stream&gt;</code>
- options <code>Object</code>
    - .highWaterMark <code>Number</code>
    - .objectMode <code>Boolean</code>
    - .readableObjectMode <code>Boolean</code>
    - .writableObjectMode <code>Boolean</code>


-

<a name="Pipeline+end"></a>

### pipeline.end(chunk, encoding, callback)
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
**Todo**

- [ ] support nested pipelines, i.e. `pipeline.get(3,2,5)`

**Params**

- index <code>Number</code> - stream's index


-

<a name="Pipeline+indexOf"></a>

### pipeline.indexOf(stream) ⇒ <code>Number</code>
Get the index of a given stream in the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Returns**: <code>Number</code> - index  
**Params**

- stream <code>Stream</code>


-

<a name="Pipeline+append"></a>

### pipeline.append(...streams) ⇒ <code>[Pipeline](#Pipeline)</code>
Append given streams to the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Params**

- ...streams <code>Stream</code> - streams to append


-

<a name="Pipeline+prepend"></a>

### pipeline.prepend(...streams) ⇒ <code>[Pipeline](#Pipeline)</code>
Prepend given streams to the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Params**

- ...streams <code>Stream</code> - streams to prepend


-

<a name="Pipeline+shift"></a>

### pipeline.shift() ⇒ <code>Stream</code>
Shift a stream off of the beginning of the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  

-

<a name="Pipeline+pop"></a>

### pipeline.pop() ⇒ <code>Stream</code>
Pop a stream off of the end of the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  

-

<a name="Pipeline+splice"></a>

### pipeline.splice(index, remove, ...streams) ⇒ <code>Array.&lt;Stream&gt;</code>
Splice streams into or out of the pipeline

**Kind**: instance method of <code>[Pipeline](#Pipeline)</code>  
**Params**

- index <code>Number</code> - starting index for removal / insertion
- remove <code>Number</code> - how many streams to remove
- ...streams <code>Stream</code> - streams to be inserted


-

