angular.module('myApp')
    .directive('authModal', ['$log', 'authService', '$uibModal',
        function($log, authService, $uibModal) {
        return {
            restrict: 'E',
            templateUrl: 'components/auth-modal/auth-modal.html',
            scope: {
                modal: '=',
                errorObj: '=',
                title: '=',
                action: '='
            },
            controller: function ($scope) {
                $scope.credentials = {};
                $scope.showpassword = false;
                $scope.showPasswordModel = { value : 'password'}

                $scope.login = function (form) {
                    if(form.$valid) {
                        authService.login($scope.credentials);
                        if($scope.modal) {
                            $scope.modal.instance.close();
                        }
                    }
                    else {
                        $scope.errorObj.detail='Please correct errors listed above and re-submit';
                    }
                };

                $scope.signup = function (form) {
                    if(form.$valid) {
                        authService.signup($scope.credentials);
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
                        // form.$setDirty;
                        // form.$setTouched();
                        $scope.errorObj.detail='Please correct errors listed above and re-submit';
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
                        template: '<auth-modal modal="secondModal" error-obj="errorObj" action="\'login\'" title="\'Login\'"></auth-modal>',
                        scope : $scope
                    });
                };
                // End Modal Logic

            }
        };
    }]);