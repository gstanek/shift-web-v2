'use strict';

//angular.module('myApp.persona', ['ui.router', 'myApp.realmService'])
    //, 'myApp.ngAutocomplete'
angular.module('myApp')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('persona', {
        url: '/persona',
        templateUrl: 'views/persona/persona.html',
        controller: 'PersonaCtrl'
      });
}])

.controller('PersonaCtrl', ['$scope', '$http', 'authService', 'realmService', 'userService', 'shiftService',
    function($scope, $http, authService, realmService, userService, shiftService) {

    $scope.isActiveRealm = realmService.isActiveRealm();
    $scope.$on('REALM_CHANGE_EVENT', function() {
        $scope.isActiveRealm = realmService.isActiveRealm();
    });

    $scope.availableShifts = shiftService.getLocalShifts();
    var isShiftPresent = function() {
        var user = userService.getActiveUser();
        if(user) {
            var shifts = shiftService.getLocalShifts();
            if(shifts) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    $scope.isShiftPresent = function() {
        return isShiftPresent();
    }
    $scope.$on('SHIFT_CHANGE_EVENT', function() {
        $scope.isShiftPresent = function() {
            return isShiftPresent();
        }
        $scope.availableShifts = shiftService.getLocalShifts();
    });


    // Start Modal Logic


    // $scope.radioModel = 'employee';
    // $scope.createRealm = function() {
    //     var userId = userService.getActiveUser().id;
    //     var realm = {
    //         name : $scope.newRealmFormModel.name,
    //         address : $scope.address
    //     };
    //     realmService.createRealm(realm)
    //         .then(function successCallback(response) {
    //             realm.id = response.data.id;
    //             console.log('Realm to Store in Local Storage' + JSON.stringify(realm))
    //             realmService.setLocalRealm(realm);
    //             //personaService.createPersona(realm.id);
    //
    //         }, function errorCallback(response) {
    //             console.log('Error creating realm in backend')
    //         });
    //
    // };
    // // Employee/Manager/Owner Picker Logic
    // $scope.$watchCollection('checkModel', function () {
    //     $scope.checkResults = [];
    //     angular.forEach($scope.checkModel, function (value, key) {
    //         if (value) {
    //             $scope.checkResults.push(key);
    //         }
    //     });
    // });
    // // End Picker logic
    // $scope.newRealmFormModel = {
    //     name : '',
    //     address : '',
    //     manager : ''
    // };
}]);