angular.module('myApp')
.directive('addShiftDirective', ['realmService', 'userService', 'shiftService', 'commonService',
    function(realmService, userService, shiftService, commonService) {
    "ngInject";
    return {
        restrict: 'E',
        scope: {
            'save': '&onSave',
            'cancel': '&onCancel',
            'errorObj': '='
        },
        templateUrl: 'components/add-shift-directive/add-shift.html',
        link: function (scope, element, attrs, ngModel) {
            scope.isActiveRealm = realmService.isActiveRealm();
            scope.user = userService.getLocalUser();
            var isShiftPresent = function() {
                if(scope.user) {
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
                comment : '',
                first_name : scope.user.first_name,
                last_name : scope.user.last_name
            };
            scope.createShift = function(form) {
                if(form.$valid) {
                    if (scope.newShiftModel.first_name || scope.newShiftModel.lastName) {
                        if (scope.newShiftModel.first_name) {
                            scope.user.first_name = scope.newShiftModel.first_name;
                        }
                        if (scope.newShiftModel.last_name) {
                            scope.user.last_name = scope.newShiftModel.last_name;
                        }
                        // scope.updateUser();

                    }
                    var shiftDAO = {
                        startDate: scope.shiftDetails.startDate,
                        startTime: scope.shiftDetails.startTime,
                        endDate: scope.shiftDetails.endDate,
                        endTime: scope.shiftDetails.endTime,
                        comment: scope.newShiftModel.comment
                    };
                    shiftService.storeShift(shiftDAO)
                        .then(function successCallback(response) {
                            shiftService.setLocalShift(response.data, true);
                            scope.save();
                        }, function errorCallback(response) {
                            console.log('Failure:' + JSON.stringify(response));
                        });
                }
                else {
                    angular.forEach(form.$error, function (field) {
                        angular.forEach(field, function(errorField){
                            errorField.$setTouched();
                        })
                    });
                    scope.errorObj.detail='Please correct errors indicated above and resubmit';
                }
            };

            // scope.updateUser = function() {
            //     userService.updateUser(scope.user)
            //         .then(function successCallback(response) {
            //             userService.setLocalUser(response.data.user, true);
            //         }, function errorCallback(response) {
            //             console.log('Failure:' + JSON.stringify(response));
            //         });
            // }

            /** Date Selection Initial Configuration */
            scope.format = 'shortDate';
            scope.popup1 = {
                opened: false
            };
            scope.popup2 = {
                opened: false

            };
            var initDate = new Date();
            scope.shiftDetails = {
                startDate : initDate,
                startTime : commonService.roundMinutes(initDate),
                endDate : initDate,
                endTime : commonService.roundMinutes(initDate),
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
                minDate: scope.shiftDetails.startDate,
                startingDay: 0
            };

            scope.endTimeOptions = {
                formatYear: 'yy',
                maxDate: maxDate,
                minDate: new Date(scope.shiftDetails.startTime.getTime() + 15*60000),
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

            scope.endTime = {
                min: new Date(scope.shiftDetails.startTime.getTime() + 15*60000)
            };
            // Update minimum shift end time when start time is selected
            scope.$watch('shiftDetails.startTime',function(value){
                if(scope.shiftDetails.endDate.getDate() == scope.shiftDetails.startDate.getDate()) {
                    scope.endTime.min = new Date(scope.shiftDetails.startTime.getTime() + 15*60000);
                    if(scope.shiftDetails.endTime <= scope.shiftDetails.startTime) {
                        scope.shiftDetails.endTime = new Date(scope.shiftDetails.startTime.getTime() + 15*60000);
                    }
                }
            });


            // By default, assume shift ends on same date it starts, so initially hiding the end date selection
            scope.showEndDateEntry = false;
            scope.startDateHeader = 'Shift Date';
            scope.endDateHeader = 'Shift End Date';
            scope.toggleShowEndDate = function() {
                scope.showEndDateEntry = !scope.showEndDateEntry;
                if(scope.showEndDateEntry) {
                    scope.startDateHeader = 'Shift Start Date';

                    var resetMinEnd = new Date()
                    resetMinEnd.setHours(0);
                    resetMinEnd.setMinutes(0);
                    resetMinEnd.setMilliseconds(0);
                    scope.endTime.min = resetMinEnd;

                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    scope.shiftDetails.endDate = tomorrow;
                }
                else {
                    scope.startDateHeader = 'Shift Date';

                    if((scope.shiftDetails.startTime.getTime() + 15*60000) > scope.shiftDetails.endTime.getTime()) {
                        scope.shiftDetails.endTime = new Date(scope.shiftDetails.startTime.getTime() + 15*60000);
                    }
                    scope.endTime.min = new Date(scope.shiftDetails.startTime.getTime() + 15*60000);

                    scope.shiftDetails.endDate = scope.shiftDetails.startDate;

                }
            }

            scope.startTimeHeader = 'Shift Start Time';
            scope.endTimeHeader = 'Shift End Time';
        }
    };
}]);