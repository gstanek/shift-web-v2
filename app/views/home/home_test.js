'use strict';

describe('myApp.home module', function() {
  beforeEach(module('myApp.home'));

  describe('home controller', function(){
    it('should initialize home controller', inject(function($controller) {
      //spec body
      var homeCtrl = $controller('HomeCtrl');
      expect(homeCtrl).toBeDefined();
      expect(homeCtrl.credentials.email).toEqual('');
      expect(homeCtrl.credentials.password).toEqual('');


    }));

  });
});