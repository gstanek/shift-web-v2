'use strict';

angular.module('ShiftOnTapApp')

.config(['$stateProvider', '$urlRouterProvider',function($stateProvider) {
  $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'views/user/user.html',
        controller: 'UserCtrl'
      });
}])

.controller('UserCtrl', ['$scope', 'userService', 'realmService', 'Notification',
function($scope, userService, realmService, Notification) {
    "ngInject";
    $scope.user = {};
    $scope.user = userService.getLocalUser();
    if($scope.user && !$scope.user.timezone) {
        $scope.user.timezone = moment.tz.guess();
    }
    $scope.realm = {};
    $scope.realm = realmService.getLocalRealm();

    var getDefaultRealmName = function(id) {
        var realms = $scope.user.realms;
        for(var i = 0; i < realms.length; i++) {
            var realm = realms[i];
            if(realm.id == $scope.user.default_realm) {
                return realm.name;
            }
        }
        return null;
    };

    $scope.defaultRealm = {
        id: $scope.user.default_realm,
        name: getDefaultRealmName($scope.user.default_realm)
    };

    $scope.dateObj = {
        date : new Date()
    };
    $scope.timezones = moment.tz.names();

    $scope.updateUser = function(form) {
        $scope.errorObj = {};
        $scope.user.default_realm = $scope.defaultRealm.id;
        if($scope.updateUserForm.$valid) {
            userService.updateUser($scope.user)
                .then(function successCallback(user) {
                    Notification.success('Information saved');
                    $scope.user = user;
                    form.$setUntouched();
                    form.$setPristine();
                })
                .catch(function errorCallback(errorResponseObject) {
                    Notification.error(errorResponseObject.error.message);
                });
        }
        else {
            angular.forEach(form.$error, function (field) {
                angular.forEach(field, function(errorField){
                    errorField.$setTouched();
                })
            });
            $scope.errorObj.detail='Please correct errors indicated above and resubmit';
        }
    }

    //REALM_CHANGE_EVENT
    $scope.$on('REALM_CHANGE_EVENT', function(realm) {
        $scope.realm = realm;
    });

    $scope.$on('USER_CHANGE_EVENT', function() {
        $scope.user = userService.getLocalUser();
        if($scope.user && !$scope.user.timezone) {
            $scope.user.timezone = moment.tz.guess();
        }
    });
}]);