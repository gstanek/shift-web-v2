angular.module('myApp')
    .directive('authModal', ['$log', 'authService',
        function($log, authService) {
        return {
            restrict: 'E',
            templateUrl: 'components/auth-modal/auth-modal.html',
            scope: {
                modal: '=',
                errorDesc: '=',
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
                        console.log('Login Form not valid');
                        alert('Please ensure username and password are entered');
                    }
                };

                $scope.signup = function () {
                    authService.signup($scope.credentials);
                    if($scope.modal) {
                        $scope.modal.instance.close();
                    }

                };

                $scope.cancel = function () {
                    if($scope.modal) {
                        $scope.modal.instance.dismiss('cancel');
                    }
                };

            }
        };
    }]);