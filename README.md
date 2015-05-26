# ImagesReady
ImagesReady is a lightweight utility for detecting when images have been loaded. It supports promises and can be used with or without jQuery.

## Browser Support
- Chrome 
- Firefox 
- IE 9+ 
- Safari

## Installation
**bower**
```
bower install images-ready
```
**npm**
```
npm install images-ready --save
```

## Example
```javascript
// imagesready.min.js

// handle resolved promise
function resolved(elements) {
  console.log('Success:', elements);
}

// handle rejected promise
function rejected() {
  console.log('Error');
}

var elements = document.querySelector('.container');

imagesReady(elements).then(resolved, rejected);
```

## jQuery Example
```javascript
// jquery-imagesready.js

// handle resolved jQuery promise
function resolved(elements) {
  console.log('Success:', elements);
}

// handle rejected jQuery promise
function rejected() {
  console.log('Error');
}

$('.container').imagesReady().then(resolved, rejected);
```

## License
ImagesReady is free to use under the [open-source MIT license](https://github.com/r-park/images-ready/blob/master/LICENSE).
