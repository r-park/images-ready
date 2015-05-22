# ImagesReady
Promises/A+

## Getting Started
#### bower
```
bower install images-ready
```
#### npm
```
npm install images-ready --save
```

## Example
```javascript
// handler for resolved promise
function resolved(elements) {
  console.log('Success:', elements);
}

// handler for rejected promise
function rejected() {
  console.log('Error');
}

var elements = document.querySelector('.container');

imagesReady(elements).then(resolved, rejected);
```

## jQuery Example
```javascript
// handler for resolved jQuery promise
function resolved(elements) {
  console.log('Success:', elements);
}

// handler for rejected jQuery promise
function rejected() {
  console.log('Error');
}

$('.container')
  .imagesReady()
  .then(resolved, rejected);
```
