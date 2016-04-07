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

  .controller('HomeCtrl', ['$scope', '$state', 'authService', 'userService', 'realmService', 'shiftService', function($scope, $state, authService, userService, realmService, shiftService) {
      $scope.isActiveUser = authService.isAuthenticated();
      $scope.credentials = {};
      $scope.showpassword = false;
      $scope.signup = function() {
          if($scope.signUpForm.$valid) {
              authService.signup($scope.credentials)
                  .then(function successCallback(response) {
                      authService.setToken(response.data.access_token);
                      userService.setActiveUser(response.data.user);
                      realmService.removeLocalRealm();
                      shiftService.removeLocalShifts();
                      $state.go('persona');
                  }, function errorCallback(response) {
                      alert('Something went wrong during the signup process.  Please try again.  If the problem persists, please check back later.');
              });
          }
          else {
              alert('Please double check your signup form entry and try again.');
          }
      };
  }]);