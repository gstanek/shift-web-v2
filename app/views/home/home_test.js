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

  describe('home controller', function(){
    var $scope, controller, authServiceMock, locationMock;
    beforeEach(function() {
      $scope = $rootScope.$new();
      authServiceMock = {
          isAuthenticated : function() {},
          signup : function(credentials) {}
      };
    });

    // Individual tests...
    it('should initialize home controller', function() {
      locationMock = {
        search: function(){
          return {}
        }
      }
      controller = $controller('HomeCtrl', { $scope: $scope, authService: authServiceMock, $location: locationMock});
      expect(controller).toBeDefined();
    });

    it('should set $scope.email when it is passed in via uri', function() {
      locationMock = {
        search: function(){
          return { email: 'gabe.stanek@gmail.com'}
        }
      }
      controller = $controller('HomeCtrl', { $scope: $scope, authService: authServiceMock, $location: locationMock});
      expect(controller).toBeDefined();
      expect($scope.email).toEqual('gabe.stanek@gmail.com');
    });

    it('should set $scope.email to Email when it is not passed in via uri', function() {
      locationMock = {
        search: function(){
          return {}
        }
      }
      controller = $controller('HomeCtrl', { $scope: $scope, authService: authServiceMock, $location: locationMock});
      expect(controller).toBeDefined();
      expect($scope.email).toEqual('Email');
    });

  });
});