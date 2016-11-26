angular.module('myApp')
.directive('addUsersModal', ['$log', 'realmService',
    function($log, realmService) {
    return {
        restrict: 'E',
        templateUrl: 'components/add-users/add-users-modal.html',
        scope: {
            modal2: '=',
            errorObj: '='
        },
        controller: function ($scope) {
            $scope.companyName = realmService.getRealmName();
            console.log($scope);

            $scope.ok = function () {
                $scope.modal2.instance.close('success');
            };

            $scope.cancel = function () {
                $scope.modal2.instance.dismiss('cancel');
            };

            $scope.modal2.instance.result.then(function (result) {
                $log.info('Modal closed at: ' + new Date() + 'result: ' + result);
            }, function (result) {
                $log.info('Modal dismissed at: ' + new Date() + 'result: ' + result);
            });
        }
    };
}]);