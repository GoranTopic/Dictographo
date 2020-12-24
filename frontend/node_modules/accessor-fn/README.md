Accessor function
==============

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![Dependencies][dependencies-img]][dependencies-url]

A wrapper for property accessors supporting functions, property strings or constant values.

## Quick start

```
import accessorFn from 'accessor-fn';
```
or
```
var accessorFn = require('accessor-fn');
```
or even
```
<script src="//unpkg.com/accessor-fn"></script>
```

## Usage example

Given an object
```
var obj = {
    a: 1,
    b: 2
}
```

Use `accessorFn` to access object values via property strings or transformation functions:
```
var aFn = accessorFn('a');
aFn(obj); // 1

var sumFn = accessorFn(d => d.a + d.b);
sumFn(obj); // 3

var constantFn = accessorFn(7);
constantFn(obj); // 7
```


[npm-img]: https://img.shields.io/npm/v/accessor-fn.svg
[npm-url]: https://npmjs.org/package/accessor-fn
[build-size-img]: https://img.shields.io/bundlephobia/minzip/accessor-fn.svg
[build-size-url]: https://bundlephobia.com/result?p=accessor-fn
[dependencies-img]: https://img.shields.io/david/vasturiano/accessor-fn.svg
[dependencies-url]: https://david-dm.org/vasturiano/accessor-fn
