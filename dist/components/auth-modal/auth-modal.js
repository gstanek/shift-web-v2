angular.module('myApp')
    .directive('authModal', ['$log', 'authService', '$uibModal',
        function($log, authService, $uibModal) {
        return {
            restrict: 'E',
            templateUrl: 'components/auth-modal/auth-modal.html',
            scope: {
                modal: '=',
                // errorObj: '=',
                title: '=',
                email: '=',
                action: '=',
                inviteCode: '=?'
            },
            controller: function ($scope) {

                $scope.$on('AUTH_SUCCESS_EVENT', function(event, responseObj) {
                    console.log('In AUTH_SUCCESS_EVENT');
                    $scope.requestStatus = responseObj.status;
                    $scope.modal.instance.close();
                });
                $scope.$on('AUTH_FAILURE_EVENT', function(event, responseObj) {
                    console.log('In AUTH_FAILURE_EVENT');
                    $scope.requestStatus = responseObj.status;
                    $scope.errorObj = {
                        detail: responseObj.message
                    }
                    console.log('In AUTH_FAILURE_EVENT, $scope.errorObj.detail=' + $scope.errorObj.detail);
                });

                $scope.credentials = {
                    email: $scope.email
                };
                $scope.showpassword = false;
                $scope.showPasswordModel = {
                    value : 'password',
                    placeholder : 'Password'
                }
                if($scope.action == 'accept') {
                    $scope.showPasswordModel.placeholder = 'Create Password';
                }
                else {
                    $scope.showPasswordModel.placeholder = 'Password';
                }

                $scope.acceptInvite = function (form) {
                    if(form.$valid) {
                        authService.accept_invite($scope.credentials, $scope.inviteCode);
                        if($scope.modal) {
                            $scope.modal.instance.close();
                        }
                    }
                    else {
                        angular.forEach(form.$error, function (field) {
                            angular.forEach(field, function(errorField){
                                errorField.$setTouched();
                            })
                        });
                        $scope.errorObj.detail='Please correct errors indicated above and resubmit';
                    }
                };

                $scope.login = function (form) {
                    if(form.$valid) {
                        authService.login($scope.credentials);
                        // if($scope.modal) {
                        // if($scope.requestStatus == 'success') {
                        //     $scope.modal.instance.close();
                        // }
                    }
                    else {
                        angular.forEach(form.$error, function (field) {
                            angular.forEach(field, function(errorField){
                                errorField.$setTouched();
                            })
                        });
                        $scope.errorObj.detail='Please correct errors indicated above and resubmit';
                    }
                };

                $scope.signup = function (form) {
                    if(form.$valid) {
                        authService.signup($scope.credentials, $scope.channel);
                        if($scope.modal) {
                            $scope.modal.instance.close();
                        }
                    }
                    else {
                        angular.forEach(form.$error, function (field) {
                            angular.forEach(field, function(errorField){
                                errorField.$setTouched();
                            })
                        });
                        $scope.errorObj.detail='Please correct errors indicated above and resubmit';
                    }

                };



                $scope.cancel = function () {
                    if($scope.modal) {
                        $scope.modal.instance.dismiss('cancel');
                    }
                };

                // Start Modal Logic
                $scope.secondModal = {
                    instance: null
                };
                $scope.openLogin = function () {
                    $scope.errorObj.detail='';
                    $scope.errorObj.code=0;
                    // $scope.secondErrorDesc='';
                    $scope.secondModal.instance = $uibModal.open({
                        animation: true,
                        template: '<auth-modal modal="secondModal" error-obj="errorObj" action="\'login\'" email="email" title="\'Login\'"></auth-modal>',
                        scope : $scope
                    });
                };
                // End Modal Logic

            }
        };
    }]);