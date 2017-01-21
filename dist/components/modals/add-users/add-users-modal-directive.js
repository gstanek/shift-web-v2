angular.module('ShiftOnTapApp')
.directive('addUsersModal', ['$log', 'realmService',
    function($log, realmService) {
    return {
        restrict: 'E',
        templateUrl: 'components/modals/add-users/add-users-modal.html',
        scope: {
            modal: '='
        },
        controller: function ($scope) {
            $scope.companyName = realmService.getRealmName();
            console.log($scope);

            $scope.ok = function () {
                $scope.modal.instance.close('success');
            };

            $scope.cancel = function () {
                $scope.modal.instance.dismiss('cancel');
            };

            $scope.modal.instance.result.then(function (result) {
                $log.info('Modal closed at: ' + new Date() + 'result: ' + result);
            }, function (result) {
                $log.info('Modal dismissed at: ' + new Date() + 'result: ' + result);
            });
        }
    };
}]);