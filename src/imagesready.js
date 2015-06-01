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


/**
 * @name ImagesReady
 * @constructor
 *
 * @param {Element|Element[]|jQuery|NodeList|string} elements
 *
 * @param {{}}      [options]
 * @param {boolean} [options.jquery]
 *
 */
function ImagesReady(elements, options) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }

  this.elements = this.toArray(elements);
  this.images = this.findImageElements(this.elements);

  if (options && options.jquery) {
    this.deferred = new $.Deferred();
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

  /**
   * @param {Element[]} elements
   * @returns {HTMLImageElement[]}
   */
  findImageElements : function(elements) {
    var images = [],
        i = elements.length,
        element,
        imageElements;

    while (i--) {
      element = elements[i];

      if (element.nodeName === 'IMG') {
        images.push(element);
      }
      else if (element.nodeType && validNodeTypes[element.nodeType]) {
        imageElements = element.querySelectorAll('img');
        for (var n = 0, l = imageElements.length; n < l; ++n) {
          images[n] = imageElements[n];
        }
      }
    }

    return images;
  },


  /**
   * @param {string} imageSrc
   */
  proxy : function(imageSrc) {
    var image = new Image(),
        that = this;

    var cleanup = function() {
      image.removeEventListener('load', onload);
      image.removeEventListener('load', onerror);
      image = null;
    };

    image.addEventListener('load', function onload(){
      that.loaded++;
      that.update();
      cleanup();
    });

    image.addEventListener('error', function onerror(){
      that.update();
      cleanup();
    });

    image.src = imageSrc;
  },


  /**
   *
   */
  update : function() {
    this.verified++;

    if (this.total === this.verified) {
      if (this.total === this.loaded) {
        this.deferred.resolve(this.elements);
      }
      else {
        this.deferred.reject('FAIL');
      }

      this.clean();
    }
  },


  /**
   *
   */
  verify : function() {
    var images = this.images,
        i = -1,
        l = images.length,
        image;

    while (++i < l) {
      image = images[i];

      if (image.complete && image.naturalWidth) {
        this.loaded++;
        this.update();
      }
      else {
        this.proxy(image.src);
      }
    }
  },


  /**
   *
   */
  clean : function() {
    this.elements = null;
    this.images = null;
  },


  /**
   * {Element|Element[]|NodeList} object
   * @returns {Element[]}
   */
  toArray : function(object) {
    if (Array.isArray(object)) return object;

    if (typeof object.length === 'number') {
      return slice.call(object);
    }

    return [object];
  }

};
