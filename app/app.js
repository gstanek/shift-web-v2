'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [

    'myApp.home',
    'myApp.about',
    'myApp.contact',
    //'myApp.persona',
    'myApp.user',
    'myApp.version',

    'myApp.authService',
    'myApp.commonService',
    'myApp.userService',
    'myApp.realmService',
    'myApp.personaService',
    'myApp.shiftService',
    'myApp.ngAutocomplete',

    'myApp.createRealmDirective',
    'myApp.addShiftDirective',
    'myApp.addUsersDirective',
    //'myApp.userShiftListDirective',
    'myApp.realmAvailableShiftListDirective',

    'LocalStorageModule',
    'ui.bootstrap',
    'ngAnimate',
    'ngWebSocket',
    //'ui.bootstrap.datetimepicker',
    'ui.router',
    'satellizer',
    'uiGmapgoogle-maps',

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
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCGl2NzP-CIA_V5UXoaC96FwzN26JOiSrc',
        //v: '3.20', defaults to latest 3.X anyhow
        libraries: 'places'
    });
}])
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
        $scope.errorObj={};
        $scope.modal.instance = $uibModal.open({
            animation: true,
            template: '<auth-modal modal="modal" error-obj="errorObj" action="\'login\'" title="\'Login\'"></auth-modal>',
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

    $scope.$on('UNAUTHORIZED_EVENT', function(event, args) {
        userService.removeLocalUser(true);
        $scope.displayName = userService.getBestDisplayName();
        $scope.isActiveUser = authService.isAuthenticated();
        //TODO don't hard code the role
        $scope.isAuthorized = authService.isAuthorized('admin');

        realmService.removeLocalRealm(true);
        $scope.companyName = realmService.getRealmName();

        if(args && args.rejection) {
            $scope.errorObj.detail=args.rejection.data.detail;
            $scope.errorObj.code= args.rejection.data.code;
        }
        else {
            $scope.errorObj.detail='Invalid credentials';
        }
    });

    var init = function () {
        authService.validateAuthenticated();
    };
    init();

}]);