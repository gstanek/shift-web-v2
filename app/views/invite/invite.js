'use strict';

angular.module('ShiftOnTapApp')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
  $stateProvider
      .state('invite', {
        url: '/invite/{inviteEmail}/code/{inviteCode}',
        templateUrl: 'views/invite/invite.html',
        controller: 'InviteCtrl'
      });
}])

.controller('InviteCtrl', ['$scope', '$stateParams', 'userService', 'authService', '$state', '$uibModal', 'Notification',
function($scope, $stateParams, userService, authService, $state, $uibModal, Notification) {
"ngInject";

    var inviteEmail = $stateParams.inviteEmail;
    var inviteCode = $stateParams.inviteCode;
    $scope.email = inviteEmail;
    $scope.code = inviteCode;

    $scope.inviteValid = true;

    var validateInvitee = function() {
        userService.verifyInvitee(inviteEmail, inviteCode)
            .then(function successCallback(responseObject) {
                if (authService.isAuthenticated()) {
                    $scope.inviteValid = true;
                    var localUser = userService.getLocalUser();
                    var invitedUserID = responseObject.user;
                    if (invitedUserID == localUser.id) { // && (invitedUser.email == $scope.email)) {
                        // The logged in user is the invited user
                        $state.go("persona");
                    }
                    else {
                        // The logged in user is not the invited user
                        authService.logout();
                    }
                }
                else {
                    authService.logout();
                }
            })
            .catch(function errorCallback(errorResponseObject) {
                $scope.inviteValid = false;
                if (errorResponseObject.error.code == 1007) {
                    if (authService.isAuthenticated()) {
                        var localUser = userService.getLocalUser();
                        if (localUser.email == $scope.email) {
                            $state.go('persona');
                            Notification.warning('Invite previously activated, redirected');
                        }
                        else {
                            authService.logout();
                        }
                    }
                    else {
                        authService.logout();
                    }
                }
                else if (errorResponseObject.error.code == 1004) {
                    Notification.error('Invite not found');
                }
                else {
                    console.log('Unknown Error.  errorResponseObject=' + JSON.stringify(errorResponseObject));
                    Notification.error('Oh no! Something went wrong, please try again');
                }
            });
    }
    validateInvitee();

    // Start Modal Logic
    $scope.loginModal = {
        instance: null
    };
    $scope.openLogin = function () {
        $scope.loginModal.instance = $uibModal.open({
            animation: true,
            template: '<auth-modal modal="loginModal" email="email" action="\'login\'" title="\'Login\'"></auth-modal>',
            scope : $scope
        });
    };

    $scope.signupModal = {
        instance: null
    };
    $scope.openSignup = function () {
        $scope.signupModal.instance = $uibModal.open({
            animation: true,
            template: '<auth-modal modal="signupModal" action="\'login\'" title="\'Sign Up\'"></auth-modal>',
            scope : $scope
        });
    };

    // End Modal Logic

}]);