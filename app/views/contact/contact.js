'use strict';

angular.module('myApp.contact', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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