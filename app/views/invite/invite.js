'use strict';

angular.module('ShiftOnTapApp')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
  $stateProvider
      .state('invite', {
        url: '/invite/{invite_email}/code/{invite_code}',
        templateUrl: 'views/invite/invite.html',
        controller: 'InviteCtrl'
      });
}])

.controller('InviteCtrl', ['$scope', '$stateParams', 'userService', 'authService', '$state', '$uibModal', 'Notification',
function($scope, $stateParams, userService, authService, $state, $uibModal, Notification) {
"ngInject";

    var invite_email = $stateParams.invite_email;
    var invite_code = $stateParams.invite_code;
    $scope.email = invite_email;
    $scope.invite_code = invite_code;
    $scope.inviteValid = true;

    var validate_invitee = function() {
        userService.verify_invitee(invite_email, invite_code)
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
    validate_invitee();

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

    // $scope.$on('INVITE_EVENT', function(event, responseObject) {
    //     var error = responseObject.error;
    //     if(error) {
    //         $scope.inviteValid = false;
    //         if(error.code != 1004) {
    //             if(authService.isAuthenticated()) {
    //                 var localUser = userService.getLocalUser();
    //                 if(localUser.email == $scope.email) {
    //                     // TODO Display message stating you're already a member of the realm, so redirecting
    //                     $state.go("persona");
    //                 }
    //                 else {
    //                     authService.logout();
    //                 }
    //             }
    //             else {
    //                 authService.logout();
    //             }
    //         }
    //         //TODO: Display generic try again message
    //     }
    //     else {
    //         if(authService.isAuthenticated()) {
    //             $scope.inviteValid = true;
    //             var localUser = userService.getLocalUser();
    //
    //             var invitedUserID = responseObject.data.user;
    //             // var users = responseObject.data.realm.users;
    //             // var invitedUser = searchArray(invitedUserID, users);
    //             if(invitedUserID == localUser.id) { // && (invitedUser.email == $scope.email)) {
    //                 // The logged in user is the invited user
    //                 $state.go("persona");
    //             }
    //             else {
    //                 // The logged in user is not the invited user
    //                 authService.logout();
    //             }
    //         }
    //         else {
    //             authService.logout();
    //         }
    //     }
    // });

}]);