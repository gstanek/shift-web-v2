
//angular.module('myApp.userShiftListDirective', [])
angular.module('myApp')
    .directive('shiftBlock', ['realmService', 'userService', 'shiftService','RealmWebSocket',//
        function(realmService, userService, shiftService, RealmWebSocket) { //
            return {
                scope: {
                    shift: '='
                },
                templateUrl: 'components/directives/shift-block/shift-block.html',
                link: function (scope) {
                    scope.$on('SHIFT_CHANGE_EVENT', function() {
                        scope.availableShifts = shiftService.getLocalShifts();
                    });

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