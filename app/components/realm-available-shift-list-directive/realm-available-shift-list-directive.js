angular.module('myApp.realmAvailableShiftListDirective', [])
.directive('realmAvailableShiftListDirective', ['realmService', 'userService', 'shiftService', function(realmService, userService, shiftService) {
    return {
        scope: {
            realmAvailableShiftListInfo: '=realmAvailableShiftListModel'
        },
        templateUrl: 'components/realm-available-shift-list-directive/realm-available-shift-list.html',
        link: function (scope) {
            var isShiftPresent = function() {
                var user = userService.getActiveUser();
                if(user) {
                    var shifts = shiftService.getLocalShifts();
                    if(shifts) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            };
            scope.isShiftPresent = function() {
                return isShiftPresent();
            }
            scope.$on('SHIFT_CHANGE_EVENT', function() {
                scope.isShiftPresent = function() {
                    return isShiftPresent();
                }
                scope.availableShifts = shiftService.getLocalShifts();
            });

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
                console.log('in delete ' + shiftID);
            }
            var init = function () {
                scope.isShiftPresent = function() {
                    return isShiftPresent();
                }
                scope.availableShifts = shiftService.getLocalShifts();
            };
            init();
        }
    };
}]);