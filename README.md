[![Build Status](https://travis-ci.org/r-park/images-ready.svg?branch=master)](https://travis-ci.org/r-park/images-ready)
[![Coverage Status](https://coveralls.io/repos/r-park/images-ready/badge.svg?branch=master)](https://coveralls.io/r/r-park/images-ready?branch=master)

# ImagesReady
ImagesReady is a lightweight utility for detecting when images have been loaded. It supports promises and can be used with or without jQuery.

## Installation
**bower**
```bash
bower install imagesready
```
**npm**
```bash
npm install imagesready --save
```

## Example
```javascript
// imagesready.min.js

// handle fulfilled promise
function ready(elements) {
  console.log('Success:', elements);
}

// handle rejected promise
function error() {
  console.log('Error');
}

var elements = document.querySelector('.container');

imagesReady(elements).then(ready, error);
```

## jQuery Example
```javascript
// jquery-imagesready.min.js

// handle fulfilled jQuery promise
function ready(elements) {
  console.log('Success:', elements);
}

// handle rejected jQuery promise
function error() {
  console.log('Error');
}

$('.container').imagesReady().then(ready, error);
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
