// 'use strict';

// describe('myApp.user module', function() {
//
//   beforeEach(module('myApp.user'));
//
//   describe('about controller', function(){
//
//     it('should ....', inject(function($controller) {
//       //spec body
//       var userCtrl = $controller('UserCtrl');
//       expect(userCtrl).toBeDefined();
//     }));
//
//   });
// });


'use strict';

describe('myApp.user module', function() {
  // Load the module that contains the directive
  beforeEach(module('myApp.user'));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('user controller', function(){
    var $scope, controller, userServiceMock;
    beforeEach(function() {
      $scope = $rootScope.$new();
      userServiceMock = {
        getLocalUser : function() {
          return '{"id":104,"first_name":"","last_name":"","preferred_name":"","email":"89@gmail.com","realms":[]}'},
        updateUser : function(user) {}
      };

      controller = $controller('UserCtrl', { $scope: $scope, userService: userServiceMock});
    });

    // Individual tests...
    it('should initialize home controller', function() {
      expect(controller).toBeDefined();
      expect($scope.user).toEqual('{"id":104,"first_name":"","last_name":"","preferred_name":"","email":"89@gmail.com","realms":[]}');
    });

  });
});