'use strict';

angular.module('myApp.user', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'views/user/user.html',
        controller: 'UserCtrl'
      });
}])

.controller('UserCtrl', [function() {

}]);