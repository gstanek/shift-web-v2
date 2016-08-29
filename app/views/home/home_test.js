'use strict';

describe('myApp.home module', function() {
  // Load the module that contains the directive
  beforeEach(module('myApp.home'));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('home controller', function(){
    var $scope, controller, authServiceMock;
    beforeEach(function() {
      $scope = $rootScope.$new();
      authServiceMock = {
          isAuthenticated : function() {},
          signup : function(credentials) {}
      };

      controller = $controller('HomeCtrl', { $scope: $scope, authService: authServiceMock});
    });

    // Individual tests...
    it('should initialize home controller', function() {
      expect(controller).toBeDefined();
      expect($scope.credentials).toEqual({});
      expect($scope.showpassword).toEqual(false);
    });

  });
});