'use strict';

angular.module('myApp.user', ['ui.router', 'myApp.userService'])

.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'views/user/user.html',
        controller: 'UserCtrl'
      });
}])

.controller('UserCtrl', ['$scope', 'userService', function($scope, userService) {
    "ngInject";
    $scope.user = {};
    $scope.user = userService.getLocalUser();
    $scope.updateUser = function() {
        if($scope.updateUserForm.$valid) {
            console.log('user object for update=' + JSON.stringify($scope.user))
            userService.updateUser($scope.user)
                .then(function successCallback(response) {

                    userService.setLocalUser(response.data.user, true);
                }, function errorCallback(response) {
                    console.log('Failure:' + JSON.stringify(response));
                });
        }
        else {
            alert("A valid email address is required");
        }
    }

    $scope.$on('USER_CHANGE_EVENT', function() {
        $scope.user = userService.getLocalUser();
    });
}]);