angular.module('myApp')
.directive('addUsersModal', ['$log', 'realmService',
    function($log, realmService) {
    return {
        restrict: 'E',
        templateUrl: 'components/add-users/add-users-modal.html',
        scope: {
            modal2: '='
        },
        controller: function ($scope) {
            $scope.companyName = realmService.getRealmName();
            console.log($scope);

            $scope.ok = function () {
                $scope.modal2.instance.close($scope.selected);
            };

            $scope.cancel = function () {
                $scope.modal2.instance.dismiss('cancel');
            };

            $scope.modal2.instance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };
}]);