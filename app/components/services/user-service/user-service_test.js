'use strict';

describe('ShiftOnTapApp module', function() {
  var userService, httpBackend;

  // Load the module that contains the service
  beforeEach(module('ShiftOnTapApp'));

  var $controller, $rootScope;

  beforeEach(inject(function(_userService_, _$httpBackend_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    userService = _userService_;
    httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

  }));

  describe('userService tests', function(){
    var userRequestHandler;

    beforeEach(inject(function (_userService_, $httpBackend) {
      userService = _userService_;
      httpBackend = $httpBackend;

      // Set up the mock http service responses
      // $httpBackend = $injector.get('$httpBackend');
      // backend definition common for all tests
      userRequestHandler = httpBackend.whenRoute('PATCH', 'http://127.0.0.1:8000/api/v1/user/:id')//'/api/v1/user/:id')
          .respond(function(method, url, data, headers, params) {
            return [200, {"id":params.id,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
          });
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    describe('updateUser', function() {
      it('should return updated user', function () {
        var user = {
          "id": '123',
          "first_name": "Gabriel",
          "last_name": "Stanek",
          "preferred_name": "Gabe A",
          "email": "115@gmail.com",
          "is_active": true,
          "is_admin": false,
          "realms": [130]
        };
        userService.updateUser(user).then(function (returnedUser) {
          expect(returnedUser).toEqual({
            "id": '123',
            "first_name": "Gabriel",
            "last_name": "Stanek",
            "preferred_name": "Gabe A",
            "email": "115@gmail.com",
            "is_active": true,
            "is_admin": false,
            "realms": [130]
          });
        });
        httpBackend.flush();
      });

      // Next test goes here for updateUser...

    });

    // next method test set goes her in another describe block
  });
});