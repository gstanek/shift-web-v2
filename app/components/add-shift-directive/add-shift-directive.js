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

            scope.shiftDetails = {
                startDate : null,
                startTime : null,
                endDate : null,
                endTime : null,
                comment : ''
            }


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

            //scope.inlineOptions = {
            //    customClass: getDayClass,
            //    minDate: new Date(),
            //    showWeeks: true
            //};

            var maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 5);
            scope.startDateOptions = {
                formatYear: 'yy',
                // 5 years out for max date
                maxDate: maxDate,
                minDate: new Date(),
                startingDay: 0
            };



            scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            scope.endDateOptions = {
                formatYear: 'yy',
                // 5 years out for max date
                maxDate: maxDate,
                //TODO: Get endMinDate to dynamically update
                minDate: new Date(),
                startingDay: 0
            };

            //scope.toggleMin = function() {
            //    scope.inlineOptions.minDate = scope.inlineOptions.minDate ? null : new Date();
            //    scope.endDateOptions.minDate = scope.inlineOptions.minDate;
            //};
            //scope.toggleMin();

            scope.endMinDate = new Date();
            scope.$watch('shiftDetails.startDate',function(value){
                //scope.inlineOptions.minDate = scope.inlineOptions.minDate ? null : new Date();
                scope.endDateOptions.minDate = scope.shiftDetails.startDate;
                if(scope.shiftDetails.endDate < scope.shiftDetails.startDate) {
                    scope.shiftDetails.endDate = scope.shiftDetails.startDate;
                }
                //console.log('Value:' + JSON.stringify(value));
                //scope.toggleMin();
                //scope.endDateOptions.minDate = getDayClass(value);
                //scope.endMinDate = value;
            });

            //scope.endDateOptions.minDate = scope.shiftDetails.startDate ? scope.shiftDetails.startDate : new Date();

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


            //scope.toggleMin = function() {
                //scope.inlineOptions.minDate = scope.inlineOptions.minDate ? null : new Date();
                //scope.dateOptions.minDate = scope.inlineOptions.minDate;
            //};

            //scope.toggleMin();

            scope.open1 = function() {
                scope.popup1.opened = true;
            };

            scope.open2 = function() {
                scope.popup2.opened = true;
            };

            //scope.setStartDate = function(year, month, day) {
            //    scope.shiftDetails.startDate = new Date(year, month, day);
            //};
            //
            //scope.setEndDate = function(year, month, day) {
            //    scope.shiftDetails.endDate = new Date(year, month, day);
            //};

            //scope.setDate = function(year, month, day) {
            //    scope.shiftDetails.startDate = new Date(year, month, day);
            //};

            //scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            //scope.format = scope.formats[0];
            scope.format = 'shortDate';
            //scope.altInputFormats = ['M!/d!/yyyy'];

            scope.popup1 = {
                opened: false
            };

            scope.popup2 = {
                opened: false
            };

            //var tomorrow = new Date();
            //tomorrow.setDate(tomorrow.getDate() + 1);
            //var afterTomorrow = new Date();
            //afterTomorrow.setDate(tomorrow.getDate() + 1);
            //scope.events = [
            //    {
            //        date: tomorrow,
            //        status: 'full'
            //    },
            //    {
            //        date: afterTomorrow,
            //        status: 'partially'
            //    }
            //];

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0,0,0,0);

                    for (var i = 0; i < scope.events.length; i++) {
                        var currentDay = new Date(scope.events[i].date).setHours(0,0,0,0);

                        if (dayToCheck === currentDay) {
                            return scope.events[i].status;
                        }
                    }
                }

                return '';
            }


        }
    };
}]);