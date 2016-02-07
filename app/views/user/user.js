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
    $scope.user = {};
    $scope.user = userService.getActiveUser();
    $scope.updateUser = function() {
        if($scope.updateUserForm.$valid) {
            userService.updateUser($scope.user);
        }
        else {
            alert("A valid email address is required");
        }
    }

    $scope.$on('USER_CHANGE_EVENT', function() {
        $scope.user = userService.getActiveUser();
    });
}]);