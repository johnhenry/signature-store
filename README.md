#Signature Store

Store digital signatures to prevent replay attacks

## Install
Note : this middleware requires a leveldb compatible datastore

Note: this middleware expects the following properties
on the request object:
- signature

```bash
$ npm install signature-store
```

## API

```js
var express             = require('express')
var signatureStore      = require('signature-store');
var options             = {db:<leveldb datastore>};
var app = express();
app.use(signatureStore(options));
```

### signatureStore(options)

Returns the Signature Store middleware using the given `options`.

```js
app.use(signatureStore({
  db            : <leveldb datastore>,
  expiration    : false,
  reject        : false,
  hash          : null,
}))
```

#### Options

  `db` `required`       - level db database
  `expiration` `false`  - expiration (falsy values for no expiration)
  `reject` `false`      - reject request if signature is not new (401 Unauthorized)
  `hash` `null`         - function to hash signature

## Examples

### Server-Sent Events

```js
var express = require('express');
var levelup = require('levelup');
var memdown = require('memdown');
var db = levelup('/does/not/matter',{db: memdown});
var app = express();
var signatureStore = require('signature-store');
var options = {
    db : db
}
app.use(...)
app.use(signatureStore(options));
app.use(function(req,res){
    console.log(req.newSignature);//Status of signature for current request
})
app.listen(8080);
```
## See Also
- [Signature Extraction Middleware](https://github.com/johnhenry/signature-extract)
- [Signature Verification Middleware](https://github.com/johnhenry/signature-verify)

## Credits
  - [John Henry](https://github.com/johnhenry)

## License

The MIT License (MIT)

Copyright (c) 2014 John Henry john@iamjohnhenry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
