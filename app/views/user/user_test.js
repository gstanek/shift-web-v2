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

  describe('user controller', function(){
    var $scope, controller, userServiceMock, notificationMock;
    beforeEach(function() {
      $scope = $rootScope.$new();
      userServiceMock = {
        getLocalUser : function() {
          return {"id":104,"first_name":"","last_name":"","preferred_name":"","email":"89@gmail.com","realms":[]}
        },
        updateUser : function(user) {
          return {"id":104,"first_name":"","last_name":"","preferred_name":"","email":"89@gmail.com","realms":[]}
        }
      };

      notificationMock = {
        error : function(){},
        success: function(){}
      }

      controller = $controller('UserCtrl', { $scope: $scope, userService: userServiceMock, Notification: notificationMock});

    });

    // Individual tests...
    it('should initialize user controller', function() {
      expect(controller).toBeDefined();
      expect($scope.user).toEqual({"id":104,"first_name":"","last_name":"","preferred_name":"","email":"89@gmail.com","realms":[]});
    });

  });
});