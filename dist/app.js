"use strict";angular.module("ShiftOnTapApp",["LocalStorageModule","ui.bootstrap","ngAnimate","ngWebSocket","ui.router","satellizer","uiGmapgoogle-maps","ui-notification","angularMoment"]).config(["$stateProvider","$urlRouterProvider","localStorageServiceProvider","$authProvider",function(a,b,c,d){b.otherwise("/home"),c.setPrefix("shift"),d.oauth2({name:"shift",url:"/auth/shift",clientId:"GqtWKUGixAaG727XNqsNrVlgcpDQsZ4MgZLvYev1",redirectUri:window.location.origin,authorizationEndpoint:"http://localhost:8000/o/token/"})}]).config(["$locationProvider",function(a){a.html5Mode(!0)}]).config(["uiGmapGoogleMapApiProvider",function(a){a.configure({key:"AIzaSyCGl2NzP-CIA_V5UXoaC96FwzN26JOiSrc",libraries:"places"})}]).config(["NotificationProvider",function(a){a.setOptions({delay:3e3,startTop:20,startRight:10,verticalSpacing:20,horizontalSpacing:20,positionX:"center",positionY:"top"})}]).controller("AppCtrl",["$scope","authService","userService","realmService","$uibModal",function(a,b,c,d,e){a.displayName=c.getBestDisplayName(),a.isActiveUser=b.isAuthenticated(),a.isAuthorized=b.isAuthorized("admin"),a.logout=function(){b.logout()},a.companyName=d.getRealmName(),a.modal={instance:null},a.openLogin=function(){a.responseObj={},a.modal.instance=e.open({animation:!0,template:'<auth-modal modal="modal" error-obj="responseObj" action="\'login\'" title="\'Login\'"></auth-modal>',scope:a})},a.$on("USER_CHANGE_EVENT",function(){a.displayName=c.getBestDisplayName(),a.isActiveUser=b.isAuthenticated(),a.isAuthorized=b.isAuthorized("admin"),a.companyName=d.getRealmName()}),a.$on("REALM_CHANGE_EVENT",function(){a.companyName=d.getRealmName()}),a.$on("AUTH_SUCCESS_EVENT",function(b,c){a.responseObj={status:"success"}}),a.$on("UNAUTHORIZED_EVENT",function(e,f){c.removeLocalUser(!0),a.displayName=c.getBestDisplayName(),a.isActiveUser=b.isAuthenticated(),a.isAuthorized=b.isAuthorized("admin"),d.removeLocalRealm(!0),a.companyName=d.getRealmName(),f&&f.rejection?a.responseObj={status:"failure",detail:f.rejection.data.message,code:f.rejection.data.code}:a.errorObj={detail:"Invalid credentials",code:"99999"}});var f=function(){b.validateAuthenticated()};f()}]);