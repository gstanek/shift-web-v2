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

.controller('UserCtrl', ['$scope', 'userService', 'Notification',
    function($scope, userService, Notification) {
    "ngInject";
    $scope.user = {};
    $scope.user = userService.getLocalUser();

    $scope.updateUser = function(form) {
        $scope.errorObj = {};
        if($scope.updateUserForm.$valid) {
            userService.updateUser($scope.user)
                .then(function successCallback(user) {
                    Notification.success('Information saved');
                    $scope.user = user;
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

    $scope.$on('USER_CHANGE_EVENT', function() {
        $scope.user = userService.getLocalUser();
    });
}]);