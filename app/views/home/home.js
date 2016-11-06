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
  "ngInject";
  $scope.isActiveUser = authService.isAuthenticated();
  $scope.errorObj = {};

  $scope.$on('USER_CHANGE_EVENT', function() {
      $scope.isActiveUser = authService.isAuthenticated();
  });
  $scope.$on('BAD_REQUEST_EVENT', function(event, args) {
      if(args && args.rejection) {
          var errorResponse = args.rejection.data;
          $scope.errorObj.code = errorResponse.code;
          $scope.errorObj.detail = errorResponse.detail;
          console.log('errorResponse.code=' + errorResponse.code);
          console.log('errorResponse.detail=' + errorResponse.detail);
      }
      else {
          $scope.errorObj.detail='We\'re sorry, Something went wrong with the request, please try again';
      }
  });
}]);