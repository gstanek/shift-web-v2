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

.controller('PersonaCtrl', ['$scope', 'authService', 'realmService', '$http', function($scope, authService, realmService, $http) {

    $scope.$on('REALM_CHANGE_EVENT', function() {
        $scope.isActiveRealm = realmService.isActiveRealm();
    });

    $scope.isActiveRealm = realmService.isActiveRealm();

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
    $scope.newRealmFormModel = {
        name : '',
        address : '',
        manager : ''
    };

    $scope.createRealm = function() {
        console.log('In create Realm Service');
        var realm = {
            name : $scope.newRealmFormModel.name,
            manager : $scope.newRealmFormModel.manager,
            address : $scope.address
        };
        console.log('Realm to create:' + JSON.stringify(realm));
        realmService.createRealm(realm);
    };

    // When Realm and User Exists
    $scope.reclaim = function(shiftID) {
        console.log('in reclaim ' + shiftID);
    }
    $scope.markAvailable = function(shiftID) {
        console.log('in markAvailable ' + shiftID);
    }
    $scope.delete = function(shiftID) {
        console.log('in delete ' + shiftID);
    }

    // Start Autofill address logic
    $scope.result = '';
    $scope.options = {
        watchEnter: true,
        types:'address'
    };
    $scope.address = {};
    $scope.addressFound = '';
    // End Autofill address logic


}]);