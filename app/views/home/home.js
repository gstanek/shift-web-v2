'use strict';

angular.module('myApp.home', ['ui.router', 'myApp.authService'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home/home.html',
      controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', 'authService', '$location',
  function($scope, authService, $location) {
  "ngInject";
  $scope.isActiveUser = authService.isAuthenticated();
  $scope.errorObj = {};

  $scope.$on('USER_CHANGE_EVENT', function(broadcastObj) {
      // if(broadcastObj.type)
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
  var init = function() {
      var invitedEmail  = $location.search().email
      if(invitedEmail) {
        $scope.email = invitedEmail;
      }
      else {
          $scope.email = "Email";
      }
  }
  init();
}]);