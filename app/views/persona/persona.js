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

.controller('PersonaCtrl', ['$scope', '$http', 'authService', 'realmService', 'userService', 'shiftService',
    function($scope, $http, authService, realmService, userService, shiftService) {


    // COMMON

    $scope.isActiveRealm = realmService.isActiveRealm();
    $scope.$on('REALM_CHANGE_EVENT', function() {
        $scope.isActiveRealm = realmService.isActiveRealm();
    });

    $scope.$on('SHIFT_CHANGE_EVENT', function() {
        $scope.isShiftPresent = function() {
            return isShiftPresent();
        };
        $scope.availableShifts = shiftService.getShifts();
    });
    $scope.isShiftPresent = function() {
        return isShiftPresent();
    };
    var isShiftPresent = function() {
        //return true;
        var user = userService.getActiveUser();
        var shifts = shiftService.getShiftsByPersonaID(user.id + '-' + user.realmID);
        if(shifts) {
            return true;
        }
        else {
            return false;
        }
    };

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
        var realm = {
            name : $scope.newRealmFormModel.name,
            manager : $scope.newRealmFormModel.manager,
            address : $scope.address
        };
        realmService.createRealm(realm);
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
        comments : ''
    };
    $scope.createShift = function() {
        console.log('In createShift Function.  newShiftForm Data: ' + JSON.stringify($scope.newShiftModel));
        $scope.newShiftModel.id = '123456';
        shiftService.storeShift($scope.newShiftModel);
        $scope.availableShifts.push($scope.newShiftModel);

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
        console.log('in reclaim ' + shiftID);
    }
    $scope.markAvailable = function(shiftID) {
        console.log('in markAvailable ' + shiftID);
    }
    $scope.delete = function(shiftID) {
        console.log('in delete ' + shiftID);
    }
    $scope.availableShifts = [];
    $scope.getAvailableShifts = function() {
        return shiftService.getShifts();
    }




}]);