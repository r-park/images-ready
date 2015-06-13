describe("ImagesReady", function(){

  fixture.setBase('test');


  beforeEach(function(){
    fixture.load('fixture.html');
  });


  afterEach(function(){
    fixture.cleanup();
  });


  describe("Constructor", function(){
    it("should throw {Error} if zero elements are found using provided CSS selector", function(){
      expect(function(){
        new ImagesReady('.no-element', {auto: false});
      }).toThrow();
    });

    it("should set property `elements` with the elements resolved using provided CSS selector", function(){
      var imagesReady = new ImagesReady('#content-1', {auto: false});
      var elements = document.querySelectorAll('#content-1');

      expect(imagesReady.elements).toBeDefined();
      expect(imagesReady.elements.length).toBe(1);
      expect(imagesReady.elements).toEqual(elements);
    });

    it("should set property `elements` with the provided elements", function(){
      var elements = document.querySelectorAll('#content-1');
      var imagesReady = new ImagesReady(elements, {auto: false});

      expect(imagesReady.elements).toBeDefined();
      expect(imagesReady.elements.length).toBe(1);
      expect(imagesReady.elements).toEqual(elements);
    });

    it("should automatically invoke verification by default", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('#content-1');

      expect(imagesReady.verify.callCount).toBe(1);

      ImagesReady.prototype.verify.restore();
    });

    it("should not automatically invoke verification if `options.auto` is `false`", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('#content-1', {auto: false});

      expect(imagesReady.verify.callCount).toBe(0);

      ImagesReady.prototype.verify.restore();
    });

    it("should automatically fulfill promise when no image elements are found", function(done){
      var imagesReady = new ImagesReady('.empty', {auto: false});

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },
        function(){
          expect(false).toBe(true);
          done();
        });
    });
  });


  describe("Promises", function(){
    it("should set property `deferred`", function(){
      var imagesReady = new ImagesReady('#content-1', {auto: false});
      var deferred = imagesReady.deferred;

      expect(deferred).toBeDefined();
      expect(typeof deferred.resolve).toBe('function');
      expect(typeof deferred.reject).toBe('function');
    });

    it("should set property `result` with a deferred promise", function(){
      var imagesReady = new ImagesReady('#content-1', {auto: false});
      var result = imagesReady.result;

      expect(result).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it("should fulfill `result`", function(done){
      var imagesReady = new ImagesReady('#content-1', {auto: false});

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },
        function(){
          expect(false).toBe(true);
          done();
        });

      imagesReady.deferred.resolve();
    });

    it("should reject `result`", function(done){
      var imagesReady = new ImagesReady('#content-1', {auto: false});

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },
        function(){
          expect(true).toBe(true);
          done();
        });

      imagesReady.deferred.reject();
    });

    it("should set property `deferred` with jQuery.Deferred when `options.jquery` is `true`", function(){
      var imagesReady = new ImagesReady('#content-1', {auto: false, jquery: true});
      var deferred = imagesReady.deferred;

      expect(deferred).toBeDefined();
      expect(typeof deferred.resolve).toBe('function');
      expect(typeof deferred.reject).toBe('function');
    });

    it("should set property `result` with jQuery.Deferred promise when `options.jquery` is `true`", function(){
      var imagesReady = new ImagesReady('#content-1', {auto: false, jquery: true});
      var result = imagesReady.result;

      expect(result).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it("should fulfill `result` (jQuery)", function(done){
      var imagesReady = new ImagesReady('#content-1', {auto: false, jquery: true});

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },
        function(){
          expect(false).toBe(true);
          done();
        });

      imagesReady.deferred.resolve();
    });

    it("should reject `result` (jQuery)", function(done){
      var imagesReady = new ImagesReady('#content-1', {auto: false, jquery: true});

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },
        function(){
          expect(true).toBe(true);
          done();
        });

      imagesReady.deferred.reject();
    });
  });


  describe("Finding images", function(){
    function toArray(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    }

    function getImages(elements) {
      if (typeof elements.length !== 'number') {
        elements = [elements];
      }
      var images = [];
      for (var i = 0, l = elements.length; i < l; ++i) {
        images = images.concat(toArray(elements[i].querySelectorAll('img')));
      }
      return images;
    }

    function compareLists(list1, list2) {
      if (!list1.length) return false;
      if (list1.length !== list2.length) return false;

      for (var i = 0, l = list1.length; i < l; ++i) {
        if(list1.indexOf(list2[i]) === -1) return false;
      }

      return true;
    }

    it("should find images when `elements` is a CSS selector", function(){
      var elements = '#content-1';
      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = getImages(document.querySelector(elements));

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });

    it("should find images when `elements` is a single HTMLElement", function(){
      var elements = document.querySelector('#content-1');
      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = getImages(document.querySelector('#content-1'));

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });

    it("should find images when `elements` is an array of HTMLElements", function(){
      var elements = [document.querySelector('#content-1'), document.querySelector('#content-2')];
      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = getImages(elements);

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });

    it("should find images when `elements` is jQuery", function(){
      var elements = $('.content');
      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = getImages(document.querySelectorAll('.content'));

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });

    it("should find images when `elements` is a NodeList", function(){
      var elements = document.querySelectorAll('.content');
      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = getImages(elements);

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });

    it("should find images when `elements` is a HTMLImageElement", function(){
      var elements = document.querySelectorAll('.image');
      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = elements;

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });

    it("should find images when `elements` is a DocumentFragment", function(){
      var elements = document.createDocumentFragment();
      elements.appendChild(new Image());
      elements.appendChild(new Image());

      var imagesReady = new ImagesReady(elements, {auto: false});
      var images = getImages(elements);

      expect(compareLists(imagesReady.images, images)).toBe(true);
    });
  });


  describe("Verification", function(){
    it("should fulfill promise when image is already loaded (cached)", function(done){
      var imagesReady = new ImagesReady('#content-1', {auto: false});
      imagesReady.images = [{complete: true, naturalWidth: 100}, {complete: true, naturalWidth: 100}];
      imagesReady.total = imagesReady.images.length;

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });

      imagesReady.verify();
    });

    it("should fulfill promise when all images have loaded", function(done){
      var imagesReady = new ImagesReady('.content');

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });

    it("should reject promise when one or more images have failed to load", function(done){
      var imagesReady = new ImagesReady('.fail');

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },function(){
          expect(true).toBe(true);
          done();
        });
    });

    it("should fulfill promise for image with data-uri sources", function(done){
      var element = document.querySelector('.data-uri');
      var imagesReady = new ImagesReady(element);

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },
        function(){
          expect(false).toBe(true);
          done();
        }
      );
    });
  });


  describe("Verification using proxy images", function(done){
    it("should delegate to proxy verification when image.complete is not `true`", function(){
      sinon.spy(ImagesReady.prototype, 'verifyByProxy');

      var imagesReady = new ImagesReady('#content-1', {auto: false});
      imagesReady.images = [{complete: false, naturalWidth: 100}];
      imagesReady.verify();

      expect(imagesReady.verifyByProxy.callCount).toBe(1);

      ImagesReady.prototype.verifyByProxy.restore();
    });

    it("should delegate to proxy verification when image.naturalWidth is not greater than zero", function(){
      sinon.spy(ImagesReady.prototype, 'verifyByProxy');

      var imagesReady = new ImagesReady('#content-1', {auto: false});
      imagesReady.images = [{complete: true, naturalWidth: 0}];
      imagesReady.verify();

      expect(imagesReady.verifyByProxy.callCount).toBe(1);

      ImagesReady.prototype.verifyByProxy.restore();
    });

    it("should fulfill promise when all proxy images have been loaded", function(){
      var imagesReady = new ImagesReady('#content-1', {auto: false});
      var imageSources = ['base/test/images/1.jpg', 'base/test/images/2.jpg'];

      imagesReady.total = imageSources.length;

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });

      imageSources.forEach(function(src){
        imagesReady.verifyByProxy(src);
      });
    });

    it("should reject promise when one or more proxy images have failed to load", function(done){
      var imagesReady = new ImagesReady('#content-1', {auto: false});
      var imageSources = ['base/test/images/1.jpg', 'foo'];

      imagesReady.total = imageSources.length;

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },function(){
          expect(true).toBe(true);
          done();
        });

      imageSources.forEach(function(src){
        imagesReady.verifyByProxy(src);
      });
    });
  });


  describe("Verification results", function(){
    it("should fulfill promise with provided elements", function(done){
      var elements = document.querySelectorAll('.content');
      var imagesReady = new ImagesReady(elements);

      imagesReady.result.then(
        function(_elements_){
          expect(_elements_).toBe(elements);
          done();
        },
        function(){
          expect(false).toBe(true);
          done();
        }
      );
    });

    it("should reject promise with provided elements", function(done){
      var elements = document.querySelector('.fail');
      var imagesReady = new ImagesReady(elements);

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },
        function(_elements_){
          expect(_elements_).toBe(elements);
          done();
        }
      );
    });
  });


  describe("Default entry point", function(){
    it("should return a promise", function(){
      var promise = imagesReady('.content');
      expect(typeof promise.then).toBe('function');
    });
  });


  describe("jQuery plugin entry point", function(){
    it("should return a promise", function(){
      var promise = $('.content').imagesReady();
      expect(typeof promise.then).toBe('function');
    });
  });

});
