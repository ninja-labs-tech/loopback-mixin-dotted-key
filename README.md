### loopback-mixin-dotted-key [![Build Status](https://travis-ci.com/MohammedEssehemy/loopback-mixin-dotted-key.svg?branch=master)](https://travis-ci.com/MohammedEssehemy/loopback-mixin-dotted-key)

[loopback v3](https://loopback.io/) mixin to enable changing dotted keys before storing in MongoDB.

### usage ###

* install via npm.

```shell
npm install loopback-mixin-dotted-key
```

* update `server.js` to load mixin.

```javascript
const DottedKeysReplace = require('loopback-mixin-dotted-key');

DottedKeysReplace(app);
```

* add mixins property to the required model.

```json
"mixins": {
  "DottedKeysReplace" : {
    "haystack": ".",
    "replace": "#",
  }
}
```

### options ###

_haystack_: char to replace, defaults to `.`.

_replace_: char to replace with, defaults to `#`.

### DEBUG MODE ###

```
DEBUG='loopback:mixin:dotted-key'
```
