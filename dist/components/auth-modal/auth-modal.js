angular.module('myApp')
    .directive('authModal', ['$log', 'authService',
        function($log, authService) {
        return {
            restrict: 'E',
            templateUrl: 'components/auth-modal/auth-modal.html',
            scope: {
                modal: '='
            },
            controller: function ($scope) {
                console.log($scope);
                $scope.credentials = {};
                $scope.showpassword = false;

                $scope.login = function (form) {
                    if(form.$valid) {
                        authService.login($scope.credentials);
                        $scope.modal.instance.close();
                    }
                    else {
                        console.log('Login Form not valid');
                        alert('Please ensure username and password are entered');
                    }
                };

                $scope.signup = function () {
                    $scope.modal.instance.close();
                };

                $scope.cancel = function () {
                    $scope.modal.instance.dismiss('cancel');
                };

            }
        };
    }]);