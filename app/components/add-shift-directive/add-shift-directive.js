angular.module('myApp.addShiftDirective', [])
.directive('addShiftDirective', ['realmService', 'userService', 'shiftService', function(realmService, userService, shiftService) {
    return {
        scope: {
            shiftInfo: '=addShiftModel'
        },
        templateUrl: 'components/add-shift-directive/add-shift.html',
        link: function (scope) {
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




            /*scope.beforeRenderStartDate = function($view, $dates, $leftDate, $upDate, $rightDate) {
                if (scope.dateRangeEnd) {
                    var activeDate = moment(scope.dateRangeEnd);
                    for (var i = 0; i < $dates.length; i++) {
                        if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
                    }
                }
            }
            scope.beforeRenderEndDate = function($view, $dates, $leftDate, $upDate, $rightDate) {
                if (scope.dateRangeStart) {
                    var activeDate = moment(scope.dateRangeStart).subtract(1, $view).add(1, 'minute');
                    for (var i = 0; i < $dates.length; i++) {
                        if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                            $dates[i].selectable = false;
                        }
                    }
                }
            }*/


            scope.today = function() {
                scope.dt = new Date();
            };
            scope.today();

            scope.clear = function() {
                scope.dt = null;
            };

            scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            scope.dateOptions = {
                dateDisabled: false,
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 0,
                allowInvalid: false
            };

            // Disable weekend selection
            //function disabled(data) {
            //    var date = data.date,
            //        mode = data.mode;
            //    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            //}

            scope.toggleMin = function() {
                scope.inlineOptions.minDate = scope.inlineOptions.minDate ? null : new Date();
                scope.dateOptions.minDate = scope.inlineOptions.minDate;
            };

            scope.toggleMin();

            scope.open1 = function() {
                scope.popup1.opened = true;
            };

            scope.open2 = function() {
                scope.popup2.opened = true;
            };

            scope.setDate = function(year, month, day) {
                scope.dt = new Date(year, month, day);
            };

            scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            scope.format = scope.formats[0];
            scope.altInputFormats = ['M!/d!/yyyy'];

            scope.popup1 = {
                opened: false
            };

            scope.popup2 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date(tomorrow);
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

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