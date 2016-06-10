
angular.module('myApp.userShiftListDirective', [])
//angular.module('myApp')
.directive('userShiftListDirective', ['realmService', 'userService', 'shiftService', function(realmService, userService, shiftService) {
    return {
        scope: {
            userShiftListInfo: '=userShiftListModel'
        },
        templateUrl: 'components/user-shift-list-directive/user-shift-list.html',
        link: function (scope) {
            scope.reclaim = function(shiftID) {
                updateShift(shiftID, false);
            }
            scope.markAvailable = function(shiftID) {
                console.log('ShiftID: ' + JSON.stringify(shiftID))
                updateShift(shiftID, true);
            }

            var updateShift = function(id, bAvailable) {
                var shift = {
                    available: bAvailable
                }
                shiftService.updateShift(id, shift)
                    .then(function successCallback(response) {
                        console.log('Success:' + JSON.stringify(response));
                        shiftService.storeLocalShift(response.data);
                    }, function errorCallback(response) {
                        console.log('Failure:' + JSON.stringify(response));
                    });
            }
            scope.delete = function(shiftID) {
                shiftService.deleteShift(shiftID)
                    .then(function successCallback(response) {
                        console.log('Success:' + JSON.stringify(response));
                        shiftService.removeLocalShift(shiftID);
                    }, function errorCallback(response) {
                        if(response.status == 404) {
                            shiftService.removeLocalShift(shiftID);
                        }
                        console.log('Failure:' + JSON.stringify(response));
                    });
            }
            var init = function () {
                scope.isShiftPresent = function() {
                    return isShiftPresent();
                }
                scope.availableShifts = shiftService.getLocalShifts();
                //var timezone = jstz.determine();
            };
            init();
        }
    };
}]);