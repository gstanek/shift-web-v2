'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'LocalStorageModule',
    'myApp.home',
    'myApp.about',
    'myApp.contact',
    'myApp.persona',
    'myApp.login',
    'myApp.user',
    'myApp.version',
    'ui.bootstrap',
    'ui.router',
    'myApp.authService',
    'myApp.userService',
    'myApp.realmService',
    'myApp.personaService',
    'myApp.shiftService',
    'myApp.ngAutocomplete',
    'ui.bootstrap.datetimepicker',
    'satellizer'
])
.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', '$authProvider', function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $authProvider) {
    $urlRouterProvider.otherwise("/home");
    localStorageServiceProvider.setPrefix('shift');
    $authProvider.oauth2({
        name: 'shift',
        url: '/auth/shift',
        clientId: 'AiFijhEYAYAad9r6KgYAgFUN6B2dOMAuFBe60ucE',
        redirectUri: window.location.origin,
        authorizationEndpoint: 'http://localhost:8000/o/token/',
    });
}])
    .controller('AppCtrl', ['$scope', 'authService', 'userService', 'realmService', function($scope, authService, userService, realmService) {
        $scope.displayName = userService.getBestDisplayName();
        $scope.isActiveUser = authService.isAuthenticated();
        $scope.isAuthorized = authService.isAuthorized('admin');
        //TODO don't hard code the role
        $scope.logout = function() {
            authService.logout();
        }
        $scope.companyName = realmService.getRealmName();

        $scope.$on('USER_CHANGE_EVENT', function() {
            $scope.displayName = userService.getBestDisplayName();
            $scope.isActiveUser = authService.isAuthenticated();
            //TODO don't hard code the role
            $scope.isAuthorized = authService.isAuthorized('admin');
            $scope.companyName = realmService.getRealmName();
        });

        $scope.$on('REALM_CHANGE_EVENT', function() {
            $scope.companyName = realmService.getRealmName();
        });


    }]);


