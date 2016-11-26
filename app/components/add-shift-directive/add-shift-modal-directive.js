angular.module('myApp')
.directive('shiftModal', ['$log', 'realmService',
    function($log, realmService) {
    "ngInject";
    return {
        restrict: 'E',
        templateUrl: 'components/add-shift-directive/add-shift-modal.html',
        scope: {
            modal: '=',
            errorObj : '='
        },
        controller: function ($scope) {
            $scope.companyName = realmService.getRealmName();
            console.log($scope);

            $scope.ok = function () {
                $scope.modal.instance.close($scope.selected);
            };

            $scope.cancel = function () {
                $scope.modal.instance.dismiss('cancel');
            };

            $scope.modal.instance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };
}]);