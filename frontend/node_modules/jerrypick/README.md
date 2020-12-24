jerrypick
==============

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![Dependencies][dependencies-img]][dependencies-url]

Pluck and omit properties from a JS object.

`pluck(obj, [prop1, prop2, ...]);`
`omit(obj, [prop1, prop2, ...]);`

## Quick start

```
import { pluck, omit } from 'jerrypick';
```
or
```
const { pluck, omit } = require('jerrypick');
```
or even
```
<script src="//unpkg.com/jerrypick"></script>
```

## Usage example

```
const myObj = {
  a: 3,
  b: 6,
  c: 9
};

pluck(myObj, ['a', 'c']);

// Result:
{ a: 3, c: 9 }

omit(myObj, ['a', 'b']);

// Result:
{ a: 3 }
```


[npm-img]: https://img.shields.io/npm/v/jerrypick.svg
[npm-url]: https://npmjs.org/package/jerrypick
[build-size-img]: https://img.shields.io/bundlephobia/minzip/jerrypick.svg
[build-size-url]: https://bundlephobia.com/result?p=jerrypick
[dependencies-img]: https://img.shields.io/david/vasturiano/jerrypick.svg
[dependencies-url]: https://david-dm.org/vasturiano/jerrypick
