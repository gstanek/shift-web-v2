// 'use strict';
//
// describe('ShiftOnTapApp module', function() {
//     // Load the module that contains the directive
//     beforeEach(module('ShiftOnTapApp'));
//
//     var $controller, $rootScope;
//
//     beforeEach(inject(function(_$controller_, _$rootScope_){
//         // The injector unwraps the underscores (_) from around the parameter names when matching
//         $controller = _$controller_;
//         $rootScope = _$rootScope_;
//     }));
//
//     describe('add shift directive', function(){
//         var $scope, controller, shiftServiceMock, $uibModalMock, commonServiceMock;
//         beforeEach(function() {
//             $scope = $rootScope.$new();
//             shiftServiceMock = {
//                 getLocalShifts : function() {},
//             };
//             $uibModalMock = {
//                 open : function(configObject){}
//
//             }
//             commonServiceMock = {
//                 getLocalPersonaDisplayState : function() { return 'REALM_USER_COWORKERS_SHIFTS'}
//             }
//
//             controller = $controller('PersonaCtrl', { $scope: $scope, $uibModal: $uibModalMock, commonService : commonServiceMock, shiftService : shiftServiceMock});
//         });
//
//         // Individual tests...
//         it('should initialize add shift directive', function() {
//             expect(controller).toBeDefined();
//             expect($scope.personaDisplayState).toEqual('REALM_USER_COWORKERS_SHIFTS');
//         });
//
//     });
// });