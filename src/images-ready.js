'use strict';


var slice = Array.prototype.slice;


var validNodeTypes = {
  1  : true,
  9  : true,
  11 : true
};


function defer() {
  var deferred = {};
  deferred.promise = new Promise(function(resolve, reject){
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}



function ImagesReady(elements, options) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }

  this.elements = this.toArray(elements);
  this.images = this.findImageElements(this.elements);

  if (options.jquery) {
    this.deferred = $.Deferred();
    this.result = this.deferred.promise();
  }
  else {
    this.deferred = defer();
    this.result = this.deferred.promise;
  }

  this.total = this.images.length;
  this.loaded = 0;
  this.verified = 0;

  this.verify();
}


ImagesReady.prototype = {

  clean : function() {
    this.elements = null;
    this.images = null;
  },


  toArray : function(object) {
    if (Array.isArray(object)) return object;

    if (typeof object.length === 'number') {
      return slice.call(object);
    }

    return [object];
  },


  findImageElements : function(elements) {
    var images = [],
        i = elements.length,
        element,
        imageElements;

    while (i--) {
      element = elements[i];

      if ('IMG' === element.nodeName) {
        images.push(element);
      }
      else if (element.nodeType && validNodeTypes[element.nodeType]) {
        imageElements = element.querySelectorAll('img');
        if (imageElements.length) {
          images.push.apply(images, slice.call(imageElements));
        }
      }
    }

    return images;
  },


  proxy : function(src) {
    var image = new Image(),
        that = this;

    image.addEventListener('load', function(){
      that.loaded++;
      that.update();
      image = null;
    });

    image.addEventListener('error', function(){
      that.update();
      image = null;
    });

    image.src = src;
  },


  update : function() {
    this.verified++;

    if (this.total === this.verified) {
      if (this.total === this.loaded) {
        console.log('SUCCESS');
        this.deferred.resolve(this.elements);
      }
      else {
        console.log('FAIL');
        this.deferred.reject('FAIL');
      }

      this.clean();
    }
  },


  verify : function() {
    var images = this.images,
        i = -1,
        l = images.length,
        image;

    while (++i < l) {
      image = images[i];

      if (image.complete && image.naturalWidth) {
        console.log('complete:', image);
        this.loaded++;
        this.update();
      }
      else {
        console.log('proxying:', image);
        this.proxy(image.src);
      }
    }
  }

};
