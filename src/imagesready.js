'use strict';


/**
 * @param {number} imageCount
 * @param {function} done
 * @returns {{failed: function, loaded: function}}
 */
function status(imageCount, done) {
  var loaded = 0,
      total = imageCount,
      verified = 0;

  function update() {
    if (total === verified) {
      done(total === loaded);
    }
  }

  return {

    /**
     * @param {number} count
     */
    failed : function(count) {
      verified += count;
      update();
    },


    /**
     * @param {number} count
     */
    loaded : function(count) {
      loaded += count;
      verified += count;
      update();
    }

  };
}


/**
 * @name ImagesReady
 * @constructor
 *
 * @param {DocumentFragment|Element|Element[]|jQuery|NodeList|string} elements
 * @param {{}} [options]
 * @param {boolean} [options.jquery=false]
 *
 */
function ImagesReady(elements, options) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
    if (!elements.length) {
      throw new Error('selector `' + elements + '` yielded 0 elements');
    }
  }

  var deferred = this.defer(options && options.jquery);

  var images = this.imageElements(
    this.validElements(this.toArray(elements), ImagesReady.VALID_NODE_TYPES)
  );

  var imageCount = images.length;

  if (imageCount) {
    this.verify(images, status(imageCount, function(ready){
      if (ready) {
        deferred.resolve(elements);
      }
      else {
        deferred.reject(elements);
      }
    }));
  }
  else {
    deferred.resolve(elements);
  }
}


ImagesReady.VALID_NODE_TYPES = {
  1  : true, // ELEMENT_NODE
  9  : true, // DOCUMENT_NODE
  11 : true  // DOCUMENT_FRAGMENT_NODE
};


ImagesReady.prototype = {

  /**
   * @param {boolean} jquery
   * @returns deferred
   */
  defer : function(jquery) {
    var deferred;

    if (jquery) {
      deferred = new $.Deferred();
      this.result = deferred.promise();
    }
    else {
      deferred = {};
      deferred.promise = new Promise(function(resolve, reject){
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      this.result = deferred.promise;
    }

    return deferred;
  },


  /**
   * @param {Element[]} elements
   * @returns {[]|HTMLImageElement[]}
   */
  imageElements : function(elements) {
    var images = [];

    elements.forEach(function(element){
      if (element.nodeName === 'IMG') {
        images.push(element);
      }
      else {
        var imageElements = element.querySelectorAll('img');
        for (var n = 0, l = imageElements.length; n < l; ++n) {
          images.push(imageElements[n]);
        }
      }
    });

    return images;
  },


  /**
   * @param {Element[]} elements
   * @param {{}} validNodeTypes
   * @returns {[]|Element[]}
   */
  validElements : function(elements, validNodeTypes) {
    return elements.filter(function(element){
      return validNodeTypes[element.nodeType];
    });
  },


  /**
   * @param {HTMLImageElement[]} images
   * @returns {[]|HTMLImageElement[]}
   */
  incompleteImages : function(images) {
    return images.filter(function(image){
      return !(image.complete && image.naturalWidth);
    });
  },


  /**
   * @param {function} onload
   * @param {function} onerror
   * @returns {function(HTMLImageElement)}
   */
  proxyImage : function(onload, onerror) {
    return function(image) {
      var _image = new Image();

      _image.addEventListener('load', onload);
      _image.addEventListener('error', onerror);
      _image.src = image.src;

      return _image;
    };
  },


  /**
   * @param {HTMLImageElement[]} images
   * @param {{failed: function, loaded: function}} status
   */
  verify : function(images, status) {
    var incomplete = this.incompleteImages(images);

    if (images.length > incomplete.length) {
      status.loaded(images.length - incomplete.length);
    }

    if (incomplete.length) {
      incomplete.forEach(this.proxyImage(
        function(){
          status.loaded(1);
        },
        function(){
          status.failed(1);
        }
      ));
    }
  },


  /**
   * @param {DocumentFragment|Element|Element[]|jQuery|NodeList} object
   * @returns {Element[]}
   */
  toArray : function(object) {
    if (Array.isArray(object)) {
      return object;
    }

    if (typeof object.length === 'number') {
      return [].slice.call(object);
    }

    return [object];
  }

};


/*=========================================================
  jQuery plugin
=========================================================*/
if (window.jQuery) {
  $.fn.imagesReady = function() {
    var instance = new ImagesReady(this, {jquery: true});
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
