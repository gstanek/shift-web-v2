"use strict";angular.module("ShiftOnTapApp").config(["$stateProvider","$urlRouterProvider",function(a){a.state("user",{url:"/user",templateUrl:"views/user/user.html",controller:"UserCtrl"})}]).controller("UserCtrl",["$scope","userService","realmService","Notification",function(a,b,c,d){"ngInject";a.user={},a.user=b.getLocalUser(),a.user&&!a.user.timezone&&(a.user.timezone=moment.tz.guess()),a.realm={},a.realm=c.getLocalRealm();var e=function(b){for(var c=a.user.realms,d=0;d<c.length;d++){var e=c[d];if(e.id==a.user.default_realm)return e.name}return null};a.defaultRealm={id:a.user.default_realm,name:e(a.user.default_realm)},a.dateObj={date:new Date},a.timezones=moment.tz.names(),a.updateUser=function(c){a.errorObj={},a.user.default_realm=a.defaultRealm.id,a.updateUserForm.$valid?b.updateUser(a.user).then(function(b){d.success("Information saved"),a.user=b,c.$setUntouched(),c.$setPristine()})["catch"](function(a){d.error(a.error.message)}):(angular.forEach(c.$error,function(a){angular.forEach(a,function(a){a.$setTouched()})}),a.errorObj.detail="Please correct errors indicated above and resubmit")},a.$on("REALM_CHANGE_EVENT",function(b){a.realm=b}),a.$on("USER_CHANGE_EVENT",function(){a.user=b.getLocalUser(),a.user&&!a.user.timezone&&(a.user.timezone=moment.tz.guess())})}]);