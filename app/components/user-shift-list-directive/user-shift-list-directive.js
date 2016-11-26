angular.module('myApp')
.directive('userShiftListDirective', ['realmService', 'userService', 'shiftService','RealmWebSocket', '$uibModal',
    function(realmService, userService, shiftService, RealmWebSocket, $uibModal) {
    return {
        scope: {
            userShiftListInfo: '=userShiftListModel'
        },
        templateUrl: 'components/user-shift-list-directive/user-shift-list.html',
        link: function (scope) {
            scope.reclaim = function(shiftID) {
                updateShift(shiftID, false);
            };

            scope.markAvailable = function(shiftID) {
                var coworkers = userService.getLocalCoworkers();
                if(!coworkers || coworkers.length == 0) {
                    scope.openAddUsersModalAndMarkAvailable(shiftID, true);
                }
                else {
                    updateShift(shiftID, true);
                }
            };

            scope.coworkers = userService.getLocalCoworkers();

            var updateShift = function(id, bAvailable) {
                console.log('in userShiftListDirective.updateShift id=' + id + ', bAvailable=' + bAvailable);
                var shift = {
                    available: bAvailable
                }
                shiftService.updateShift(id, shift)
                    .then(function successCallback(response) {
                        shiftService.setLocalShift(response.data, true);
                    }, function errorCallback(response) {
                        //TODO handle this
                    });
            };
            scope.delete = function(shiftID) {
                shiftService.deleteShift(shiftID)
                    .then(function successCallback(response) {
                        shiftService.removeLocalShift(shiftID, true);
                    }, function errorCallback(response) {
                        if(response.status == 404) {
                            shiftService.removeLocalShift(shiftID, true);
                        }
                    });
            };

            scope.getShiftDisplayMode = function(shift) {
                if(shift.available) {
                    return 'panel-warning';
                }
                else return 'panel-default';
            }

            scope.modal2 = {
                instance: null,
                closeAction: ''
            };
            scope.openAddUsersModalAndMarkAvailable = function (shiftID, markAvailable) {
                scope.modal2.instance = $uibModal.open(/*@ngInject*/{
                    animation: true,
                    template: '<add-users-modal modal2="modal2"></add-users-modal>',
                    scope : scope
                });

                scope.modal2.instance.result.then(
                    function successCallback(result) {
                        if(markAvailable) {
                            updateShift(shiftID, true);
                        }
                    }, function errorCallback(result) {
                        //TODO Handle this
                    }
                );
            };




            scope.$on('SHIFT_CHANGE_EVENT', function() {
                scope.availableShifts = shiftService.getLocalShifts();
            });
            var init = function () {
                scope.availableShifts = shiftService.getLocalShifts();
            };
            init();
        }
    };
}]);