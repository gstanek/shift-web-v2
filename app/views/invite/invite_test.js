'use strict';

describe('ShiftOnTapApp module', function() {
  // Load the module that contains the directive
  beforeEach(module('ShiftOnTapApp'));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('invite controller', function(){
    var $scope, controller;
    beforeEach(function() {
      $scope = $rootScope.$new();

      controller = $controller('InviteCtrl', { $scope: $scope});
    });

    // Individual tests...
    it('should initialize invite controller', function() {
      expect(controller).toBeDefined();

    });

  });
});