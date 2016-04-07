'use strict';

angular.module('myApp.persona', ['ui.router', 'myApp.realmService', 'myApp.ngAutocomplete'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('persona', {
        url: '/persona',
        templateUrl: 'views/persona/persona.html',
        controller: 'PersonaCtrl'
      });
}])

.controller('PersonaCtrl', ['$scope', '$http', 'authService', 'realmService', 'userService', 'shiftService', 'personaService',
    function($scope, $http, authService, realmService, userService, shiftService, personaService) {


    // COMMON

    $scope.isActiveRealm = realmService.isActiveRealm();
    $scope.availableShifts = shiftService.getLocalShifts();

    $scope.$on('REALM_CHANGE_EVENT', function() {
        $scope.isActiveRealm = realmService.isActiveRealm();
    });


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
    $scope.availableShifts = [];
    $scope.$on('SHIFT_CHANGE_EVENT', function() {
        $scope.isShiftPresent = function() {
            return isShiftPresent();
        }
        $scope.availableShifts = shiftService.getLocalShifts();
    });

    //// NEW REALM LOGIC

    // Employee/Manager/Owner Picker Logic
    $scope.radioModel = 'employee';
    $scope.$watchCollection('checkModel', function () {
        $scope.checkResults = [];
        angular.forEach($scope.checkModel, function (value, key) {
            if (value) {
                $scope.checkResults.push(key);
            }
        });
    });
    // END Picker logic
    $scope.newRealmFormModel = {
        name : '',
        address : '',
        manager : ''
    };
    $scope.createRealm = function() {
        var userId = userService.getActiveUser().id;
        var realm = {
            name : $scope.newRealmFormModel.name,
            address : $scope.address
        };
        realmService.createRealm(realm)
            .then(function successCallback(response) {
                realm.id = response.data.id;
                console.log('Realm to Store in Local Storage' + JSON.stringify(realm))
                realmService.setLocalRealm(realm);
                personaService.createPersona(realm.id);

            }, function errorCallback(response) {
                console.log('Error creating realm in backend')
            });
    };

    // Start Autofill address logic
    $scope.result = '';
    $scope.options = {
        watchEnter: true,
        types:'address'
    };
    $scope.address = {};
    $scope.addressFound = '';
    // End Autofill address logic

    //// NEW SHIFT ENTRY LOGIC

    $scope.companyName = realmService.getRealmName();
    $scope.newShiftModel = {
        id : '',
        dateRangeStart : '',
        dateRangeEnd : '',
        comment : ''
    };
    $scope.createShift = function() {
        var realm = realmService.getLocalRealm();
        var shift = {
            start_datetime : $scope.newShiftModel.dateRangeStart,
            end_datetime : $scope.newShiftModel.dateRangeEnd,
            available : false,
            realm : realm.id,
            comment : $scope.newShiftModel.comment
        };

        shiftService.storeShift(shift)
            .then(function successCallback(response) {
                console.log('Success:' + JSON.stringify(response));
                shiftService.storeLocalShift(response.data);
            }, function errorCallback(response) {
                console.log('Failure:' + JSON.stringify(response));
            });
    };
    $scope.beforeRenderStartDate = function($view, $dates, $leftDate, $upDate, $rightDate) {
        if ($scope.dateRangeEnd) {
            var activeDate = moment($scope.dateRangeEnd);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
            }
        }
    }
    $scope.beforeRenderEndDate = function($view, $dates, $leftDate, $upDate, $rightDate) {
        if ($scope.dateRangeStart) {
            var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                    $dates[i].selectable = false;
                }
            }
        }
    }



    //// ACTIVE SHIFTS LOGIC AND REALM

    $scope.reclaim = function(shiftID) {
        updateShift(shiftID, false);
    }
    $scope.markAvailable = function(shiftID) {
        console.log('ShiftID: ' + JSON.stringify(shiftID))
        updateShift(shiftID, true);
    }

    var updateShift = function(id, bAvailable) {
        var shift = {
            available: bAvailable
        }
        shiftService.updateShift(id, shift)
            .then(function successCallback(response) {
                console.log('Success:' + JSON.stringify(response));
                shiftService.storeLocalShift(response.data);
            }, function errorCallback(response) {
                console.log('Failure:' + JSON.stringify(response));
            });
    }
    $scope.delete = function(shiftID) {
        console.log('in delete ' + shiftID);
    }



    var init = function () {
        $scope.isShiftPresent = function() {
            return isShiftPresent();
        }
        $scope.availableShifts = shiftService.getLocalShifts();
    };
    init();

}]);