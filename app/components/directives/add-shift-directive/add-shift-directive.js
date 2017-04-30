angular.module('ShiftOnTapApp')
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
        templateUrl: 'components/directives/add-shift-directive/add-shift.html',
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
                    if (scope.newShiftModel.first_name != scope.user.first_name || scope.newShiftModel.lastName != scope.user.last_name) {
                        if (scope.newShiftModel.first_name) {
                            scope.user.first_name = scope.newShiftModel.first_name;
                        }
                        if (scope.newShiftModel.last_name) {
                            scope.user.last_name = scope.newShiftModel.last_name;
                        }

                        userService.updateUser(scope.user)
                            .then(function successCallback(response) {
                                userService.setLocalUser(response);
                                //Success
                            }, function errorCallback(response) {
                                // Failure
                                //TODO Handle this
                            });

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
                            //TODO Handle this
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

            var roundNext15Min = function (moment) {
                var intervals = Math.floor(moment.minutes() / 15);
                if(moment.minutes() % 15 != 0)
                    intervals++;
                if(intervals == 4) {
                    moment.add(1, 'hours');
                    intervals = 0;
                }
                moment.minutes(intervals * 15);
                moment.seconds(0);
                return moment;
            }

            // var initDate = new Date();
            var initDate = moment();
            var initDatePlusFifteen = roundNext15Min(initDate);
            scope.shiftDetails = {
                startDate : initDate,
                // startTime : commonService.roundMinutes(initDate),
                startTime : roundNext15Min(moment(initDate)).toDate(),
                endDate : initDate.toDate(),
                // endTime : commonService.roundMinutes(initDate),
                endTime : initDatePlusFifteen.add(15, 'minute').toDate(),
                comment : ''
            }
            // Set max date to 5 years out
            // var maxDate = new Date();
            // maxDate.setFullYear(maxDate.getFullYear() + 5);
            var maxDate = moment().tz(scope.user.timezone).add(5, 'years')
            scope.startDateOptions = {
                formatYear: 'yy',
                maxDate: maxDate.toDate(),//2017-02-25T22:00:00Z
                minDate: moment().tz(scope.user.timezone).toDate(),//.format('YYYY-MM-DDTHH:mm:ssZ'),//new Date(),
                startingDay: 0
            };
            scope.endDateOptions = {
                formatYear: 'yy',
                maxDate: maxDate.toDate(),
                minDate: scope.shiftDetails.startDate,
                startingDay: 0
            };

            var determineMinStartTime = function() {
                if(moment().diff(moment(scope.shiftDetails.startDate), 'days') == 0) {
                    return moment(scope.shiftDetails.startTime).tz(scope.user.timezone).toDate();//.format('YYYY-MM-DDTHH:mm:ssZ');
                }
                else {
                    return moment().startOf('Day').toDate()
                }
            };
            console.log('min start time=' + determineMinStartTime())

            scope.endTimeOptions = {
                formatYear: 'yy',
                maxDate: maxDate.toDate(),
                // minDate: new Date(scope.shiftDetails.startTime.getTime() + 15*60000),
                minDate: moment(scope.shiftDetails.startTime).add(15, 'minutes').tz(scope.user.timezone).toDate(),//.format('YYYY-MM-DDTHH:mm:ssZ'),
                startingDay: 0
            };

            scope.startTimeOptions = {
                formatYear: 'yy',
                maxDate: maxDate.toDate(),
                // minDate: new Date(scope.shiftDetails.startTime.getTime() + 15*60000),
                minDate: determineMinStartTime(),//moment(scope.shiftDetails.startTime.getTime() + 15*60000).valueOf().tz(scope.user.timezone).format('YYYY-MM-DDTHH:mm:ssZ'),
                startingDay: 0
            };




            /** Date selection methods */
            scope.today = function() {
                return moment().toDate();
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
                if(moment(scope.shiftDetails.endDate).isBefore(moment(scope.shiftDetails.startDate))) {
                    scope.shiftDetails.endDate = scope.shiftDetails.startDate;
                }
            });

            // scope.endTime = {
            //     // min: new Date(scope.shiftDetails.startTime.getTime() + 15*60000)
            //     min: moment(scope.shiftDetails.startTime).add(15, 'minutes')
            //
            // };
            // Update minimum shift end time when start time is selected
            scope.$watch('shiftDetails.startTime',function(value){
                if(moment(scope.shiftDetails.endDate).isSame(scope.shiftDetails.startDate, 'day')) {
                    scope.endTimeOptions.minDate = moment(scope.shiftDetails.startTime).add(15, 'minutes').toDate();//roundNext15Min(moment(scope.shiftDetails.startTime)).toDate();//new Date(scope.shiftDetails.startTime.getTime() + 15*60000);
                    if(moment(scope.shiftDetails.endTime).isSameOrBefore(scope.shiftDetails.startTime, 'minute')) {
                        scope.shiftDetails.endTime = moment(scope.shiftDetails.startTime).add(15, 'minutes').toDate();//roundNext15Min(moment(scope.shiftDetails.startTime)).toDate();//new Date(scope.shiftDetails.startTime.getTime() + 15*60000);
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

                    scope.endTimeOptions.minDate = resetMinEnd;

                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    scope.shiftDetails.endDate = tomorrow;
                }
                else {
                    scope.startDateHeader = 'Shift Date';

                    if(moment(scope.shiftDetails.startTime).add(15, 'minutes').isAfter(scope.shiftDetails.endTime)) {
                        scope.shiftDetails.endTime = moment(scope.shiftDetails.startTime).add(15, 'minutes').toDate();
                    }
                    scope.endTimeOptions.minDate = moment(scope.shiftDetails.startTime).add(15, 'minutes').toDate();

                    scope.shiftDetails.endDate = scope.shiftDetails.startDate;

                }
            }

            scope.startTimeHeader = 'Shift Start Time';
            scope.endTimeHeader = 'Shift End Time';
        }
    };
}]);