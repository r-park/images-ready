/* imagesready v0.1.8 - 2015-06-13T01:21:18.035Z - https://github.com/r-park/images-ready */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.imagesReady = factory();
  }
}(this, function() {
'use strict';


var validNodeTypes = {
  1  : true, // ELEMENT_NODE
  9  : true, // DOCUMENT_NODE
  11 : true  // DOCUMENT_FRAGMENT_NODE
};


/**
 * @name ImagesReady
 * @constructor
 *
 * @param {DocumentFragment|Element|Element[]|jQuery|NodeList|string} elements
 *
 * @param {{}}      [options]
 * @param {boolean} [options.auto] - used for testing only
 * @param {boolean} [options.jquery]
 *
 */
function ImagesReady(elements, options) {
  options = options || {};

  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
    if (!elements.length) {
      throw new Error('0 elements were found using selector `' + elements + '`');
    }
  }

  var images = this.findImageElements(this.toList(elements));
  var total = images.length;

  this.defer(options.jquery);

  if (images.length) {
    this.elements = elements;
    this.images = images;
    this.total = total;
    this.loaded = 0;
    this.verified = 0;

    if (options.auto !== false) {
      this.verify();
    }
  }
  else {
    this.deferred.resolve(elements);
  }
}


ImagesReady.prototype = {

  /**
   * @param {boolean} jquery
   */
  defer : function(jquery) {
    var deferred,
        result;

    if (jquery) {
      deferred = new $.Deferred();
      result = deferred.promise();
    }
    else {
      deferred = {};
      deferred.promise = new Promise(function(resolve, reject){
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      result = deferred.promise;
    }

    this.deferred = deferred;
    this.result = result;
  },


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
      else if (validNodeTypes[element.nodeType]) {
        imageElements = element.querySelectorAll('img');
        for (var n = 0, l = imageElements.length; n < l; ++n) {
          images.push(imageElements[n]);
        }
      }
    }

    return images;
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
        this.deferred.reject(this.elements);
      }

      this.clean();
    }
  },


  /**
   *
   */
  verify : function() {
    var images = this.images,
        i = images.length,
        image;

    while (i--) {
      image = images[i];

      if (image.complete && image.naturalWidth) {
        this.loaded++;
        this.update();
      }
      else {
        this.verifyByProxy(image.src);
      }
    }
  },


  /**
   * @param {string} imageSrc
   */
  verifyByProxy : function(imageSrc) {
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
  clean : function() {
    this.elements = null;
    this.images = null;
    this.providedElements = null;
  },


  /**
   * @param {Element|Element[]|jQuery|NodeList} object
   * @returns {Element[]|jQuery|NodeList}
   */
  toList : function(object) {
    if (typeof object.length === 'number') return object;
    return [object];
  }

};


/*=========================================================
  jQuery plugin
=========================================================*/
if (window.jQuery) {
  $.fn.imagesReady = function() {
    var instance = new ImagesReady(this, {jquery: true}); // eslint-disable-line no-shadow
    return instance.result;
  };
}


/*=========================================================
  Default entry point
=========================================================*/
function imagesReady(elements) { // eslint-disable-line no-unused-vars
  var instance = new ImagesReady(elements);
  return instance.result;
}

return imagesReady;
}));
