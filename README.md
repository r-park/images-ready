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
npm install imagesready
```

## Example
Add ImagesReady and setup your HTML
```html
<script src="imagesready.min.js"></script>

<div class="container">
  <img src="foo.jpg">
  <div>
    <img src="bar.jpg">
    <a href="baz.html"><img src="baz.jpg"></a>
  </div>
</div>
```
```javascript
// handle fulfilled promise – triggered when all images have loaded
function ready(elements) {
  console.log('Images are ready:', elements);
}

// handle rejected promise – triggered when one or more images fail to load
function error() {
  console.log('Error');
}

var container = document.querySelector('.container');

imagesReady(container).then(ready, error);
```

## jQuery Example
Add jQuery and the plugin version of ImagesReady to your HTML. Do not add `imagesready.min.js`.
```html
<script src="jquery.min.js"></script>
<script src="jquery-imagesready.min.js"></script>
```
```javascript
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
