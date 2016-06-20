angular.module('myApp')
.directive('myModal', ['$log', 'realmService', 'shiftService', function($log, realmService, shiftService) {
    return {
        restrict: 'E',
        templateUrl: 'components/add-shift-directive/add-shift-modal.html',
        scope: {
            modal: '='
        },
        controller: function ($scope) {
            $scope.companyName = realmService.getRealmName();
            console.log($scope);


            $scope.ok = function () {
                console.log("in OK function");

                // var shiftDAO = {
                //     startDate : $scope.shiftDetails.startDate,
                //     startTime : $scope.shiftDetails.startTime,
                //     endDate : $scope.shiftDetails.endDate,
                //     endTime : $scope.shiftDetails.endTime,
                //     comment : $scope.newShiftModel.comment
                // }
                // shiftService.storeShift(shiftDAO)
                //     .then(function successCallback(response) {
                //         console.log('Success:' + JSON.stringify(response));
                //         shiftService.storeLocalShift(response.data);
                //         $scope.modal.instance.close($scope.selected);
                //     }, function errorCallback(response) {
                //         console.log('Failure:' + JSON.stringify(response));
                //     });

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