'use strict';

angular.module('myApp.home', ['ui.router', 'myApp.authService'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home/home.html',
      controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', 'authService',
  function($scope, authService) {
  $scope.isActiveUser = authService.isAuthenticated();
  $scope.credentials = {};
  $scope.showpassword = false;

  $scope.signup = function() {
      if($scope.signUpForm.$valid) {
          authService.signup($scope.credentials);
      }
      else {
          //TODO: make this a better notification
          alert('Please double check your signup form entry and try again.');
      }
  };

  $scope.$on('USER_CHANGE_EVENT', function() {
      $scope.isActiveUser = authService.isAuthenticated();
  });
}]);