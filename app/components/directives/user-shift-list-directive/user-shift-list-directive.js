angular.module('ShiftOnTapApp')
.directive('userShiftListDirective', ['realmService', 'userService', 'shiftService','RealmWebSocket', '$uibModal',
    function(realmService, userService, shiftService, RealmWebSocket, $uibModal) {
    return {
        scope: {
            userShiftListInfo: '=userShiftListModel'
        },
        templateUrl: 'components/directives/user-shift-list-directive/user-shift-list.html',
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
            scope.activeUser = userService.getLocalUser();

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

            // Start Modal Logic
            scope.modal = {
                instance: null
            };
            scope.errorObj = {
                detail: '',
                code: 0
            }
            scope.openAddShiftModal = function () {
                scope.errorObj.detail='';
                scope.errorObj.code=0;
                scope.modal.instance = $uibModal.open({
                    animation: true,
                    template: '<shift-modal modal="modal" error-obj="errorObj"></shift-modal>',
                    scope : scope
                });
            };
            // End Modal Logic




            scope.$on('SHIFT_CHANGE_EVENT', function(event, shifts) {
                // scope.shifts = shiftService.getLocalShifts();
                scope.shifts = shifts;
            });
            var init = function () {
                scope.activeUser = userService.getLocalUser()
                scope.shifts = shiftService.getLocalShifts();
            };
            init();
        }
    };
}]);