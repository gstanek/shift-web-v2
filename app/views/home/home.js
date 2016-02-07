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

  .controller('HomeCtrl', ['$scope', '$state', 'authService', function($scope, $state, authService) {
      $scope.isActiveUser = authService.isAuthenticated();
      $scope.credentials = {};
      $scope.showpassword = false;
      $scope.signup = function() {
          //console.log('credentials=' + JSON.stringify($scope.credentials));
          if($scope.signUpForm.$valid) {
              var signUpSuccess = authService.signup($scope.credentials);
              if(signUpSuccess) {
                  $state.go('persona');
              }
              else {
                  alert('Something went wrong during the signup process.  Please try again.  If the problem persists, please check back later.');
              }
          }
          else {
              alert('Please double check your signup form entry and try again.');
          }
      };
  }]);