[![Build Status](https://travis-ci.org/r-park/images-ready.svg?branch=master)](https://travis-ci.org/r-park/images-ready)
[![Coverage Status](https://coveralls.io/repos/r-park/images-ready/badge.svg?branch=master)](https://coveralls.io/r/r-park/images-ready?branch=master)
[![npm version](https://badge.fury.io/js/imagesready.svg)](http://badge.fury.io/js/imagesready)

# ImagesReady
ImagesReady is a lightweight utility for detecting when images have been loaded. It supports promises and can be used with or without jQuery.

## Installation
**bower**
```bash
bower install imagesready
```
**npm**
```bash
npm install imagesready
```

## Example
Add ImagesReady (non-jQuery)
```html
<script src="imagesready.min.js"></script>
```
Add ImagesReady (jQuery – do not add `imagesready.min.js`)
```html
<script src="jquery.min.js"></script>
<script src="jquery-imagesready.min.js"></script>
```
Example HTML – ImagesReady will check all images within `container`
```html
<div class="container">
  <img src="foo.jpg">
  <div>
    <img src="bar.jpg">
    <a href="baz.html"><img src="baz.jpg"></a>
  </div>
</div>

<div class="container">
  <img src="biz.jpg">
</div>
```
Setup promise handlers. Both fulfilled and rejected handlers will be passed the `elements` that are provided to ImagesReady.
```javascript
// handle fulfilled promise – triggered
// when all images have loaded
function ready(elements) {
  console.log('Images are ready');
  // do something with elements
}

// handle rejected promise – triggered
// when one or more images fail to load
function error(elements) {
  console.log('Error');
  // do something with elements
}
```
Invoke ImagesReady (non-jQuery)
```javascript
var elements = document.querySelectorAll('.container');
imagesReady(elements).then(ready, error);
// `elements` will be passed to both `ready` and `error` handlers
```
Invoke ImagesReady (jQuery)
```javascript
$('.container').imagesReady().then(ready, error);
// $('.container') will be passed to both `ready` and `error` handlers
```

## Browser Support
- Chrome
- Firefox
- IE 9+
- Safari

## Module Support
- AMD
- CommonJS
- Browser global

## License
ImagesReady is free to use under the [open-source MIT license](https://github.com/r-park/images-ready/blob/master/LICENSE).
