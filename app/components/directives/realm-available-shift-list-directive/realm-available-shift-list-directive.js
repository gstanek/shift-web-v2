angular.module('ShiftOnTapApp')
.directive('realmAvailableShiftListDirective', ['realmService', 'userService', 'shiftService',
    function(realmService, userService, shiftService) {
    return {
        scope: {
            realmAvailableShiftListInfo: '=realmAvailableShiftListModel'
        },
        templateUrl: 'components/directives/realm-available-shift-list-directive/realm-available-shift-list.html',
        link: function (scope) {
            var user = userService.getLocalUser();
            scope.compareStartDateToNow = function(shift) {
                return moment().isBefore(shift.start_datetime);
            }

            scope.reclaim = function(shiftID) {
                updateShift(shiftID, false);
            };
            scope.markAvailable = function(shiftID) {
                updateShift(shiftID, true);
            };

            var updateShift = function(id, bAvailable) {
                var shift = {
                    available: bAvailable
                }
                shiftService.updateShift(id, shift)
                    .then(function successCallback(response) {
                        shiftService.setLocalShift(response.data, true);
                        console.log('Success:' + JSON.stringify(response));
                    }, function errorCallback(response) {
                        console.log('Failure:' + JSON.stringify(response));
                    });
            };
            scope.delete = function(shiftID) {
                shiftService.deleteShift(shiftID)
                    .then(function successCallback(response) {
                        console.log('Success:' + JSON.stringify(response));
                        shiftService.removeLocalShift(shiftID, true);
                    }, function errorCallback(response) {
                        if(response.status == 404) {
                            shiftService.removeLocalShift(shiftID, true);
                        }
                        console.log('Failure:' + JSON.stringify(response));
                    });
            };

            scope.getShiftDisplayMode = function(shift) {
                if(shift.available && shift.user == user.id) {
                    return 'panel-warning';
                }
                else return 'panel-default';
            }



            scope.$on('SHIFT_CHANGE_EVENT', function(event, shifts) {
                // scope.availableShifts = shiftService.getLocalShifts();
                scope.availableShifts = shifts;
            });
            var init = function () {
                scope.availableShifts = shiftService.getLocalShifts();
            };
            init();
        }
    };
}]);