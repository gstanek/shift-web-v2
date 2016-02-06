'use strict';

describe('myApp.about module', function() {

  beforeEach(module('myApp.contact'));

  describe('contact controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var contactCtrl = $controller('ContactCtrl');
      expect(contactCtrl).toBeDefined();
    }));

  });
});