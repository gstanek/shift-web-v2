'use strict';


// .constant('moment', require('moment-timezone'))

// Declare app level module which depends on views, and components
angular.module('ShiftOnTapApp', [
    'LocalStorageModule',
    'ui.bootstrap',
    'ngAnimate',
    'ngWebSocket',
    //'ui.bootstrap.datetimepicker',
    'ui.router',
    'satellizer',
    'uiGmapgoogle-maps',
    'ui-notification',
    'angularMoment',

])
.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', '$authProvider', function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $authProvider) {
    $urlRouterProvider.otherwise("/home");
    localStorageServiceProvider.setPrefix('shift');
    $authProvider.oauth2({
        name: 'shift',
        url: '/auth/shift',
        clientId: 'GqtWKUGixAaG727XNqsNrVlgcpDQsZ4MgZLvYev1',
        redirectUri: window.location.origin,
        authorizationEndpoint: 'http://localhost:8000/o/token/',
    });
}])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}])
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCGl2NzP-CIA_V5UXoaC96FwzN26JOiSrc',
        //v: '3.20', defaults to latest 3.X anyhow
        libraries: 'places'
    });
}])
.config(['NotificationProvider', function(NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 3000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'center',
        positionY: 'top'
    });
}])
// .run('$http', function($http) {
//     $http.defaults.headers.common.accept = 'application/json';
// })
// .config('$httpProvider', function($httpProvider) {
//     $httpProvider.defaults.headers.common = {
//         Accept: 'application/json'
//     };
//     $httpProvider.defaults.headers.patch['Content-Type'] = 'application/json';
// })
// .config(function ($httpProvider) {
//     $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
//     $httpProvider.defaults.headers.post['Content-Type'] =  'application/x-www-form-urlencoded';
// })
.controller('AppCtrl', ['$scope', 'authService', 'userService', 'realmService', '$uibModal', function($scope, authService, userService, realmService, $uibModal) {
    $scope.displayName = userService.getBestDisplayName();
    $scope.isActiveUser = authService.isAuthenticated();
    $scope.isAuthorized = authService.isAuthorized('admin');


    //TODO don't hard code the role
    $scope.logout = function() {
        authService.logout();
    }
    $scope.companyName = realmService.getRealmName();

    // Start Modal Logic
    $scope.modal = {
        instance: null
    };
    // $scope.errorDesc='';
    $scope.openLogin = function () {
        $scope.responseObj={};
        $scope.modal.instance = $uibModal.open({
            animation: true,
            template: '<auth-modal modal="modal" error-obj="responseObj" action="\'login\'" title="\'Login\'"></auth-modal>',
            scope : $scope
        });
    };
    // End Modal Logic

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

    $scope.$on('AUTH_SUCCESS_EVENT', function(event, args) {
        $scope.responseObj = {
            status: 'success'
        };
    });

    $scope.$on('UNAUTHORIZED_EVENT', function(event, args) {
        userService.removeLocalUser(true);
        $scope.displayName = userService.getBestDisplayName();
        $scope.isActiveUser = authService.isAuthenticated();
        //TODO don't hard code the role
        $scope.isAuthorized = authService.isAuthorized('admin');

        realmService.removeLocalRealm(true);
        $scope.companyName = realmService.getRealmName();

        if(args && args.rejection) {
            $scope.responseObj = {
                status: 'failure',
                detail: args.rejection.data.message,
                code: args.rejection.data.code
            }
        }
        else {
            $scope.errorObj = {
                detail: 'Invalid credentials',
                code: '99999'
            }
        }
    });

    var init = function () {
        authService.validateAuthenticated();
    };
    init();

}]);