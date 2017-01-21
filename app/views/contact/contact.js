'use strict';

angular.module('ShiftOnTapApp')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
  $stateProvider
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact/contact.html',
        controller: 'ContactCtrl'
      });
}])

.controller('ContactCtrl', [function() {
    "ngInject";
}]);