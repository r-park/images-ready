describe("ImagesReady", function(){

  fixture.setBase('test');


  beforeEach(function(){
    fixture.load('fixture.html');
  });


  afterEach(function(){
    fixture.cleanup();
  });


  function getElements(selector) {
    var elements = document.querySelectorAll(selector);
    return [].slice.call(elements);
  }


  describe("Constructor", function(){
    it("should throw {Error} if zero elements are found using provided CSS selector", function(){
      expect(function(){
        new ImagesReady('.no-element');
      }).toThrow();
    });


    it("should invoke verification method if image elements are found", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('#content-1');

      expect(imagesReady.verify.callCount).toBe(1);

      ImagesReady.prototype.verify.restore();
    });


    it("should invoke verification method with the list of found image elements", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var images = getElements('#content-1 img');
      var imagesReady = new ImagesReady('#content-1');

      expect(imagesReady.verify.calledWith(images)).toBe(true);

      ImagesReady.prototype.verify.restore();
    });


    it("should invoke verification method with status object", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('#content-1');
      var statusArg = imagesReady.verify.args[0][1];

      expect(typeof statusArg.failed).toBe('function');
      expect(typeof statusArg.loaded).toBe('function');

      ImagesReady.prototype.verify.restore();
    });


    it("should skip verification method if image elements are not found", function(){
      sinon.spy(ImagesReady.prototype, 'verify');

      var imagesReady = new ImagesReady('.empty');

      expect(imagesReady.verify.callCount).toBe(0);

      ImagesReady.prototype.verify.restore();
    });


    it("should automatically fulfill promise if image elements are not found", function(done){
      var imagesReady = new ImagesReady('.empty');

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


  describe("Finding valid elements", function(){
    it("should return a filtered list of valid elements", function(){
      var elementNode = document.createElement('div'),
          documentFragmentNode = document.createDocumentFragment(),
          documentNode = document.documentElement,
          textNode = document.createTextNode('text');

      var elements = [elementNode, documentFragmentNode, documentNode, textNode];

      var result = ImagesReady.prototype.validElements(elements, ImagesReady.VALID_NODE_TYPES);

      expect(result.length).toBe(3);
      expect(result.indexOf(textNode)).toBe(-1);
    });
  });


  describe("Finding image elements", function(){

    beforeEach(function(){
      sinon.spy(ImagesReady.prototype, 'imageElements');
    });


    afterEach(function(){
      ImagesReady.prototype.imageElements.restore();
    });


    it("should find images from a CSS selector", function(){
      var elements = '#content-1';
      var imagesReady = new ImagesReady(elements);
      var images = getElements('#content-1 img');

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });


    it("should find images from a single HTMLElement", function(){
      var elements = document.querySelector('#content-1');
      var imagesReady = new ImagesReady(elements);
      var images = getElements('#content-1 img');

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });


    it("should find images from a Array.<HTMLElement>", function(){
      var elements = [document.querySelector('#content-1'), document.querySelector('#content-2')];
      var imagesReady = new ImagesReady(elements);
      var images = getElements('#content-1 img, #content-2 img');

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });


    it("should find images from a jQuery-wrapped collection", function(){
      var elements = $('.content');
      var imagesReady = new ImagesReady(elements);
      var images = getElements('.content img');

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });


    it("should find images from a NodeList", function(){
      var elements = document.querySelectorAll('.content');
      var imagesReady = new ImagesReady(elements);
      var images = getElements('.content img');

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });


    it("should find images from a HTMLImageElement", function(){
      var elements = document.querySelectorAll('.image');
      var imagesReady = new ImagesReady(elements);
      var images = getElements('.image');

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });


    it("should find images from a DocumentFragment", function(){
      var elements = document.createDocumentFragment();
      elements.appendChild(new Image());
      elements.appendChild(new Image());

      var imagesReady = new ImagesReady(elements);
      var images = [elements.children[0], elements.children[1]];

      expect(imagesReady.imageElements.returned(images)).toBe(true);
    });
  });


  describe("Verifying images", function(){
    it("should fulfill promise when images are already loaded (cached)", function(done){
      var image = {complete: true, naturalWidth: 100, nodeName: 'IMG', nodeType: 1};
      var imagesReady = new ImagesReady(image);

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
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


    it("should fulfill promise when image src is a data-uri", function(done){
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


  describe("Verifying images – jQuery", function(){
    it("should fulfill promise when images are already loaded (cached)", function(done){
      var image = {complete: true, naturalWidth: 100, nodeName: 'IMG', nodeType: 1};
      var imagesReady = new ImagesReady(image, {jquery: true});

      imagesReady.result.then(
        function(){
          expect(true).toBe(true);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should fulfill promise when all images have loaded", function(done){
      var imagesReady = new ImagesReady('.content', {jquery: true});

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
      var imagesReady = new ImagesReady('.fail', {jquery: true});

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },function(){
          expect(true).toBe(true);
          done();
        });
    });


    it("should fulfill promise when image src is a data-uri", function(done){
      var element = document.querySelector('.data-uri');
      var imagesReady = new ImagesReady(element, {jquery: true});

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


  describe("Verifying with proxy images", function(){

    beforeEach(function(){
      sinon.spy(ImagesReady.prototype, 'proxyImage');
    });


    afterEach(function(){
      ImagesReady.prototype.proxyImage.restore();
    });


    it("should attempt proxy verification when image.complete is not true", function(done){
      var image = {complete: false, naturalWidth: 100, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'};

      var imagesReady = new ImagesReady(image);

      imagesReady.result.then(
        function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should attempt proxy verification when image.naturalWidth is not greater than 0", function(done){
      var image = {complete: true, naturalWidth: 0, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'};

      var imagesReady = new ImagesReady(image);

      imagesReady.result.then(
        function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should fulfill promise when all proxy images have loaded", function(done){
      var images = [
        {complete: false, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'},
        {complete: false, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/2.jpg'}
      ];

      var imagesReady = new ImagesReady(images);

      imagesReady.result.then(
        function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should reject promise when one or more proxy images have failed to load", function(done){
      var images = [
        {complete: false, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'},
        {complete: false, nodeName: 'IMG', nodeType: 1, src: 'foo'}
      ];

      var imagesReady = new ImagesReady(images);

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          expect(true).toBe(true);
          done();
        });
    });
  });


  describe("Verifying with proxy images – jQuery", function(){

    beforeEach(function(){
      sinon.spy(ImagesReady.prototype, 'proxyImage');
    });


    afterEach(function(){
      ImagesReady.prototype.proxyImage.restore();
    });


    it("should attempt proxy verification when image.complete is not true", function(done){
      var image = {complete: false, naturalWidth: 100, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'};

      var imagesReady = new ImagesReady(image, {jquery: true});

      imagesReady.result.then(
        function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should attempt proxy verification when image.naturalWidth is not greater than 0", function(done){
      var image = {complete: true, naturalWidth: 0, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'};

      var imagesReady = new ImagesReady(image, {jquery: true});

      imagesReady.result.then(
        function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should fulfill promise when all proxy images have loaded", function(done){
      var images = [
        {complete: false, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'},
        {complete: false, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/2.jpg'}
      ];

      var imagesReady = new ImagesReady(images, {jquery: true});

      imagesReady.result.then(
        function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          done();
        },function(){
          expect(false).toBe(true);
          done();
        });
    });


    it("should reject promise when one or more proxy images have failed to load", function(done){
      var images = [
        {complete: false, nodeName: 'IMG', nodeType: 1, src: '/base/test/images/1.jpg'},
        {complete: false, nodeName: 'IMG', nodeType: 1, src: 'foo'}
      ];

      var imagesReady = new ImagesReady(images, {jquery: true});

      imagesReady.result.then(
        function(){
          expect(false).toBe(true);
          done();
        },function(){
          expect(imagesReady.proxyImage.callCount).toBe(1);
          expect(true).toBe(true);
          done();
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
