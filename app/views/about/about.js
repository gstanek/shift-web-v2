'use strict';

angular.module('myApp.about', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'views/about/about.html',
        controller: 'AboutCtrl'
      });
}])

.controller('AboutCtrl', [function() {

}]);