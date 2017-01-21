'use strict';

angular.module('ShiftOnTapApp')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
  $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'views/about/about.html',
        controller: 'AboutCtrl'
      });
}])

.controller('AboutCtrl', [function() {
    "ngInject";

}]);