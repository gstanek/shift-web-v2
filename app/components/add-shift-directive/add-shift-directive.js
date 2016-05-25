angular.module('myApp.addShiftDirective', [])
.directive('addShiftDirective', ['realmService', 'userService', 'shiftService', function(realmService, userService, shiftService) {
    return {
        scope: {
            shiftInfo: '=addShiftModel'
        },
        templateUrl: 'components/add-shift-directive/add-shift.html',
        link: function (scope, element, attrs, ngModel) {
            scope.isActiveRealm = realmService.isActiveRealm();
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

            scope.companyName = realmService.getRealmName();
            scope.newShiftModel = {
                id : '',
                dateRangeStart : '',
                dateRangeEnd : '',
                comment : ''
            };
            scope.createShift = function() {
                var realm = realmService.getLocalRealm();
                var shift = {
                    start_datetime : scope.newShiftModel.dateRangeStart,
                    end_datetime : scope.newShiftModel.dateRangeEnd,
                    available : false,
                    realm : realm.id,
                    comment : scope.newShiftModel.comment
                };

                shiftService.storeShift(shift)
                    .then(function successCallback(response) {
                        console.log('Success:' + JSON.stringify(response));
                        shiftService.storeLocalShift(response.data);
                    }, function errorCallback(response) {
                        console.log('Failure:' + JSON.stringify(response));
                    });
            };

            /** Date Selection Initial Configuration */
            scope.format = 'shortDate';
            scope.popup1 = {
                opened: false
            };
            scope.popup2 = {
                opened: false
            };
            scope.shiftDetails = {
                startDate : null,
                startTime : null,
                endDate : null,
                endTime : null,
                comment : ''
            }
            // Set max date to 5 years out
            var maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 5);
            scope.startDateOptions = {
                formatYear: 'yy',
                maxDate: maxDate,
                minDate: new Date(),
                startingDay: 0
            };
            scope.endDateOptions = {
                formatYear: 'yy',
                maxDate: maxDate,
                minDate: new Date(),
                startingDay: 0
            };

            /** Date selection methods */
            scope.today = function() {
                return new Date();
            };
            scope.startDateToday = function() {
                scope.shiftDetails.startDate = scope.today();
            }
            scope.startDateToday();

            scope.endDateToday = function() {
                scope.shiftDetails.endDate = scope.today();
            }
            scope.endDateToday();

            scope.startDateClear = function() {
                scope.shiftDetails.startDate = null
            }
            scope.endDateClear = function() {
                scope.shiftDetails.endDate = null
            }

            scope.open1 = function() {
                scope.popup1.opened = true;
            };
            scope.open2 = function() {
                scope.popup2.opened = true;
            };

            // Update minimum shift end date when start date is selected
            scope.$watch('shiftDetails.startDate',function(value){
                scope.endDateOptions.minDate = scope.shiftDetails.startDate;
                if(scope.shiftDetails.endDate < scope.shiftDetails.startDate) {
                    scope.shiftDetails.endDate = scope.shiftDetails.startDate;
                }
            });

            // By default, assume shift ends on same date it starts, so initially hiding the end date selection
            scope.showEndDateEntry = false;
            scope.startDateHeader = 'Date of Shift';
            scope.toggleShowEndDate = function() {
                scope.showEndDateEntry = !scope.showEndDateEntry;
                if(scope.showEndDateEntry) {
                    scope.startDateHeader = 'Start Date of Shift';
                }
                else {
                    scope.startDateHeader = 'Date of Shift';
                }
            }

        }
    };
}]);