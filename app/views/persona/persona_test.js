'use strict';

describe('ShiftOnTapApp module', function() {
  beforeEach(module('ShiftOnTapApp'));

  var controller, rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    controller = _$controller_;
    rootScope = _$rootScope_;
  }));

  describe('persona controller', function(){
    var scope, controllerInstance, shiftServiceMock, $uibModalMock, commonServiceMock, userServiceMock;
    beforeEach(function() {
      // The injector unwraps the underscores (_) from around the parameter names when matching

      scope = rootScope.$new();

      shiftServiceMock = {
        getLocalShifts : function() {
          return [{"id":79,"start_datetime":"2016-12-12T02:00:00Z","end_datetime":"2016-12-12T02:15:00Z","available":true,"user":164,"realm":130,"comment":""},{"id":80,"start_datetime":"2017-01-02T23:00:00Z","end_datetime":"2017-01-02T23:15:00Z","available":false,"user":259,"realm":130,"comment":""},{"id":81,"start_datetime":"2017-01-11T13:00:00Z","end_datetime":"2017-01-11T13:15:00Z","available":false,"user":164,"realm":130,"comment":""},{"id":82,"start_datetime":"2017-01-11T13:00:00Z","end_datetime":"2017-01-11T13:15:00Z","available":false,"user":164,"realm":130,"comment":"2nd Shift"},{"id":83,"start_datetime":"2017-01-11T13:00:00Z","end_datetime":"2017-01-11T13:15:00Z","available":true,"user":164,"realm":130,"comment":"3rd"},{"id":84,"start_datetime":"2017-01-11T13:00:00Z","end_datetime":"2017-01-11T13:15:00Z","available":false,"user":164,"realm":130,"comment":"4th"},{"id":85,"start_datetime":"2017-01-11T13:00:00Z","end_datetime":"2017-01-11T13:30:00Z","available":false,"user":270,"realm":130,"comment":""},{"id":87,"start_datetime":"2017-01-18T09:30:00Z","end_datetime":"2017-01-18T21:45:00Z","available":true,"user":164,"realm":130,"comment":""},{"id":86,"start_datetime":"2017-01-18T15:00:00Z","end_datetime":"2017-01-18T15:15:00Z","available":true,"user":164,"realm":130,"comment":""},{"id":88,"start_datetime":"2017-01-19T01:00:00Z","end_datetime":"2017-01-19T01:15:00Z","available":false,"user":278,"realm":130,"comment":""}];
        },
      };
      $uibModalMock = {
        open : function(configObject){}

      }
      commonServiceMock = {
        getLocalPersonaDisplayState : function() { return 'REALM_USER_COWORKERS_SHIFTS'}
      }

      userServiceMock = {
        getLocalCoworkers : function() { return [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":165,"first_name":"T","last_name":"Dog","preferred_name":"","email":"tdog@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":166,"first_name":"F2","last_name":"L2","preferred_name":"","email":"fl2@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":167,"first_name":"F3","last_name":"L3","preferred_name":"","email":"fl3@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":168,"first_name":"F4","last_name":"L4","preferred_name":"","email":"fl4@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":169,"first_name":"F5","last_name":"L5","preferred_name":"","email":"fl5@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":170,"first_name":"F7","last_name":"L7","preferred_name":"","email":"fl7@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":171,"first_name":"F8","last_name":"L8","preferred_name":"","email":"fl8@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":172,"first_name":"F9","last_name":"L9","preferred_name":"","email":"fl9@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":278,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe","email":"gabe.stanek@gmail.com","is_active":false,"is_admin":false,"realms":[130]}]},
        getLocalUser : function() { return {"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}}
      }

      controllerInstance = controller('PersonaCtrl', { $scope: scope, $uibModal: $uibModalMock, commonService : commonServiceMock, shiftService : shiftServiceMock, userService : userServiceMock});
    });

    // Individual tests...
    it('should initialize persona controller', function() {
      expect(controllerInstance).toBeDefined();
      expect(scope.personaDisplayState).toEqual('REALM_USER_COWORKERS_SHIFTS');
    });

  });
});