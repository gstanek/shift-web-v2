'use strict';

angular.module('ShiftOnTapApp')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
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

  $scope.$on('USER_CHANGE_EVENT', function(broadcastObj) {
      // TODO Adjust this to use broadcast object instead of doing lookup
      $scope.isActiveUser = authService.isAuthenticated();
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