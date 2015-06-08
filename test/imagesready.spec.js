describe("ImagesReady", function(){

  describe("Constructor", function(){
    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
      jasmine.getFixtures().load('constructor.html');
    });


    it("should accept `elements` as a CSS selector", function(){
      var selectors = ['.container-1', '#container-1'];

      selectors.forEach(function(selector){
        var imagesReady = new ImagesReady(selector, {auto: false});
        expect(imagesReady.elements.length).toBe(1);
        expect(imagesReady.elements[0]).toBe(document.querySelector(selector));
      });
    });


    it("should accept `elements` as a single {HTMLElement}", function(){
      var element = document.querySelector('#container-1');
      var imagesReady = new ImagesReady(element, {auto: false});

      expect(imagesReady.elements.length).toBe(1);
      expect(imagesReady.elements[0]).toBe(element);
    });


    it("should accept `elements` as an array of {HTMLElement}", function(){
      var elements = [document.querySelector('#container-1'), document.querySelector('#container-2')];
      var imagesReady = new ImagesReady(elements, {auto: false});

      expect(imagesReady.elements.length).toBe(2);
      expect(imagesReady.elements[0]).toBe(elements[0]);
      expect(imagesReady.elements[1]).toBe(elements[1]);
    });


    it("should accept `elements` as jQuery", function(){
      var elements = $('.container');
      var imagesReady = new ImagesReady(elements, {auto: false});

      expect(imagesReady.elements.length).toBe(2);
      expect(imagesReady.elements[0]).toBe(elements[0]);
      expect(imagesReady.elements[1]).toBe(elements[1]);
    });


    it("should accept `elements` as a {NodeList}", function(){
      var elements = document.querySelectorAll('.container');
      var imagesReady = new ImagesReady(elements, {auto: false});

      expect(imagesReady.elements.length).toBe(2);
      expect(imagesReady.elements[0]).toBe(elements[0]);
      expect(imagesReady.elements[1]).toBe(elements[1]);
    });


    it("should accept `elements` as {HTMLImageElement}", function(){
      var elements = document.querySelectorAll('.image');
      var imagesReady = new ImagesReady(elements, {auto: false});

      expect(imagesReady.elements.length).toBe(2);
      expect(imagesReady.elements[0]).toBe(elements[0]);
      expect(imagesReady.elements[1]).toBe(elements[1]);
    });


    it("should set `deferred`", function(){
      var imagesReady = new ImagesReady('.container', {auto: false});
      var deferred = imagesReady.deferred;

      expect(deferred).toBeDefined();
      expect(deferred.promise).toBeDefined();
      expect(typeof deferred.promise).not.toBe('function');
      expect(typeof deferred.resolve).toBe('function');
      expect(typeof deferred.reject).toBe('function');
    });


    it("should set `result` with a promise", function(){
      var imagesReady = new ImagesReady('.container', {auto: false});
      var result = imagesReady.result;

      expect(result).toBeDefined();
      expect(typeof result.then).toBe('function');
    });


    it("should set `deferred` with a jQuery deferred if `options.jquery` is `true`", function(){
      var imagesReady = new ImagesReady('.container', {auto: false, jquery: true});
      var deferred = imagesReady.deferred;

      expect(deferred).toBeDefined();
      expect(typeof deferred.promise).toBe('function');
      expect(typeof deferred.resolve).toBe('function');
      expect(typeof deferred.reject).toBe('function');
    });


    it("should set `result` with a jQuery promise if `options.jquery` is `true`", function(){
      var imagesReady = new ImagesReady('.container', {auto: false, jquery: true});
      var result = imagesReady.result;

      expect(result).toBeDefined();
      expect(typeof result.then).toBe('function');
    });


    it("should automatically invoke verification by default", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('.container');

      expect(imagesReady.verify.calledOnce).toBe(true);

      ImagesReady.prototype.verify.restore();
    });


    it("should not automatically invoke verification if `options.auto` is `false`", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('.container', {auto: false});

      expect(imagesReady.verify.callCount).toBe(0);

      ImagesReady.prototype.verify.restore();
    });
  });


  describe("Finding image elements", function(){
    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
      jasmine.getFixtures().load('constructor.html');
    });


    it("should return an array of {HTMLImageElement} that are children of provided element", function(){
      var element = document.querySelector('#container-1');
      var images = element.querySelectorAll('img');
      var imagesReady = new ImagesReady('.empty', {auto: false});
      var foundImages = imagesReady.findImageElements([element]);

      expect(foundImages.length).toBe(images.length);

      for (var i = 0, l = images.length; i < l; ++i) {
        expect(foundImages.indexOf(images[i])).not.toBe(-1);
      }
    });


    it("should return an array of {HTMLImageElement} that are children of multiple elements", function(){
      var elements = [
        document.querySelector('#container-1'),
        document.querySelector('#container-2')
      ];

      var imagesReady = new ImagesReady('.empty', {auto: false});
      var foundImages = imagesReady.findImageElements(elements);

      expect(foundImages.length).toBe(4);
    });


    it("should return an array of provided {HTMLImageElement}", function(){
      var images = document.querySelectorAll('.image');
      var imagesReady = new ImagesReady('.empty', {auto: false});
      var foundImages = imagesReady.findImageElements(images);

      expect(foundImages.length).toBe(images.length);

      for (var i = 0, l = images.length; i < l; ++i) {
        expect(foundImages.indexOf(images[i])).not.toBe(-1);
      }
    });
  });


  describe("Verifying", function(){
    it("should fulfill promise when all images are already loaded", function(done){
      var imagesReady = new ImagesReady('.empty', {auto: false});
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


    it("should delegate to proxy verification when image is not already loaded", function(){
      sinon.spy(ImagesReady.prototype, 'verifyByProxy');

      var imagesReady = new ImagesReady('.empty', {auto: false});
      imagesReady.images = [{complete: false, naturalWidth: 100}, {complete: true, naturalWidth: 0}];
      imagesReady.verify();

      expect(imagesReady.verifyByProxy.callCount).toBe(2);

      ImagesReady.prototype.verifyByProxy.restore();
    });
  });


  describe("Verifying with proxy images", function(){
    it("should fulfill promise when all proxy images have been loaded", function(done){
      var imageSources = ['base/test/images/1.jpg', 'base/test/images/2.jpg'];
      var imagesReady = new ImagesReady('.empty', {auto: false});

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
      var imageSources = ['base/test/images/1.jpg', 'foo'];
      var imagesReady = new ImagesReady('.empty', {auto: false});

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
    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
      jasmine.getFixtures().load('verification.html');
    });


    it("should fulfill promise with provided elements", function(done){
      var elements = document.querySelectorAll('.container');
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


    it("should reject promise", function(done){
      var element = document.querySelector('.errors');
      var imagesReady = new ImagesReady(element);

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },
        function(){
          expect(true).toBe(true);
          done();
        }
      );
    });


    it("should fulfill promise for images with data-uri sources", function(done){
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


    it("should fulfill promise for images in {DocumentFragment} elements", function(done){
      var fragment = document.createDocumentFragment();
      var image = document.createElement('img');
      image.src = 'base/test/images/1.jpg';
      fragment.appendChild(image);

      var imagesReady = new ImagesReady(fragment);

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


    it("should reject promise for failed images in {DocumentFragment} elements", function(done){
      var fragment = document.createDocumentFragment();
      var image = document.createElement('img');
      image.src = 'foo.jpg';
      fragment.appendChild(image);

      var imagesReady = new ImagesReady(fragment);

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },
        function(){
          expect(true).toBe(true);
          done();
        }
      );
    });
  });


  describe("Default entry point", function(){
    it("should return a promise", function(){
      var promise = imagesReady('.empty');
      expect(typeof promise.then).toBe('function');
    });
  });


  describe("jQuery plugin entry point", function(){
    it("should return a promise", function(){
      var promise = $('.empty').imagesReady();
      expect(typeof promise.then).toBe('function');
    });
  });

});
