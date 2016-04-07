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

.controller('LoginCtrl', ['$scope', '$state', 'authService', 'userService', 'shiftService', function($scope, $state, authService, userService, shiftService) {
    $scope.credentials = {
        email: '',
        password: ''
    };
    $scope.showpassword = false;
    $scope.login = function() {
        if($scope.loginForm.$valid) {
            var signUpSuccess = authService.login($scope.credentials)
                .then(function successCallback(response) {
                    authService.setToken(response.data.access_token);
                    userService.getUserByEmail($scope.credentials.email)
                        .then(function successCallback(response) {
                            userService.setActiveUser(response.data);


                            shiftService.getShifts()
                                .then(function successCallback(response) {
                                    console.log('Success:' + JSON.stringify(response));
                                    shiftService.storeLocalShifts(response.data);
                                    return true;
                                }, function errorCallback(response) {
                                    console.log('Failure to Get Shifts:' + JSON.stringify(response));
                                    return false;
                                });
                        }, function errorCallback(response) {
                            return false;
                        });
            }, function errorCallback(response) {
                return false;
            });

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