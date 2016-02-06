'use strict';

angular.module('myApp.login', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl'
      });
}])

.controller('LoginCtrl', ['$scope', '$state', 'authService', function($scope, $state, authService) {
    $scope.credentials = {
        email: '',
        password: ''
    };
    $scope.showpassword = false;
    $scope.login = function() {
        if($scope.loginForm.$valid) {
            var signUpSuccess = authService.signup($scope.credentials);
            if(signUpSuccess) {
                $state.go('persona');
            }
            else {
                alert('Something went wrong during the signup process.  Please try again.  IF the problem persists, please check back later.');
            }
        }
        else {
            alert('Please double check your signup form entry and try again.');
        }
    };
}]);