"use strict";angular.module("ShiftOnTapApp").config(["$stateProvider","$urlRouterProvider",function(a){a.state("invite",{url:"/invite/{inviteEmail}/code/{inviteCode}",templateUrl:"views/invite/invite.html",controller:"InviteCtrl"})}]).controller("InviteCtrl",["$scope","$stateParams","userService","authService","$state","$uibModal","Notification",function(a,b,c,d,e,f,g){"ngInject";var h=b.inviteEmail,i=b.inviteCode;a.email=h,a.code=i,a.inviteValid=!0;var j=function(){c.verifyInvitee(h,i).then(function(b){if(d.isAuthenticated()){a.inviteValid=!0;var f=c.getLocalUser(),g=b.user;g==f.id?e.go("persona"):d.logout()}else d.logout()})["catch"](function(b){if(a.inviteValid=!1,1007==b.error.code)if(d.isAuthenticated()){var f=c.getLocalUser();f.email==a.email?(e.go("persona"),g.warning("Invite previously activated, redirected")):d.logout()}else d.logout();else 1004==b.error.code?g.error("Invite not found"):(console.log("Unknown Error.  errorResponseObject="+JSON.stringify(b)),g.error("Oh no! Something went wrong, please try again"))})};j(),a.loginModal={instance:null},a.openLogin=function(){a.loginModal.instance=f.open({animation:!0,template:'<auth-modal modal="loginModal" email="email" action="\'login\'" title="\'Login\'"></auth-modal>',scope:a})},a.signupModal={instance:null},a.openSignup=function(){a.signupModal.instance=f.open({animation:!0,template:'<auth-modal modal="signupModal" action="\'login\'" title="\'Sign Up\'"></auth-modal>',scope:a})}}]);