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
    $scope.openLogin = function () {
        $scope.modal.instance = $uibModal.open({
            animation: true,
            template: '<auth-modal modal="modal"></auth-modal>',
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

    $scope.$on('UNAUTHORIZED_EVENT', function() {
        userService.removeLocalUser(true);
        $scope.displayName = userService.getBestDisplayName();
        $scope.isActiveUser = authService.isAuthenticated();
        //TODO don't hard code the role
        $scope.isAuthorized = authService.isAuthorized('admin');

        realmService.removeLocalRealm(true);
        $scope.companyName = realmService.getRealmName();
    });

    var init = function () {
        authService.validateAuthenticated();
    };
    init();

}]);

    // .directive('addShiftDirective', ['realmService', 'userService', 'shiftService', function(realmService, userService, shiftService) {
    //     return {
    //         restrict: 'E',
    //         // transclude: true,
    //         scope: {
    //             modal: '=',
    //             'save': '&onSave',
    //             'cancel': '&onCancel'
    //         },
    //         templateUrl: 'components/add-shift-directive/add-shift.html',
    //         link: function (scope, element, attrs, ngModel) {
    //             scope.isActiveRealm = realmService.isActiveRealm();
    //             var isShiftPresent = function() {
    //                 var user = userService.getActiveUser();
    //                 if(user) {
    //                     var shifts = shiftService.getLocalShifts();
    //                     if(shifts) {
    //                         return true;
    //                     }
    //                     else {
    //                         return false;
    //                     }
    //                 }
    //                 else {
    //                     return false;
    //                 }
    //             };
    //             scope.isShiftPresent = function() {
    //                 return isShiftPresent();
    //             }
    //
    //             scope.companyName = realmService.getRealmName();
    //             scope.newShiftModel = {
    //                 id : '',
    //                 dateRangeStart : '',
    //                 dateRangeEnd : '',
    //                 comment : ''
    //             };
    //             scope.createShift = function() {
    //                 var shiftDAO = {
    //                     startDate : scope.shiftDetails.startDate,
    //                     startTime : scope.shiftDetails.startTime,
    //                     endDate : scope.shiftDetails.endDate,
    //                     endTime : scope.shiftDetails.endTime,
    //                     comment : scope.newShiftModel.comment
    //                 };
    //                 shiftService.storeShift(shiftDAO)
    //                     .then(function successCallback(response) {
    //                         console.log('Success:' + JSON.stringify(response));
    //                         shiftService.storeLocalShift(response.data);
    //                         scope.save();
    //                     }, function errorCallback(response) {
    //                         console.log('Failure:' + JSON.stringify(response));
    //                     });
    //             };
    //
    //             /** Date Selection Initial Configuration */
    //             scope.format = 'shortDate';
    //             scope.popup1 = {
    //                 opened: false
    //             };
    //             scope.popup2 = {
    //                 opened: false
    //             };
    //             scope.shiftDetails = {
    //                 startDate : null,
    //                 startTime : new Date(),
    //                 endDate : null,
    //                 endTime : new Date(),
    //                 comment : ''
    //             }
    //             // Set max date to 5 years out
    //             var maxDate = new Date();
    //             maxDate.setFullYear(maxDate.getFullYear() + 5);
    //             scope.startDateOptions = {
    //                 formatYear: 'yy',
    //                 maxDate: maxDate,
    //                 minDate: new Date(),
    //                 startingDay: 0
    //             };
    //             scope.endDateOptions = {
    //                 formatYear: 'yy',
    //                 maxDate: maxDate,
    //                 minDate: new Date(),
    //                 startingDay: 0
    //             };
    //
    //             /** Date selection methods */
    //             scope.today = function() {
    //                 return new Date();
    //             };
    //             scope.startDateToday = function() {
    //                 scope.shiftDetails.startDate = scope.today();
    //             }
    //             scope.startDateToday();
    //
    //             scope.endDateToday = function() {
    //                 scope.shiftDetails.endDate = scope.today();
    //             }
    //             scope.endDateToday();
    //
    //             scope.startDateClear = function() {
    //                 scope.shiftDetails.startDate = null
    //             }
    //             scope.endDateClear = function() {
    //                 scope.shiftDetails.endDate = null
    //             }
    //
    //             scope.open1 = function() {
    //                 scope.popup1.opened = true;
    //             };
    //             scope.open2 = function() {
    //                 scope.popup2.opened = true;
    //             };
    //
    //             // Update minimum shift end date when start date is selected
    //             scope.$watch('shiftDetails.startDate',function(value){
    //                 scope.endDateOptions.minDate = scope.shiftDetails.startDate;
    //                 if(scope.shiftDetails.endDate < scope.shiftDetails.startDate) {
    //                     scope.shiftDetails.endDate = scope.shiftDetails.startDate;
    //                 }
    //             });
    //
    //             // By default, assume shift ends on same date it starts, so initially hiding the end date selection
    //             scope.showEndDateEntry = false;
    //             scope.startDateHeader = 'Shift Date';
    //             scope.endDateHeader = 'Shift End Date';
    //             scope.toggleShowEndDate = function() {
    //                 scope.showEndDateEntry = !scope.showEndDateEntry;
    //                 if(scope.showEndDateEntry) {
    //                     scope.startDateHeader = 'Shift Start Date';
    //                 }
    //                 else {
    //                     scope.startDateHeader = 'Shift Date';
    //                 }
    //             }
    //
    //             scope.startTimeHeader = 'Shift Start Time';
    //             scope.endTimeHeader = 'Shift End Time';
    //         }
    //     };
    // }]);


