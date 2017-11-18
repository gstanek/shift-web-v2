angular.module('ShiftOnTapApp')
    .directive('shiftBlock', ['realmService', 'userService', 'shiftService','RealmWebSocket',//
        function(realmService, userService, shiftService, RealmWebSocket) { //
            return {
                scope: {
                    shift: '='
                },
                templateUrl: 'components/directives/shift-block/shift-block.html',
                link: function (scope) {
                    scope.$on('SHIFT_CHANGE_EVENT', function(event, shifts) {
                        // scope.availableShifts = shiftService.getLocalShifts();
                        scope.availableShifts = shifts;
                    });

                    // scope.user = {
                    //     timezone : userService.getLocalTimezone();
                    // };

                    scope.user = userService.getLocalUser();
                    scope.coworkers = userService.getLocalCoworkers();


                    scope.claim = function(shiftID) {
                        updateShift(shiftID, false, user.id);
                    };
                    scope.reclaim = function(shiftID) {
                        updateShift(shiftID, false, undefined);
                    };
                    scope.markAvailable = function(shiftID) {
                        updateShift(shiftID, true);
                    };

                    var updateShift = function(shiftID, bAvailable, userID) {

                        var shift = {
                            available: bAvailable
                        };
                        if(userID) {
                            shift.userID = userID;
                        }
                        shiftService.updateShift(shiftID, shift)
                            .then(function successCallback(response) {
                                console.log('Success:' + JSON.stringify(response));
                                shiftService.setLocalShift(response.data, true);
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